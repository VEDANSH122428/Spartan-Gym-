import smtplib
from email.mime.text import MIMEText
from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from fastapi.responses import StreamingResponse
import io
from openpyxl import Workbook

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

JWT_SECRET = os.environ.get('JWT_SECRET', 'spartans-gym-secret-key-2024')
JWT_ALGORITHM = 'HS256'
security = HTTPBearer()
PLAN_DURATIONS = {
    "monthly": 30,
    "quarterly": 90,
    "half-yearly": 182,
    "yearly": 365,
    "personal-training": 30
}

EMAIL_ADDRESS = os.environ.get('EMAIL_ADDRESS')
EMAIL_APP_PASSWORD = os.environ.get('EMAIL_APP_PASSWORD')
CRON_SECRET = os.environ.get('CRON_SECRET', 'change-me')

def send_email(to_email: str, subject: str, body: str):
    if not EMAIL_ADDRESS or not EMAIL_APP_PASSWORD:
        return
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = to_email
    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_APP_PASSWORD)
            smtp.send_message(msg)
    except Exception as e:
        logging.getLogger(__name__).error(f"Email send failed: {e}")

class Member(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    membership_plan: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    active: bool = True
    membership_status: str = "pending"
    membership_start: Optional[str] = None
    membership_end: Optional[str] = None
    reminder_sent: bool = False

class MemberCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    membership_plan: str

    class MembershipActivate(BaseModel):
    start_date: str

class Admin(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminLoginResponse(BaseModel):
    token: str
    username: str

class Attendance(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    member_id: str
    member_name: str
    date: str
    present: bool
    marked_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AttendanceMark(BaseModel):
    member_id: str
    member_name: str
    present: bool

class AttendanceResponse(BaseModel):
    member_id: str
    member_name: str
    present: bool
    date: str

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=401, detail="Authentication required")

@api_router.get("/")
async def root():
    return {"message": "Spartans Gym API"}

@api_router.post("/admin/setup")
async def setup_admin():
    existing = await db.admins.find_one({"username": "admin"})
    if existing:
        return {"message": "Admin already exists"}
    
    password = "spartans2024"
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    admin = Admin(username="admin", password_hash=password_hash)
    doc = admin.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.admins.insert_one(doc)
    return {"message": "Admin created", "username": "admin", "password": password}

@api_router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(login_data: AdminLogin):
    admin = await db.admins.find_one({"username": login_data.username}, {"_id": 0})
    
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not bcrypt.checkpw(login_data.password.encode('utf-8'), admin['password_hash'].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token_payload = {
        "username": admin['username'],
        "exp": datetime.now(timezone.utc) + timedelta(hours=24)
    }
    token = jwt.encode(token_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    return AdminLoginResponse(token=token, username=admin['username'])

@api_router.post("/members", response_model=Member)
async def create_member(member_data: MemberCreate):
    existing = await db.members.find_one({"email": member_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Member with this email already exists")
    
    member = Member(**member_data.model_dump())
    doc = member.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.members.insert_one(doc)
    return member

@api_router.get("/members", response_model=List[Member])
async def get_members(token_payload: dict = Depends(verify_token)):
    members = await db.members.find({"active": True}, {"_id": 0}).to_list(1000)
    
    for member in members:
        if isinstance(member['created_at'], str):
            member['created_at'] = datetime.fromisoformat(member['created_at'])
    
    return members

@api_router.post("/attendance", response_model=AttendanceResponse)
async def mark_attendance(attendance_data: AttendanceMark, token_payload: dict = Depends(verify_token)):
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    existing = await db.attendance.find_one({
        "member_id": attendance_data.member_id,
        "date": today
    }, {"_id": 0})
    
    if existing:
        await db.attendance.update_one(
            {"member_id": attendance_data.member_id, "date": today},
            {"$set": {"present": attendance_data.present, "marked_at": datetime.now(timezone.utc).isoformat()}}
        )
    else:
        attendance = Attendance(
            member_id=attendance_data.member_id,
            member_name=attendance_data.member_name,
            date=today,
            present=attendance_data.present
        )
        doc = attendance.model_dump()
        doc['marked_at'] = doc['marked_at'].isoformat()
        await db.attendance.insert_one(doc)
    
    return AttendanceResponse(
        member_id=attendance_data.member_id,
        member_name=attendance_data.member_name,
        present=attendance_data.present,
        date=today
    )

@api_router.get("/attendance/today", response_model=List[AttendanceResponse])
async def get_today_attendance(token_payload: dict = Depends(verify_token)):
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    attendance_records = await db.attendance.find({"date": today}, {"_id": 0}).to_list(1000)
    
    return [
        AttendanceResponse(
            member_id=record['member_id'],
            member_name=record['member_name'],
            present=record['present'],
            date=record['date']
        )
        for record in attendance_records
    ]

@api_router.get("/attendance/export")
async def export_attendance(date: Optional[str] = None, token_payload: dict = Depends(verify_token)):
    if not date:
        date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    attendance_records = await db.attendance.find({"date": date}, {"_id": 0}).sort("member_name", 1).to_list(1000)
    
    wb = Workbook()
    ws = wb.active
    ws.title = f"Attendance {date}"
    
    ws.append(["Member Name", "Member ID", "Date", "Status"])
    
    for record in attendance_records:
        ws.append([
            record['member_name'],
            record['member_id'],
            record['date'],
            "Present" if record['present'] else "Absent"
        ])
    
    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=attendance_{date}.xlsx"}
    )

@api_router.put("/members/{member_id}/membership", response_model=Member)
async def activate_membership(member_id: str, data: MembershipActivate, token_payload: dict = Depends(verify_token)):
    member = await db.members.find_one({"id": member_id}, {"_id": 0})
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    duration_days = PLAN_DURATIONS.get(member['membership_plan'], 30)
    start = datetime.strptime(data.start_date, "%Y-%m-%d")
    end = start + timedelta(days=duration_days)

    await db.members.update_one(
        {"id": member_id},
        {"$set": {
            "membership_status": "active",
            "membership_start": data.start_date,
            "membership_end": end.strftime("%Y-%m-%d"),
            "reminder_sent": False
        }}
    )

    updated = await db.members.find_one({"id": member_id}, {"_id": 0})
    if isinstance(updated['created_at'], str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    return Member(**updated)

@api_router.post("/cron/check-expiry")
async def check_expiry(x_cron_secret: Optional[str] = Header(None)):
    if x_cron_secret != CRON_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")

    today = datetime.now(timezone.utc).date()
    reminder_date = today + timedelta(days=3)
    members = await db.members.find({"membership_status": "active"}, {"_id": 0}).to_list(1000)
    results = {"reminders_sent": 0, "expired": 0}

    for m in members:
        if not m.get('membership_end'):
            continue
        end_date = datetime.strptime(m['membership_end'], "%Y-%m-%d").date()

        if end_date < today:
            await db.members.update_one({"id": m['id']}, {"$set": {"membership_status": "expired"}})
            send_email(
                m['email'],
                "Your Spartans Gym Membership Has Expired",
                f"Hi {m['name']},\n\nYour {m['membership_plan']} membership expired on {m['membership_end']}. Please renew to continue enjoying our facilities.\n\n- Spartans Gym"
            )
            results["expired"] += 1
        elif end_date == reminder_date and not m.get('reminder_sent'):
            send_email(
                m['email'],
                "Your Spartans Gym Membership is Expiring Soon",
                f"Hi {m['name']},\n\nYour {m['membership_plan']} membership will expire on {m['membership_end']}. Please renew soon to avoid interruption.\n\n- Spartans Gym"
            )
            await db.members.update_one({"id": m['id']}, {"$set": {"reminder_sent": True}})
            results["reminders_sent"] += 1

    return results
    
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
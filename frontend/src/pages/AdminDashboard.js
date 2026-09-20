import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, LogOut, Download, Users, CheckCircle, XCircle, RefreshCw, Calendar, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import * as XLSX from 'xlsx';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [markingAttendance, setMarkingAttendance] = useState({});
  const [activatingMember, setActivatingMember] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error("Please login first");
      navigate('/admin/login');
      return;
    }
    
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    const token = localStorage.getItem('adminToken');
    
    try {
      const [membersRes, attendanceRes] = await Promise.all([
        axios.get(`${API}/members`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/attendance/today`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setMembers(membersRes.data);
      
      const attendanceMap = {};
      attendanceRes.data.forEach(record => {
        attendanceMap[record.member_id] = record.present;
      });
      setAttendance(attendanceMap);
      
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsername');
        navigate('/admin/login');
      } else {
        toast.error("Failed to fetch data");
      }
      setLoading(false);
    }
  };

  const markAttendance = async (member, present) => {
    const token = localStorage.getItem('adminToken');
    setMarkingAttendance({ ...markingAttendance, [member.id]: true });

    try {
      await axios.post(
        `${API}/attendance`,
        {
          member_id: member.id,
          member_name: member.name,
          present: present
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAttendance({ ...attendance, [member.id]: present });
      toast.success(`${member.name} marked as ${present ? 'Present' : 'Absent'}`);
    } catch (error) {
      toast.error("Failed to mark attendance");
    } finally {
      setMarkingAttendance({ ...markingAttendance, [member.id]: false });
    }
  };

  const openActivateModal = (member) => {
    setActivatingMember(member);
    setStartDate(new Date().toISOString().split('T')[0]);
  };

  const activateMembership = async () => {
    if (!startDate) {
      toast.error("Please pick a start date");
      return;
    }
    const token = localStorage.getItem('adminToken');
    setActivating(true);

    try {
      await axios.put(
        `${API}/members/${activatingMember.id}/membership`,
        { start_date: startDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`${activatingMember.name}'s membership activated!`);
      setActivatingMember(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to activate membership");
    } finally {
      setActivating(false);
    }
  };

  const exportToExcel = () => {
    const today = new Date().toLocaleDateString('en-IN');
    const data = members.map(member => ({
      'Member Name': member.name,
      'Email': member.email,
      'Phone': member.phone,
      'Membership Plan': member.membership_plan,
      'Status': attendance[member.id] === true ? 'Present' : attendance[member.id] === false ? 'Absent' : 'Not Marked'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    
    XLSX.writeFile(wb, `spartans_gym_attendance_${today.replace(/\//g, '-')}.xlsx`);
    toast.success("Attendance exported successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    toast.success("Logged out successfully");
    navigate('/admin/login');
  };

  const presentCount = Object.values(attendance).filter(val => val === true).length;
  const absentCount = Object.values(attendance).filter(val => val === false).length;
  const unmarkedCount = members.length - presentCount - absentCount;

  const membershipBadge = (member) => {
    const status = member.membership_status || 'pending';
    if (status === 'active') {
      return (
        <div>
          <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-accent tracking-wider bg-green-600/20 text-green-500 border border-green-600/30">
            ACTIVE
          </span>
          {member.membership_end && (
            <p className="text-xs text-gray-500 mt-1">until {member.membership_end}</p>
          )}
        </div>
      );
    }
    if (status === 'expired') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-accent tracking-wider bg-red-600/20 text-red-500 border border-red-600/30">
          EXPIRED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-accent tracking-wider bg-yellow-600/20 text-yellow-500 border border-yellow-600/30">
        PENDING
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="font-accent tracking-wider">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <header className="bg-zinc-900 border-b border-red-600/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Dumbbell className="w-8 h-8 text-red-600" />
              <span className="ml-3 text-2xl font-black tracking-tighter uppercase font-headings">
                Spartans Gym - Admin
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-accent tracking-wider"
              data-testid="logout-btn"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase font-headings mb-2" data-testid="dashboard-heading">
            Daily Attendance Manager
          </h1>
          <p className="text-gray-400 font-body">
            Today's Date: {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 border border-green-600/30 p-6" data-testid="present-count">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-accent tracking-wider mb-1">PRESENT</p>
                <p className="text-3xl font-black font-headings text-green-500">{presentCount}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-zinc-900 border border-red-600/30 p-6" data-testid="absent-count">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-accent tracking-wider mb-1">ABSENT</p>
                <p className="text-3xl font-black font-headings text-red-500">{absentCount}</p>
              </div>
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <div className="bg-zinc-900 border border-yellow-600/30 p-6" data-testid="unmarked-count">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-accent tracking-wider mb-1">NOT MARKED</p>
                <p className="text-3xl font-black font-headings text-yellow-500">{unmarkedCount}</p>
              </div>
              <Users className="w-12 h-12 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold tracking-tight uppercase font-headings text-red-500" data-testid="members-heading">
            Members List ({members.length})
          </h2>
          
          <div className="flex gap-3">
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:bg-white/10 text-white transition-all rounded-sm font-accent tracking-wider"
              data-testid="refresh-btn"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white transition-all rounded-sm font-accent tracking-wider"
              data-testid="export-btn"
            >
              <Download className="w-4 h-4" />
              <span>Export to Excel</span>
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="members-table">
              <thead className="bg-zinc-950 border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-accent tracking-wider text-gray-400 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-accent tracking-wider text-gray-400 uppercase hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-accent tracking-wider text-gray-400 uppercase hidden sm:table-cell">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-accent tracking-wider text-gray-400 uppercase hidden lg:table-cell">Plan</th>
                  <th className="px-4 py-3 text-center text-xs font-accent tracking-wider text-gray-400 uppercase">Membership</th>
                  <th className="px-4 py-3 text-center text-xs font-accent tracking-wider text-gray-400 uppercase">Attendance</th>
                  <th className="px-4 py-3 text-center text-xs font-accent tracking-wider text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-zinc-800/50 transition-colors" data-testid={`member-row-${member.id}`}>
                    <td className="px-4 py-4 text-sm font-body text-white">{member.name}</td>
                    <td className="px-4 py-4 text-sm font-body text-gray-400 hidden md:table-cell">{member.email}</td>
                    <td className="px-4 py-4 text-sm font-body text-gray-400 hidden sm:table-cell">{member.phone}</td>
                    <td className="px-4 py-4 text-sm font-body text-gray-400 capitalize hidden lg:table-cell">{member.membership_plan}</td>
                    <td className="px-4 py-4 text-center">
                      {membershipBadge(member)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {attendance[member.id] === true && (
                        <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-accent tracking-wider bg-green-600/20 text-green-500 border border-green-600/30" data-testid={`status-present-${member.id}`}>
                          PRESENT
                        </span>
                      )}
                      {attendance[member.id] === false && (
                        <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-accent tracking-wider bg-red-600/20 text-red-500 border border-red-600/30" data-testid={`status-absent-${member.id}`}>
                          ABSENT
                        </span>
                      )}
                      {attendance[member.id] === undefined && (
                        <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-accent tracking-wider bg-yellow-600/20 text-yellow-500 border border-yellow-600/30" data-testid={`status-unmarked-${member.id}`}>
                          NOT MARKED
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => markAttendance(member, true)}
                          disabled={markingAttendance[member.id]}
                          className={`p-2 rounded-sm transition-all ${
                            attendance[member.id] === true
                              ? 'bg-green-600 text-white'
                              : 'bg-zinc-800 text-gray-400 hover:bg-green-600 hover:text-white'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                          title="Mark Present"
                          data-testid={`mark-present-${member.id}`}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        
                        <button
                          onClick={() => markAttendance(member, false)}
                          disabled={markingAttendance[member.id]}
                          className={`p-2 rounded-sm transition-all ${
                            attendance[member.id] === false
                              ? 'bg-red-600 text-white'
                              : 'bg-zinc-800 text-gray-400 hover:bg-red-600 hover:text-white'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                          title="Mark Absent"
                          data-testid={`mark-absent-${member.id}`}
                        >
                          <XCircle className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => openActivateModal(member)}
                          className="p-2 rounded-sm bg-zinc-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
                          title="Activate / Renew Membership"
                          data-testid={`activate-membership-${member.id}`}
                        >
                          <Calendar className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {members.length === 0 && (
            <div className="text-center py-12" data-testid="no-members">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 font-body">No members registered yet.</p>
            </div>
          )}
        </div>
      </div>

      {activatingMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4" data-testid="activate-membership-modal">
          <div className="bg-zinc-900 border border-blue-600/30 rounded-sm max-w-sm w-full p-8 relative">
            <button onClick={() => setActivatingMember(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold uppercase font-headings text-white mb-2">Activate Membership</h3>
            <p className="text-gray-400 font-body text-sm mb-6">
              {activatingMember.name} &middot; <span className="capitalize">{activatingMember.membership_plan}</span> plan
            </p>

            <label className="block text-sm font-accent tracking-wider text-gray-400 mb-2">
              PAYMENT / START DATE
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-sm h-12 px-4 text-white focus:outline-none mb-6"
              data-testid="membership-start-input"
            />

            <button
              onClick={activateMembership}
              disabled={activating}
              className="w-full uppercase tracking-widest font-bold px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 disabled:opacity-50"
              data-testid="confirm-activate-btn"
            >
              {activating ? 'Activating...' : 'Confirm & Activate'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
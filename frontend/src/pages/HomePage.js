import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Phone, MapPin, Mail, Users, Clock, Award, Dumbbell, Heart, TrendingUp, Apple, MessageCircle, Menu, X } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const facilities = [
    { icon: Dumbbell, title: "Personal Training", desc: "One-on-one coaching" },
    { icon: TrendingUp, title: "Strength Training", desc: "Build raw power" },
    { icon: Heart, title: "Cardio Zone", desc: "High-intensity workouts" },
    { icon: Dumbbell, title: "Weight Training", desc: "Muscle building programs" },
    { icon: TrendingUp, title: "Fat Loss Programs", desc: "Burn fat effectively" },
    { icon: Users, title: "Muscle Gain Programs", desc: "Bulk up with experts" },
    { icon: Apple, title: "Diet & Nutrition", desc: "Custom meal plans" },
    { icon: Dumbbell, title: "Online Classes", desc: "Train from anywhere" },
    { icon: Users, title: "Locker Rooms", desc: "Secure & clean facilities" },
    { icon: Clock, title: "Flexible Timings", desc: "Morning & evening shifts" }
  ];

  const plans = [
    { name: "Monthly", price: "₹1000", duration: "1 Month", popular: false },
    { name: "Quarterly", price: "₹2500", duration: "3 Months", popular: false },
    { name: "Half-Yearly", price: "₹5200", duration: "6 Months", popular: true },
    { name: "Yearly", price: "₹9000", duration: "12 Months", popular: false },
    { name: "Personal Training", price: "₹2,000/mo", duration: "Add-on", popular: false }
  ];

  const reviews = [
    { name: "Amit Sharma", rating: 5, text: "Nice space, sincere coach, good equipment. Best gym in Pilkhuwa!" },
    { name: "Priya Singh", rating: 5, text: "Friendly staff and positive environment. Love the morning sessions." },
    { name: "Rahul Kumar", rating: 5, text: "Excellent trainers! Ravi and Raj are like brothers. Highly recommended." },
    { name: "Neha Gupta", rating: 4, text: "Great facilities and flexible timings. Perfect for working professionals." }
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Dumbbell className="w-8 h-8 text-red-600" />
              <span className="ml-3 text-2xl font-black tracking-tighter uppercase font-headings">Spartans Gym</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-wider font-accent" data-testid="nav-home">Home</button>
              <button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-wider font-accent" data-testid="nav-about">About</button>
              <button onClick={() => scrollToSection('facilities')} className="text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-wider font-accent" data-testid="nav-facilities">Facilities</button>
              <button onClick={() => scrollToSection('trainers')} className="text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-wider font-accent" data-testid="nav-trainers">Trainers</button>
              <button onClick={() => scrollToSection('plans')} className="text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-wider font-accent" data-testid="nav-plans">Plans</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-wider font-accent" data-testid="nav-contact">Contact</button>
              <button onClick={() => navigate('/admin/login')} className="text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-wider font-accent" data-testid="nav-admin">Admin</button>
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 border-t border-red-600/20" data-testid="mobile-menu">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection('home')} className="block w-full text-left text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-wider font-accent py-2" data-testid="mobile-nav-home">Home</button>
              <button onClick={() => scrollToSection('about')} className="block w-full text-left text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-wider font-accent py-2" data-testid="mobile-nav-about">About</button>
              <button onClick={() => scrollToSection('facilities')} className="block w-full text-left text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-wider font-accent py-2" data-testid="mobile-nav-facilities">Facilities</button>
              <button onClick={() => scrollToSection('trainers')} className="block w-full text-left text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-wider font-accent py-2" data-testid="mobile-nav-trainers">Trainers</button>
              <button onClick={() => scrollToSection('plans')} className="block w-full text-left text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-wider font-accent py-2" data-testid="mobile-nav-plans">Plans</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-wider font-accent py-2" data-testid="mobile-nav-contact">Contact</button>
              <button onClick={() => navigate('/admin/login')} className="block w-full text-left text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-wider font-accent py-2" data-testid="mobile-nav-admin">Admin</button>
            </div>
          </div>
        )}
      </header>

      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden noise-bg">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://m.media-amazon.com/images/I/51QrxN6XyGL._AC_UF1000,1000_QL80_.jpg"
            alt="Intense gym workout"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase font-headings mb-6 animate-fade-in-up text-shadow-glow" data-testid="hero-heading">
            Build Your<br />Strength
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-8 font-body animate-fade-in-up stagger-1" data-testid="hero-tagline">
            Train Hard. Stay Strong. Live Fit.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-2">
            <button
              onClick={() => navigate('/register')}
              className="skew-button rounded-none uppercase tracking-widest font-bold px-8 py-4 bg-red-600 hover:bg-red-700 text-white transition-all duration-300 w-full sm:w-auto"
              data-testid="join-now-btn"
            >
              <span>Join Now</span>
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="skew-button rounded-none uppercase tracking-widest font-bold px-8 py-4 border border-white/20 hover:bg-white/10 text-white transition-all duration-300 w-full sm:w-auto"
              data-testid="book-trial-btn"
            >
              <span>Book Free Trial</span>
            </button>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 animate-fade-in-up stagger-3">
            <div className="text-center">
              <div className="text-4xl font-black text-red-600 font-headings" data-testid="members-count">400+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider font-accent">Members</div>
            </div>
            <div className="h-12 w-px bg-white/20"></div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-4xl font-black text-red-600 font-headings" data-testid="rating">
                4.7 <Star className="w-8 h-8 fill-red-600" />
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider font-accent">Google Rating</div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 px-4 relative overflow-hidden noise-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase font-headings mb-4" data-testid="about-heading">About Spartans Gym</h2>
            <div className="h-1 w-24 bg-red-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed font-body" data-testid="about-description-1">
                Welcome to <span className="text-red-600 font-bold">Spartans Gym</span>, Pilkhuwa's premier fitness destination with over 400+ active members. Since our inception, we've been committed to creating a positive, brother-like environment where serious training meets friendly coaching.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed font-body" data-testid="about-description-2">
                Our trainers Ravi and Raj bring years of experience and dedication to help you achieve your fitness goals. Whether you're looking to build muscle, lose fat, or simply maintain a healthy lifestyle, we provide the guidance, equipment, and motivation you need.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed font-body" data-testid="about-description-3">
                Located near HDFC Bank, Gandhi Colony, Bus Stand in Pilkhuwa (245304), we offer flexible timings with morning and evening shifts to fit your schedule. Join our community and experience the Spartan way of fitness!
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/136404/pexels-photo-136404.jpeg"
                alt="Gym atmosphere"
                className="rounded-sm border border-white/10 w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-red-600 text-white p-6 rounded-sm">
                <div className="text-4xl font-black font-headings">8+</div>
                <div className="text-sm uppercase tracking-wider font-accent">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="facilities" className="py-24 px-4 bg-zinc-900/50 noise-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase font-headings mb-4" data-testid="facilities-heading">Facilities & Services</h2>
            <div className="h-1 w-24 bg-red-600 mx-auto"></div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {facilities.map((facility, index) => {
              const Icon = facility.icon;
              return (
                <div
                  key={index}
                  className="bg-zinc-900/50 border border-white/5 hover:border-red-500/50 transition-all duration-300 p-6 backdrop-blur-sm group hover:scale-105"
                  data-testid={`facility-${index}`}
                >
                  <Icon className="w-12 h-12 text-red-600 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold tracking-wide uppercase font-headings text-red-500 mb-2">{facility.title}</h3>
                  <p className="text-gray-400 text-sm font-body">{facility.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="trainers" className="py-24 px-4 noise-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase font-headings mb-4" data-testid="trainers-heading">Meet Our Trainers</h2>
            <div className="h-1 w-24 bg-red-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-zinc-900/50 border border-white/5 hover:border-red-500/50 transition-all duration-300 overflow-hidden group" data-testid="trainer-ravi">
              <div className="relative h-90 overflow-hidden">
                <img 
                  src="https://i.ibb.co/79qCxDv/Whats-App-Image-2026-01-25-at-5-54-22-PM.jpg"
                  alt="Trainer Ravi"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold tracking-wide uppercase font-headings text-red-500 mb-2">Ravi</h3>
                <p className="text-gray-400 font-accent tracking-wider mb-3">HEAD COACH</p>
                <p className="text-gray-300 font-body">Specialist in strength training and muscle building with 10+ years of experience. Known for his motivational coaching style.</p>
                <p className="text-gray-280 font-body"> K-11 fitness trainer <br></br>Certified CPR AED<br></br>Certified Sports Nutrition </p>
              </div>
            </div>
            
            <div className="bg-zinc-900/50 border border-white/5 hover:border-red-500/50 transition-all duration-300 overflow-hidden group" data-testid="trainer-raj">
              <div className="relative h-90 overflow-hidden">
                <img 
                  src="https://i.ibb.co/fVNVFZhj/Whats-App-Image-2026-01-25-at-5-54-22-PM-1.jpg"
                  alt="Trainer Raj"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold tracking-wide uppercase font-headings text-red-500 mb-2">Raj</h3>
                <p className="text-gray-400 font-accent tracking-wider mb-3">STRENGTH COACH</p>
                <p className="text-gray-300 font-body">Expert in fat loss programs and cardio training with 8+ years of experience. Passionate about helping clients achieve their goals.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="timings" className="py-24 px-4 bg-zinc-900/50 noise-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase font-headings mb-4" data-testid="timings-heading">Gym Timings</h2>
            <div className="h-1 w-24 bg-red-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-zinc-900 border border-red-600/30 p-8 text-center" data-testid="morning-shift">
              <Clock className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold tracking-wide uppercase font-headings text-red-500 mb-4">Morning Shift</h3>
              <div className="text-4xl font-black font-headings mb-2">5:00 AM - 11:00 AM</div>
              <p className="text-gray-400 font-body">Monday to Saturday</p>
            </div>
            
            <div className="bg-zinc-900 border border-red-600/30 p-8 text-center" data-testid="evening-shift">
              <Clock className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold tracking-wide uppercase font-headings text-red-500 mb-4">Evening Shift</h3>
              <div className="text-4xl font-black font-headings mb-2">4:00 PM - 9:30 PM</div>
              <p className="text-gray-400 font-body">Monday to Saturday</p>
            </div>
          </div>
          
          <p className="text-center text-red-500 text-lg font-accent tracking-wider mt-8">Closed on Sundays</p>
        </div>
      </section>

      <section id="plans" className="py-24 px-4 noise-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase font-headings mb-4" data-testid="plans-heading">Membership Plans</h2>
            <div className="h-1 w-24 bg-red-600 mx-auto"></div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-zinc-900/50 border ${
                  plan.popular ? 'border-red-600 scale-105' : 'border-white/5'
                } hover:border-red-500/50 transition-all duration-300 p-6 backdrop-blur-sm relative`}
                data-testid={`plan-${index}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-1 text-xs uppercase tracking-widest font-accent" data-testid="popular-badge">
                    Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold tracking-wide uppercase font-headings text-red-500 mb-4">{plan.name}</h3>
                <div className="text-4xl font-black font-headings mb-2">{plan.price}</div>
                <p className="text-gray-400 font-body mb-6">{plan.duration}</p>
                <button
                  onClick={() => navigate('/register')}
                  className="w-full skew-button rounded-none uppercase tracking-widest font-bold px-6 py-3 bg-red-600 hover:bg-red-700 text-white transition-all duration-300"
                  data-testid={`select-plan-${index}`}
                >
                  <span>Select Plan</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="py-24 px-4 bg-zinc-900/50 noise-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase font-headings mb-4" data-testid="reviews-heading">What Our Members Say</h2>
            <div className="h-1 w-24 bg-red-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-zinc-900 border border-white/5 p-6 hover:border-red-500/30 transition-colors"
                data-testid={`review-${index}`}
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-red-600 text-red-600" />
                  ))}
                </div>
                <p className="text-gray-300 font-body mb-4 italic">"{review.text}"</p>
                <p className="text-red-500 font-accent tracking-wider">- {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 px-4 noise-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase font-headings mb-4" data-testid="contact-heading">Contact Us</h2>
            <div className="h-1 w-24 bg-red-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start gap-4" data-testid="contact-address">
                <MapPin className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold font-headings text-red-500 mb-2">Address</h3>
                  <p className="text-gray-300 font-body">Near HDFC Bank, Gandhi Colony<br />Bus Stand, Pilkhuwa<br />Uttar Pradesh - 245304</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4" data-testid="contact-phone">
                <Phone className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold font-headings text-red-500 mb-2">Phone</h3>
                  <p className="text-gray-300 font-body">+91 84499 81001  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4" data-testid="contact-email">
                <Mail className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold font-headings text-red-500 mb-2">Email</h3>
                  <p className="text-gray-300 font-body">spartansfitt@gmail.com</p>
                </div>
              </div>
              
              <a
                href="https://wa.me/8449981001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 skew-button rounded-none uppercase tracking-widest font-bold px-8 py-4 bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
                data-testid="whatsapp-btn"
              >
                <MessageCircle className="w-6 h-6" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
            
            <div className="h-[400px] border border-white/10 rounded-sm overflow-hidden grayscale-map">
              <iframe
                title="Spartans Gym Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27838.47!2d77.65!3d28.71!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf55d54d9c643%3A0x5f5f6a01a5e7a8e6!2sPilkhuwa%2C%20Uttar%20Pradesh%20245304!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                data-testid="google-map"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black border-t border-red-600/20 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Dumbbell className="w-8 h-8 text-red-600" />
            <span className="ml-3 text-2xl font-black tracking-tighter uppercase font-headings">Spartans Gym</span>
          </div>
          <p className="text-gray-400 font-body mb-4">Building strength, one rep at a time.</p>
          <p className="text-gray-600 text-sm font-body">© 2024 Spartans Gym. All rights reserved.</p>
          <p className="text-gray-10 text-sm font-body"> BUILDER - VEDANSH GOEL </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
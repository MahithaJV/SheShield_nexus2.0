import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Shield, Bell, MapPin, Settings, Heart, Navigation, AlertTriangle, User as UserIcon, Home, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MapNavigation from './pages/MapNavigation';
import { SafeProvider, useSafe } from './context/SafeContext';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import ManageContacts from './pages/ManageContacts';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useSafe();
  return token ? <>{children}</> : <Login />;
};

// Pages (will be moved to separate files later)
const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to SheShield",
      desc: "Your ultimate companion for personal safety and peace of mind.",
      icon: <Shield size={80} className="text-pink-500" />,
      color: "from-pink-500/20 to-purple-500/20"
    },
    {
      title: "Emergency SOS",
      desc: "Instant alerts to emergency services and your trusted circle with one tap.",
      icon: <Bell size={80} className="text-red-500" />,
      color: "from-red-500/20 to-orange-500/20"
    },
    {
      title: "Safe Navigation",
      desc: "AI-powered routing that avoids high-risk areas based on real-time data.",
      icon: <Navigation size={80} className="text-blue-500" />,
      color: "from-blue-500/20 to-cyan-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-6 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className={`w-full max-w-md p-10 rounded-3xl bg-gradient-to-br ${steps[step].color} border border-white/10 backdrop-blur-xl`}
        >
          <div className="mb-8 flex justify-center">{steps[step].icon}</div>
          <h1 className="text-3xl font-bold mb-4">{steps[step].title}</h1>
          <p className="text-gray-400 text-lg mb-8">{steps[step].desc}</p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex gap-2">
        {steps.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-pink-500' : 'w-2 bg-gray-700'}`} />
        ))}
      </div>

      <button
        onClick={() => step < steps.length - 1 ? setStep(step + 1) : navigate('/dashboard')}
        className="mt-8 w-full max-w-md py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-pink-500/25"
      >
        {step === steps.length - 1 ? "Get Started" : "Continue"}
      </button>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, triggerSOS, isEmergencyActive } = useSafe();

  const handleSOS = () => {
    triggerSOS({ lat: 51.505, lng: -0.09 }); // Example location
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pb-24">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Shield size={24} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">SheShield</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-400">Hi, {user?.name?.split(' ')[0]}</span>
          <button onClick={logout} className="p-2 rounded-xl bg-white/5 border border-white/10 text-xs hover:bg-red-500/10 hover:text-red-500 transition-all">Logout</button>
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
            <UserIcon size={20} className="text-gray-400" />
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* SOS Section */}
        <section className="flex flex-col items-center justify-center py-10">
          <div className="relative">
            <motion.div
              animate={{ scale: isEmergencyActive ? [1, 1.2, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`w-64 h-64 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-500 cursor-pointer ${isEmergencyActive ? 'bg-red-600 shadow-red-500/50' : 'bg-gradient-to-tr from-red-500 to-pink-500 shadow-pink-500/30'}`}
              onMouseDown={handleSOS}
              onTouchStart={handleSOS}
            >
              <ShieldAlert size={80} />
              <span className="mt-4 font-black text-2xl uppercase tracking-widest">{isEmergencyActive ? 'SENT' : 'SOS'}</span>
            </motion.div>
            <div className="absolute -inset-4 border-2 border-dashed border-red-500/20 rounded-full animate-spin-slow" />
          </div>
          <p className="mt-8 text-gray-400 font-medium text-center max-w-xs">
            Hold for 3 seconds to trigger emergency protocol
          </p>
        </section>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center mb-3">
              <MapPin size={20} className="text-green-500" />
            </div>
            <h3 className="text-sm text-gray-400 font-medium">Safe Zone</h3>
            <p className="text-lg font-bold">Downtown</p>
          </div>
          <button 
            onClick={() => navigate('/contacts')}
            className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm text-left hover:bg-white/10 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
              <Heart size={20} className="text-blue-500" />
            </div>
            <h3 className="text-sm text-gray-400 font-medium">Safe Circle</h3>
            <p className="text-lg font-bold">Manage</p>
          </button>
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <AlertTriangle size={24} className="text-orange-500" />
              </div>
              <div className="text-left">
                <h4 className="font-bold">Report Incident</h4>
                <p className="text-xs text-gray-400">Share danger in your area</p>
              </div>
            </button>
            <button className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <Navigation size={24} className="text-pink-500" />
              </div>
              <div className="text-left">
                <h4 className="font-bold">Safe Route Home</h4>
                <p className="text-xs text-gray-400">Find the safest path</p>
              </div>
            </button>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0c]/80 backdrop-blur-xl border-t border-white/5 flex justify-around items-center z-50">
        <button onClick={() => navigate('/dashboard')} className="p-3 text-pink-500"><Home size={28} /></button>
        <button onClick={() => navigate('/map')} className="p-3 text-gray-500"><Navigation size={28} /></button>
        <button className="p-3 text-gray-500"><Bell size={28} /></button>
        <button className="p-3 text-gray-500"><Settings size={28} /></button>
      </nav>
    </div>
  );
};

function App() {
  return (
    <SafeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/map" element={<PrivateRoute><MapNavigation /></PrivateRoute>} />
          <Route path="/contacts" element={<PrivateRoute><ManageContacts /></PrivateRoute>} />
        </Routes>
      </Router>
    </SafeProvider>
  );
}

export default App;

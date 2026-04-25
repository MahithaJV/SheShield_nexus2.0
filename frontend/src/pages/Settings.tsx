import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, ArrowLeft, User, Shield, Bell, Lock, Eye, Moon, Info, LogOut, ChevronRight, Home, Navigation, Bell as BellIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSafe } from '../context/SafeContext';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useSafe();
  const [safetyPreferences, setSafetyPreferences] = useState({
    smsAlerts: true,
    locationSharing: true,
    lowBatteryAlert: false,
    quietHours: false
  });

  const togglePreference = (key: keyof typeof safetyPreferences) => {
    setSafetyPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const SettingItem = ({ icon: Icon, title, desc, onClick, toggle, toggleValue }: any) => (
    <div 
      onClick={onClick}
      className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-all cursor-pointer mb-3"
    >
      <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
        <Icon size={24} className="text-pink-500" />
      </div>
      <div className="flex-1 text-left">
        <h4 className="font-bold">{title}</h4>
        {desc && <p className="text-xs text-gray-400">{desc}</p>}
      </div>
      {toggle ? (
        <div 
          onClick={(e) => { e.stopPropagation(); toggle(); }}
          className={`w-12 h-6 rounded-full transition-all relative ${toggleValue ? 'bg-pink-500' : 'bg-gray-700'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${toggleValue ? 'right-1' : 'left-1'}`} />
        </div>
      ) : (
        <ChevronRight size={20} className="text-gray-600" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pb-24">
      {/* Header */}
      <header className="p-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
      </header>

      <main className="p-6">
        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/10 backdrop-blur-xl mb-8 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/20">
            <User size={32} className="text-white/50" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name || 'User'}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
          <button className="ml-auto text-xs font-bold text-pink-500 uppercase tracking-widest bg-pink-500/10 px-3 py-1 rounded-full">Edit</button>
        </div>

        {/* Safety Section */}
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 ml-2">Safety Protocols</h3>
        <SettingItem 
          icon={Shield} 
          title="SMS Alerts" 
          desc="Send SMS to contacts during SOS" 
          toggle={() => togglePreference('smsAlerts')}
          toggleValue={safetyPreferences.smsAlerts}
        />
        <SettingItem 
          icon={Eye} 
          title="Location Sharing" 
          desc="Auto-share location with safe circle" 
          toggle={() => togglePreference('locationSharing')}
          toggleValue={safetyPreferences.locationSharing}
        />
        <SettingItem 
          icon={Bell} 
          title="Low Battery Alert" 
          desc="Notify contacts when battery < 10%" 
          toggle={() => togglePreference('lowBatteryAlert')}
          toggleValue={safetyPreferences.lowBatteryAlert}
        />

        {/* General Section */}
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-8 mb-4 ml-2">General</h3>
        <SettingItem icon={Lock} title="Privacy Policy" desc="How we protect your data" />
        <SettingItem icon={Moon} title="Appearance" desc="Dark mode is enabled" />
        <SettingItem icon={Info} title="About SheShield" desc="Version 2.0.0-nexus" />

        <button 
          onClick={logout}
          className="w-full mt-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center gap-3 text-red-500 font-bold hover:bg-red-500/20 transition-all"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0c]/80 backdrop-blur-xl border-t border-white/5 flex justify-around items-center z-50">
        <button onClick={() => navigate('/dashboard')} className="p-3 text-gray-500"><Home size={28} /></button>
        <button onClick={() => navigate('/map')} className="p-3 text-gray-500"><Navigation size={28} /></button>
        <button onClick={() => navigate('/notifications')} className="p-3 text-gray-500"><BellIcon size={28} /></button>
        <button onClick={() => navigate('/settings')} className="p-3 text-pink-500"><SettingsIcon size={28} /></button>
      </nav>
    </div>
  );
};

export default Settings;

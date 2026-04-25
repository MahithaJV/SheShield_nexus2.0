import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, Trash2, CheckCircle, ShieldAlert, Info, Settings as SettingsIcon, Home, Navigation, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafe } from '../context/SafeContext';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markNotificationAsRead, clearNotifications } = useSafe();

  const getIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <ShieldAlert className="text-red-500" size={24} />;
      case 'info': return <Info className="text-blue-500" size={24} />;
      default: return <Bell className="text-pink-500" size={24} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pb-24">
      {/* Header */}
      <header className="p-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Notifications</h1>
        <button 
          onClick={clearNotifications}
          className="ml-auto p-2 text-gray-500 hover:text-red-500 transition-colors"
          title="Clear all"
        >
          <Trash2 size={20} />
        </button>
      </header>

      <main className="p-6">
        <AnimatePresence mode="popLayout">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`mb-4 p-5 rounded-2xl border transition-all ${notif.read ? 'bg-white/2 border-white/5 opacity-60' : 'bg-white/5 border-white/10 shadow-lg shadow-pink-500/5'}`}
                onClick={() => markNotificationAsRead(notif.id)}
              >
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${notif.type === 'emergency' ? 'bg-red-500/10' : 'bg-pink-500/10'}`}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-bold ${notif.read ? 'text-gray-400' : 'text-white'}`}>{notif.title}</h4>
                      <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{notif.message}</p>
                    {!notif.read && (
                      <div className="mt-3 flex items-center gap-1 text-[10px] text-pink-500 font-bold uppercase tracking-widest">
                        <CheckCircle size={10} /> Mark as read
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Bell size={40} className="text-gray-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">No notifications</h3>
              <p className="text-gray-500 max-w-xs">You're all caught up! Safety alerts and updates will appear here.</p>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0c]/80 backdrop-blur-xl border-t border-white/5 flex justify-around items-center z-50">
        <button onClick={() => navigate('/dashboard')} className="p-3 text-gray-500"><Home size={28} /></button>
        <button onClick={() => navigate('/map')} className="p-3 text-gray-500"><Navigation size={28} /></button>
        <button onClick={() => navigate('/notifications')} className="p-3 text-pink-500"><Bell size={28} /></button>
        <button onClick={() => navigate('/settings')} className="p-3 text-gray-500"><Settings size={28} /></button>
      </nav>
    </div>
  );
};

export default Notifications;

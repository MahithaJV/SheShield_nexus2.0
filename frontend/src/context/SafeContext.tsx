import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Notification {
  id: string;
  type: 'emergency' | 'system' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface SafeContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  socket: Socket | null;
  isEmergencyActive: boolean;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  triggerSOS: (location: { lat: number; lng: number }) => void;
}

const SafeContext = createContext<SafeContextType | undefined>(undefined);

export const SafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, [token]);

  useEffect(() => {
    if (token && user) {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      newSocket.emit('join-room', user.id);

      newSocket.on('emergency-alert', (data) => {
        console.log('Incoming SOS Alert:', data);
        const newNotif: Notification = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'emergency',
          title: 'Emergency Alert!',
          message: `${data.userName} has triggered an SOS alert!`,
          timestamp: new Date(),
          read: false
        };
        setNotifications(prev => [newNotif, ...prev]);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token, user]);

  const login = (userData: User, newToken: string) => {
    setUser(userData);
    setToken(newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (socket) socket.disconnect();
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const triggerSOS = (location: { lat: number; lng: number }) => {
    if (socket && user) {
      setIsEmergencyActive(true);
      socket.emit('send-sos', {
        userId: user.id,
        userName: user.name,
        location,
        message: 'EMERGENCY: SOS Triggered from SheShield App'
      });
      
      // Reset after some time or when resolved
      setTimeout(() => setIsEmergencyActive(false), 5000);
    }
  };

  return (
    <SafeContext.Provider value={{ 
      user, token, login, logout, socket, isEmergencyActive, 
      notifications, addNotification, markNotificationAsRead, clearNotifications,
      triggerSOS 
    }}>
      {children}
    </SafeContext.Provider>
  );
};

export const useSafe = () => {
  const context = useContext(SafeContext);
  if (context === undefined) {
    throw new Error('useSafe must be used within a SafeProvider');
  }
  return context;
};

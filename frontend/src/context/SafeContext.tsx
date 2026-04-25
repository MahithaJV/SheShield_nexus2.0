import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface SafeContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  socket: Socket | null;
  isEmergencyActive: boolean;
  triggerSOS: (location: { lat: number; lng: number }) => void;
}

const SafeContext = createContext<SafeContextType | undefined>(undefined);

export const SafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

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
        // Handle incoming alerts from safe circle
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
    <SafeContext.Provider value={{ user, token, login, logout, socket, isEmergencyActive, triggerSOS }}>
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

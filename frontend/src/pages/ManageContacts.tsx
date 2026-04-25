import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Trash2, Phone, Heart, Shield } from 'lucide-react';
import { useSafe } from '../context/SafeContext';

interface Contact {
  _id: string;
  name: string;
  phone: string;
  relation: string;
}

const ManageContacts = () => {
  const navigate = useNavigate();
  const { token } = useSafe();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('Friend');
  const [loading, setLoading] = useState(false);

  const fetchContacts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/contacts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setContacts(data.data);
    } catch (err) {
      console.error('Failed to fetch contacts');
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [token]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, phone, relation })
      });
      const data = await res.json();
      if (data.success) {
        setName('');
        setPhone('');
        fetchContacts();
      }
    } catch (err) {
      console.error('Failed to add contact');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/contacts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchContacts();
    } catch (err) {
      console.error('Failed to delete contact');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-xl bg-white/5 border border-white/10">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Safe Circle</h1>
      </header>

      <form onSubmit={handleAdd} className="space-y-4 mb-10 p-6 rounded-3xl bg-white/5 border border-white/10">
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2"><UserPlus size={20} className="text-pink-500" /> Add Trusted Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-pink-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-pink-500 outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <select
            className="p-4 rounded-2xl bg-[#1a1a1c] border border-white/10 focus:border-pink-500 outline-none"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
          >
            <option>Friend</option>
            <option>Family</option>
            <option>Partner</option>
            <option>Emergency Services</option>
          </select>
        </div>
        <button
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-pink-500 font-bold hover:bg-pink-600 transition-all disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add to Safe Circle'}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Shield size={20} className="text-blue-500" /> Your Trusted Contacts</h2>
        {contacts.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No contacts added yet.</p>
        ) : (
          contacts.map((contact) => (
            <div key={contact._id} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                  <Heart size={24} className="text-pink-500" />
                </div>
                <div>
                  <h4 className="font-bold">{contact.name}</h4>
                  <p className="text-xs text-gray-400">{contact.relation} • {contact.phone}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(contact._id)}
                className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 transition-all hover:text-white"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageContacts;

// src/pages/admin/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tickets'), (querySnapshot) => {
      const ticketList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(ticketList);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching tickets:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const ticketRef = doc(db, 'tickets', id);
      await updateDoc(ticketRef, { status: newStatus });
      setFeedback(`Status updated to '${newStatus}' successfully.`);
      setTimeout(() => setFeedback(''), 2000);
    } catch (error) {
      setFeedback('Error updating status.');
      setTimeout(() => setFeedback(''), 2000);
      console.error('Error updating status:', error);
    }
  };

  const assignToMe = async (id) => {
    try {
      if (!user || !user.email) {
        setFeedback('Admin email not found.');
        setTimeout(() => setFeedback(''), 2000);
        return;
      }
      const ticketRef = doc(db, 'tickets', id);
      await updateDoc(ticketRef, { assignedAdmin: user.email });
      setFeedback('Ticket assigned to you.');
      setTimeout(() => setFeedback(''), 2000);
    } catch (error) {
      setFeedback('Error assigning ticket.');
      setTimeout(() => setFeedback(''), 2000);
      console.error('Error assigning ticket:', error);
    }
  };

  if (loading) return <p className="text-center text-indigo-600 text-lg mt-10">Loading tickets...</p>;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-8 text-indigo-700">Admin Dashboard</h2>
        {feedback && (
          <div className="mb-4 p-3 bg-emerald-100 text-emerald-700 rounded shadow text-center">{feedback}</div>
        )}
        {tickets.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center text-slate-500 text-lg">No tickets found.</div>
        ) : (
          <div className="grid gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center border border-slate-100 cursor-pointer hover:bg-indigo-50 transition"
                onClick={() => navigate(`/admin/ticket/${ticket.id}`)}
                style={{ position: 'relative' }}
              >
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{ticket.subject}</h3>
                  <p className="text-sm text-slate-500">Category: {ticket.category}</p>
                  <p className="text-sm text-slate-500">Priority: {ticket.priority}</p>
                  <p className="text-sm text-slate-400">Status: {ticket.status}</p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0" onClick={e => e.stopPropagation()}>
                  <button
                    className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg text-white font-semibold transition"
                    onClick={() => updateStatus(ticket.id, 'Resolved')}
                  >
                    Resolve
                  </button>
                  <button
                    className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg text-white font-semibold transition"
                    onClick={() => updateStatus(ticket.id, 'In Progress')}
                  >
                    In Progress
                  </button>
                  <button
                    className="bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-lg text-white font-semibold transition"
                    onClick={() => updateStatus(ticket.id, 'Rejected')}
                  >
                    Reject
                  </button>
                  <button
                    className="bg-slate-500 hover:bg-slate-700 px-4 py-2 rounded-lg text-white font-semibold transition"
                    onClick={() => assignToMe(ticket.id)}
                  >
                    Assign to Me
                  </button>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Assigned Admin: {ticket.assignedAdmin || 'Unassigned'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

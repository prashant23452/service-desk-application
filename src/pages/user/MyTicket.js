// src/pages/user/MyTicket.js
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import Sidebar from '../../components/Sidebar';

const MyTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(collection(db, 'tickets'), where('createdBy', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const ticketsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTickets(ticketsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar isAdmin={false} />
      <div className="flex-1 p-8 ml-64 min-h-screen text-slate-800">
        <h1 className="text-3xl font-bold mb-8 text-indigo-700">My Tickets</h1>
        {loading ? (
          <p className="text-indigo-600 text-lg">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center text-slate-500 text-lg">No tickets raised yet.</div>
        ) : (
          <div className="space-y-6">
            {tickets.map(ticket => (
              <div
                key={ticket.id}
                className="bg-white p-6 rounded-xl shadow-md border border-slate-100"
              >
                <h2 className="text-xl font-semibold text-slate-800 mb-2">{ticket.subject}</h2>
                <p className="text-sm text-slate-500 mb-1">
                  <strong>Category:</strong> {ticket.category} | <strong>Priority:</strong> {ticket.priority}
                </p>
                <p className="text-sm mb-1">
                  <strong>Status:</strong>{' '}
                  <span
                    className={`font-semibold ${
                      ticket.status === 'Resolved'
                        ? 'text-emerald-600'
                        : ticket.status === 'In Progress'
                        ? 'text-indigo-500'
                        : 'text-rose-500'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </p>
                <p className="text-xs text-slate-400 mt-2">Submitted: {ticket.userEmail}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicket;

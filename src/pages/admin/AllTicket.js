// src/pages/admin/AllTickets.js
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tickets'), (querySnapshot) => {
      const ticketData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(ticketData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching tickets:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p className="text-indigo-600 text-center text-lg mt-10">Loading tickets...</p>;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-indigo-700">All Tickets</h1>
        {tickets.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center text-slate-500 text-lg">No tickets available.</div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white p-6 rounded-xl shadow-md border border-slate-100 cursor-pointer hover:bg-indigo-50 transition"
                onClick={() => navigate(`/admin/ticket/${ticket.id}`)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-1">{ticket.subject}</h2>
                    <p className="text-sm text-slate-500 mb-1">
                      Category: {ticket.category} | Priority: {ticket.priority}
                    </p>
                    <p className="text-sm text-slate-400 mb-1">
                      Status: <span className={`font-semibold ${
                        ticket.status === 'Resolved'
                          ? 'text-emerald-600'
                          : ticket.status === 'In Progress'
                          ? 'text-indigo-500'
                          : 'text-rose-500'
                      }`}>{ticket.status}</span> | Submitted by: {ticket.userEmail}
                    </p>
                  </div>
                  <span className="text-xs bg-slate-200 px-3 py-1 rounded">
                    {ticket.createdAt?.seconds ? new Date(ticket.createdAt.seconds * 1000).toLocaleString() : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTickets;

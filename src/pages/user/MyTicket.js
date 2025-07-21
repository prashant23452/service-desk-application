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

        const q = query(collection(db, 'tickets'), where('userId', '==', user.uid));
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
    <div className="flex">
      <Sidebar isAdmin={false} />

      <div className="flex-1 p-6 ml-64 bg-blue-900 text-white min-h-screen">
        <h1 className="text-3xl font-bold mb-6">My Tickets</h1>

        {loading ? (
          <p>Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p>No tickets raised yet.</p>
        ) : (
          <div className="space-y-4">
            {tickets.map(ticket => (
              <div
                key={ticket.id}
                className="bg-blue-800 p-4 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold">{ticket.subject}</h2>
                <p className="text-sm text-gray-300">
                  <strong>Category:</strong> {ticket.category} | <strong>Priority:</strong> {ticket.priority}
                </p>
                <p className="text-sm mt-2">
                  <strong>Status:</strong>{' '}
                  <span
                    className={`${
                      ticket.status === 'Resolved'
                        ? 'text-green-400'
                        : ticket.status === 'In Progress'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicket;

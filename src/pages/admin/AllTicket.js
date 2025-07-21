// src/pages/admin/AllTickets.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tickets'));
        const ticketData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTickets(ticketData);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <p className="text-white text-center">Loading tickets...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6">All Tickets</h1>
      {tickets.length === 0 ? (
        <p>No tickets available.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-blue-800 p-4 rounded shadow-sm hover:bg-blue-700 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{ticket.subject}</h2>
                  <p className="text-sm text-gray-300">
                    Category: {ticket.category} | Priority: {ticket.priority}
                  </p>
                  <p className="text-sm text-gray-400">
                    Status: {ticket.status} | Submitted by: {ticket.userEmail}
                  </p>
                </div>
                <span className="text-sm bg-gray-700 px-2 py-1 rounded">
                  {new Date(ticket.createdAt?.seconds * 1000).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTickets;

// src/pages/admin/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tickets'));
        const ticketList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTickets(ticketList);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const ticketRef = doc(db, 'tickets', id);
      await updateDoc(ticketRef, { status: newStatus });
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === id ? { ...ticket, status: newStatus } : ticket
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <p className="text-center text-white">Loading tickets...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-blue-800 p-4 rounded shadow-md flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <h3 className="text-xl font-semibold">{ticket.subject}</h3>
                <p className="text-sm text-gray-300">Category: {ticket.category}</p>
                <p className="text-sm text-gray-300">Priority: {ticket.priority}</p>
                <p className="text-sm text-gray-400">Status: {ticket.status}</p>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                  onClick={() => updateStatus(ticket.id, 'Resolved')}
                >
                  Resolve
                </button>
                <button
                  className="bg-yellow-600 px-3 py-1 rounded hover:bg-yellow-700"
                  onClick={() => updateStatus(ticket.id, 'In Progress')}
                >
                  In Progress
                </button>
                <button
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                  onClick={() => updateStatus(ticket.id, 'Rejected')}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

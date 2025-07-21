// src/pages/user/TicketDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Sidebar from '../../components/Sidebar';

const TicketDetails = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const docRef = doc(db, 'tickets', ticketId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTicket({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No such ticket!');
        }
      } catch (error) {
        console.error('Error fetching ticket:', error);
      }
      setLoading(false);
    };

    fetchTicket();
  }, [ticketId]);

  if (loading) return <div className="text-white p-6">Loading...</div>;

  if (!ticket)
    return (
      <div className="text-white p-6">Ticket not found or invalid ID.</div>
    );

  return (
    <div className="flex">
      <Sidebar isAdmin={false} />
      <div className="flex-1 ml-64 p-6 bg-blue-900 text-white min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Ticket Details</h1>
        <div className="bg-blue-800 p-6 rounded-lg shadow-lg space-y-2">
          <h2 className="text-2xl font-semibold">{ticket.subject}</h2>
          <p><strong>ID:</strong> {ticket.id}</p>
          <p><strong>Description:</strong> {ticket.description}</p>
          <p><strong>Category:</strong> {ticket.category}</p>
          <p><strong>Priority:</strong> {ticket.priority}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>Assigned Admin:</strong> {ticket.assignedAdmin || 'N/A'}</p>
          <p><strong>Date:</strong> {new Date(ticket.createdAt?.seconds * 1000).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;

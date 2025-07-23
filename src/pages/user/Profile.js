import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
// Remove Stripe import
// import { loadStripe } from "@stripe/stripe-js";
import { getAuth } from "firebase/auth";

// Razorpay script loader
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Profile() {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const [role, setRole] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // Add premium state

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        setProfileLoaded(false);
        return;
      }
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setRole(userSnap.data().role || "user");
          setDisplayName(userSnap.data().displayName || "");
          setNewDisplayName(userSnap.data().displayName || "");
          setIsPremium(userSnap.data().isPremium || false); // Fetch premium status
        } else {
          setRole("user");
          setDisplayName("");
          setNewDisplayName("");
          setIsPremium(false);
        }
        setProfileLoaded(true);
      } catch (e) {
        setRole("user");
        setDisplayName("");
        setNewDisplayName("");
        setProfileLoaded(false);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { displayName: newDisplayName });
    setDisplayName(newDisplayName); // Update display name in UI
    setSuccess("Display name updated!");
    setTimeout(() => setSuccess(""), 2000);
  };

  const handleBuyPremium = async () => {
    setLoading(true);
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }
    const options = {
      key: "rzp_test_XXXXXXXXXXXXXXXX", // your actual test key
      amount: 9900, // Amount in paise (₹99)
      currency: "INR",
      name: "ServiceDesk Premium Subscription",
      description: "Upgrade to premium",
      handler: function (response) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        // TODO: Mark user as premium in Firestore here
      },
      prefill: {
        email: user?.email,
      },
      theme: { color: "#6366f1" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  if (loading)
    return (
      <div className="text-indigo-600 text-center text-lg mt-10">
        Loading profile...
      </div>
    );

  if (!user) {
    return (
      <div className="text-center text-lg mt-10 text-red-600">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-slate-50">
      {console.log('Rendering Profile component')}
      <div className="bg-white p-8 rounded-xl shadow-md border-4 border-red-500 w-full max-w-md" style={{ minHeight: '500px', overflow: 'visible', paddingBottom: '48px' }}>
        <h1 className="text-2xl font-bold mb-6 text-indigo-700 text-center">
          My Profile
        </h1>
        <div className="mb-4">
          <p className="text-slate-700 mb-1">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-slate-700 mb-1">
            <strong>Role:</strong> {role}
          </p>
          <p className="text-slate-700 mb-1">
            <strong>Display Name:</strong> {displayName || <span className="italic text-slate-400">Not set</span>}
          </p>
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-slate-600 mb-1">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={newDisplayName ?? ""}
              onChange={(e) => setNewDisplayName(e.target.value)}
              className="w-full p-2 rounded border border-slate-300 text-black bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter display name"
              style={{ color: '#222' }}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-semibold transition"
          >
            Update
          </button>
          {/* Only show Buy Premium if not premium */}
          {!isPremium && (
            <button
              type="button"
              onClick={handleBuyPremium}
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded font-semibold transition mt-4"
            >
              {loading ? "Processing..." : "Buy Premium"}
            </button>
          )}
          <button
            type="button"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded font-semibold transition mt-4"
            onClick={() => alert('Test button clicked!')}
          >
            Test Button
          </button>
        </form>

        {success && (
          <div className="text-emerald-600 text-center mt-4">{success}</div>
        )}
        <hr className="my-6 border-slate-200" />
      </div>
    </div>
  );
}

export default Profile;

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const countries = [
  { code: "KE", name: "Kenya", dial: "+254" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "IN", name: "India", dial: "+91" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "NG", name: "Nigeria", dial: "+234" },
];

export default function ProfileInfo() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError("Could not fetch user info");
        setLoading(false);
        return;
      }
      // Fetch user profile from public user metadata
      setProfile({
        email: user.email,
        full_name: user.user_metadata?.full_name || "",
        country: user.user_metadata?.country || "KE",
      });
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError("Could not update profile: user not found");
      setSaving(false);
      return;
    }
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: profile.full_name,
        country: profile.country,
      },
    });
    if (updateError) {
      setError(updateError.message);
      toast.error(updateError.message);
    } else {
      setSuccess("Profile updated successfully!");
      toast.success("Profile updated successfully!");
    }
    setSaving(false);
  };

  if (loading) return <div className="bg-gray-800 p-4 rounded shadow text-white">Loading profile...</div>;
  if (error) return <div className="bg-red-700 p-4 rounded shadow text-white">{error}</div>;

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow text-white max-w-md mx-auto mt-8">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full px-4 py-2 rounded bg-gray-700 text-gray-400 border border-gray-600"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={profile.full_name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Country</label>
          <select
            name="country"
            value={profile.country}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
          >
            {countries.map(c => (
              <option key={c.code} value={c.code}>{c.name} ({c.dial})</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {success && <div className="text-green-400 text-sm mt-2">{success}</div>}
        {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
      </form>
    </div>
  );
}
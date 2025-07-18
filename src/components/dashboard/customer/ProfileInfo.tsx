import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { 
  FiUser, 
  FiEdit2,
  FiSave,
  FiX,
  FiCamera,
  FiShield,
  FiAward,
  FiStar
} from 'react-icons/fi';
import jsPDF from 'jspdf';
import { profileSchema } from '../../../validation/profileSchema';
import { logFileUpload } from '../../../lib/securityLogger';

export default function ProfileInfo() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    full_name: '', // for backward compatibility
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    date_of_birth: '',
    license_number: '',
    emergency_contact: '',
    kra_pin: '', // KRA PIN
    id_document_url: '', // National ID upload
    passport_url: '', // Passport upload
    avatar_url: '', // Add this line
    gender: '',
    genderOther: '',
    preferences: {
      language: 'English',
      currency: 'KES',
      notifications: true,
      marketing_emails: false
    },
    communication_method: 'SMS' as 'SMS' | 'Email' | 'WhatsApp',
    theme: 'Auto' as 'Auto' | 'Light' | 'Dark',
    notification_channels: {
      sms: true,
      email: true,
      push: true
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showLoginHistoryModal, setShowLoginHistoryModal] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Fetch additional profile data from profiles table
        let { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && (error.code === 'PGRST116' || error.code === '404')) {
          // Row not found, create it with all required fields
          const emptyProfile = {
            id: user.id,
            email: user.email,
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            full_name: user.user_metadata?.full_name || '',
            phone: '',
            address: '',
            city: '',
            country: '',
            date_of_birth: '',
            license_number: '',
            emergency_contact: '',
            kra_pin: '',
            id_document_url: '',
            passport_url: '',
            avatar_url: '',
            gender: '',
            gender_other: '',
            preferences: {
              language: 'English',
              currency: 'KES',
              notifications: true,
              marketing_emails: false
            },
            communication_method: 'SMS',
            theme: 'Auto',
            notification_channels: { sms: true, email: true, push: true }
          };
          await supabase.from('profiles').insert(emptyProfile);
          profileData = emptyProfile;
        }

        if (profileData) {
          const safePreferences = (profileData.preferences && typeof profileData.preferences === 'object' && Object.keys(profileData.preferences).length > 0)
            ? profileData.preferences
            : {
                language: 'English',
                currency: 'KES',
                notifications: true,
                marketing_emails: false
              };
          const safeNotificationChannels = (profileData.notification_channels && typeof profileData.notification_channels === 'object' && Object.keys(profileData.notification_channels).length > 0)
            ? profileData.notification_channels
            : { sms: true, email: true, push: true };
          setProfile({
            ...profileData,
            preferences: safePreferences,
            notification_channels: safeNotificationChannels
          });
          if (typeof profileData.avatar_url === 'string' && profileData.avatar_url) setAvatar(profileData.avatar_url);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (user) {
        // Validate profile with Zod
        const validation = profileSchema.safeParse(profile);
        if (!validation.success) {
          alert('Profile validation failed: ' + JSON.stringify(validation.error.issues));
          setLoading(false);
          return;
        }
        // Update user metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: { full_name: `${profile.first_name} ${profile.last_name}`.trim() }
        });
        if (updateError) throw updateError;
        // Upsert profile in profiles table
        const upsertProfile = {
          id: user.id,
          email: profile.email?.trim() || null,
          first_name: profile.first_name?.trim() || null,
          last_name: profile.last_name?.trim() || null,
          full_name: `${profile.first_name} ${profile.last_name}`.trim() || null,
          phone: profile.phone?.trim() || null,
          address: profile.address?.trim() || null,
          city: profile.city?.trim() || null,
          country: profile.country?.trim() || null,
          date_of_birth: profile.date_of_birth?.trim() || null,
          license_number: profile.license_number?.trim() || null,
          emergency_contact: profile.emergency_contact?.trim() || null,
          kra_pin: profile.kra_pin?.trim() || null,
          id_document_url: profile.id_document_url?.trim() || null,
          passport_url: profile.passport_url?.trim() || null,
          avatar_url: profile.avatar_url?.trim() || null,
          gender: profile.gender?.trim() || null,
          gender_other: profile.genderOther?.trim() || null,
          preferences: profile.preferences || { language: 'English', currency: 'KES', notifications: true, marketing_emails: false },
          communication_method: profile.communication_method?.trim() || null,
          theme: profile.theme?.trim() || null,
          notification_channels: profile.notification_channels || { sms: true, email: true, push: true },
          updated_at: new Date().toISOString()
        };
        const { error: profileError } = await supabase.from('profiles').upsert(upsertProfile);
        if (profileError) throw profileError;
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      if (error && typeof error === 'object' && error !== null && 'code' in error && (error as any).code === '42P01') {
        alert('The profiles table does not exist in your Supabase project. Please create it.');
      } else {
        console.error('Error updating profile:', error);
        alert('Error updating profile. Please check all fields and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      if (user) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', user.id);

        if (profileError) throw profileError;

        setShowDeleteModal(false);
        alert('Your account has been deleted.');
        // Optionally, redirect to login page
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fix avatar upload logic
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        setAvatar(publicUrlData.publicUrl);
        setProfile(prev => ({ ...prev, avatar_url: publicUrlData.publicUrl }));
        await supabase.from('profiles').upsert({ id: user.id, avatar_url: publicUrlData.publicUrl });
        await logFileUpload(user.id, 'avatar', file.name, { size: file.size });
        alert('Profile picture uploaded successfully!');
      } else {
        alert('Error uploading avatar: ' + (uploadError.message || JSON.stringify(uploadError)));
        throw uploadError;
      }
    } catch (error) {
      alert('Error uploading avatar. Please try again.');
    }
  };
  // Fix ID upload logic
  const handleIDUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-id-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from('ids').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('ids').getPublicUrl(filePath);
      setProfile(prev => ({ ...prev, id_document_url: publicUrl }));
      const { error: updateError } = await supabase.from('profiles').update({ id_document_url: publicUrl }).eq('id', user.id);
      if (updateError) throw updateError;
      await logFileUpload(user.id, 'national_id', file.name, { size: file.size });
      alert('National ID uploaded successfully!');
    } catch (error) {
      console.error('Error uploading National ID:', error);
      alert('Error uploading National ID.');
    }
  };
  // Fix passport upload logic
  const handlePassportUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-passport-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from('passports').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('passports').getPublicUrl(filePath);
      setProfile(prev => ({ ...prev, passport_url: publicUrl }));
      const { error: updateError } = await supabase.from('profiles').update({ passport_url: publicUrl }).eq('id', user.id);
      if (updateError) throw updateError;
      await logFileUpload(user.id, 'passport', file.name, { size: file.size });
      alert('Passport uploaded successfully!');
    } catch (error) {
      console.error('Error uploading Passport:', error);
      alert('Error uploading Passport.');
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    // Add logos (assume /logo.png and /gov-logo.png in public folder)
    doc.addImage('/logo.png', 'PNG', 10, 5, 30, 20);
    doc.addImage('/gov-logo.png', 'PNG', 170, 5, 30, 20);
    doc.setFontSize(18);
    doc.text('Justice Ultimate Automobiles - Account Information', 15, 40);
    doc.setFontSize(12);
    let y = 55;
    Object.entries(profile).forEach(([key, value]) => {
      if (typeof value === 'object') return;
      doc.text(`${key}: ${value || 'N/A'}`, 15, y);
      y += 8;
    });
    doc.save('JUA-Account-Info.pdf');
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="text-4xl" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer hover:bg-gray-100">
                <FiCamera className="text-gray-600" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile.first_name || 'Your Name'} {profile.last_name}</h1>
              <p className="text-blue-100">{profile.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-white/20 text-white">
                  <FiAward className="mr-1" />
                  Gold Member
                </Badge>
                <Badge className="bg-white/20 text-white">
                  <FiStar className="mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardContent className="p-4 bg-blue-50 border-b">
          <p className="text-sm text-blue-700">All fields are optional. You may leave them blank or enter <strong>N/A</strong> if you wish.</p>
        </CardContent>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
            >
              {isEditing ? <FiX className="mr-2" /> : <FiEdit2 className="mr-2" />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <Input
                value={profile.first_name || ''}
                onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                disabled={!isEditing}
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <Input
                value={profile.last_name || ''}
                onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                disabled={!isEditing}
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                value={profile.email || ''}
                disabled
                placeholder="Email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                value={profile.phone || ''}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                disabled={!isEditing}
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date of Birth</label>
              <Input
                type="date"
                value={profile.date_of_birth || ''}
                onChange={(e) => setProfile({...profile, date_of_birth: e.target.value})}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">License Number</label>
              <Input
                value={profile.license_number || ''}
                onChange={(e) => setProfile({...profile, license_number: e.target.value})}
                disabled={!isEditing}
                placeholder="Driver's license number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Emergency Contact</label>
              <Input
                value={profile.emergency_contact || ''}
                onChange={(e) => setProfile({...profile, emergency_contact: e.target.value})}
                disabled={!isEditing}
                placeholder="Emergency contact number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <Input
                value={profile.address || ''}
                onChange={(e) => setProfile({...profile, address: e.target.value})}
                disabled={!isEditing}
                placeholder="Street address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <Input
                value={profile.city || ''}
                onChange={(e) => setProfile({...profile, city: e.target.value})}
                disabled={!isEditing}
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <Input
                value={profile.country || ''}
                onChange={(e) => setProfile({...profile, country: e.target.value})}
                disabled={!isEditing}
                placeholder="Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">KRA PIN</label>
              <Input
                value={profile.kra_pin || ''}
                onChange={(e) => setProfile({...profile, kra_pin: e.target.value})}
                disabled={!isEditing}
                placeholder="Enter your KRA PIN"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <select
                value={profile.gender || ''}
                onChange={e => setProfile({ ...profile, gender: e.target.value })}
                disabled={!isEditing}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
                <option value="Other">Other</option>
              </select>
              {profile.gender === 'Other' && isEditing && (
                <input
                  type="text"
                  placeholder="Please specify"
                  value={profile.genderOther || ''}
                  onChange={e => setProfile({ ...profile, genderOther: e.target.value })}
                  className="mt-2 w-full p-2 border border-gray-300 rounded-md"
                />
              )}
            </div>
          </div>

          {isEditing && (
            <div className="md:col-span-2 flex flex-col md:flex-row gap-6 mt-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">National ID Upload</label>
                {profile.id_document_url ? (
                  <div className="mb-2">
                    <a href={profile.id_document_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Uploaded ID</a>
                  </div>
                ) : null}
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  disabled={!isEditing}
                  onChange={handleIDUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Passport Upload</label>
                {profile.passport_url ? (
                  <div className="mb-2">
                    <a href={profile.passport_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Uploaded Passport</a>
                  </div>
                ) : null}
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  disabled={!isEditing}
                  onChange={handlePassportUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          )}

          {isEditing && (
            <div className="flex gap-4 mt-6">
              <Button onClick={handleSave} disabled={loading}>
                <FiSave className="mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={profile.preferences.language || ''}
                onChange={(e) => setProfile({
                  ...profile, 
                  preferences: {...profile.preferences, language: e.target.value}
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="English">English</option>
                <option value="Swahili">Swahili</option>
                <option value="French">French</option>
                <option value="Arabic">Arabic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <select
                value={profile.preferences.currency || ''}
                onChange={(e) => setProfile({
                  ...profile, 
                  preferences: {...profile.preferences, currency: e.target.value}
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="KES">Kenyan Shilling (KES)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Preferred Communication Method</label>
              <select
                value={profile.communication_method || ''}
                onChange={e => setProfile({ ...profile, communication_method: e.target.value as 'SMS' | 'Email' | 'WhatsApp' })}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={!isEditing}
              >
                <option value="SMS">SMS</option>
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <select
                value={profile.theme || ''}
                onChange={e => setProfile({ ...profile, theme: e.target.value as 'Auto' | 'Light' | 'Dark' })}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={!isEditing}
              >
                <option value="Auto">Auto</option>
                <option value="Light">Light</option>
                <option value="Dark">Dark</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={profile.notification_channels?.sms || false}
                  onChange={e => setProfile({ ...profile, notification_channels: { ...profile.notification_channels, sms: e.target.checked } })}
                  disabled={!isEditing}
                />
                <span className="text-sm font-medium">SMS Notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={profile.notification_channels?.email || false}
                  onChange={e => setProfile({ ...profile, notification_channels: { ...profile.notification_channels, email: e.target.checked } })}
                  disabled={!isEditing}
                />
                <span className="text-sm font-medium">Email Notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={profile.notification_channels?.push || false}
                  onChange={e => setProfile({ ...profile, notification_channels: { ...profile.notification_channels, push: e.target.checked } })}
                  disabled={!isEditing}
                />
                <span className="text-sm font-medium">Push Notifications</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={profile.preferences.marketing_emails}
                  onChange={(e) => setProfile({
                    ...profile, 
                    preferences: {...profile.preferences, marketing_emails: e.target.checked}
                  })}
                  className="rounded"
                />
                <span className="text-sm font-medium">Marketing Emails</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiShield />
            Account Security
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline" onClick={() => setShow2FAModal(true)}>Enable 2FA</Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Change Password</h3>
                <p className="text-sm text-gray-600">Update your account password</p>
              </div>
              <Button variant="outline" onClick={() => setShowChangePasswordModal(true)}>Change Password</Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Login History</h3>
                <p className="text-sm text-gray-600">View recent login activity</p>
              </div>
              <Button variant="outline" onClick={() => setShowLoginHistoryModal(true)}>View History</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Button */}
      <div className="mt-8 flex justify-end">
        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
          Delete Account
        </Button>
      </div>
      {showDeleteModal && (
        <DeleteAccountModal
          username={profile.full_name || 'user'}
          userId={user?.id}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
      {show2FAModal && <TwoFAModal user={user} onClose={() => setShow2FAModal(false)} />}
      {showChangePasswordModal && <ChangePasswordModal user={user} onClose={() => setShowChangePasswordModal(false)} />}
      {showLoginHistoryModal && <LoginHistoryModal user={user} onClose={() => setShowLoginHistoryModal(false)} />}

      {/* TODO: Integrate image cropper for avatar upload */}
    </div>
  );
}

// Add prop types for modals
interface ModalProps {
  user: any;
  onClose: () => void;
}
interface DeleteAccountModalProps {
  username: string;
  userId: string;
  onClose: () => void;
}

function DeleteAccountModal({ username, userId, onClose }: DeleteAccountModalProps) {
  const [reason, setReason] = useState('');
  const [issues, setIssues] = useState(false);
  const [returning, setReturning] = useState('');
  const [improvements, setImprovements] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== `delete ${username.toLowerCase()} account`) {
      setError('Confirmation phrase does not match. Please type exactly as shown.');
      return;
    }
    setLoading(true);
    try {
      // Save feedback to admin table
      await supabase.from('account_deletion_feedback').insert({
        user_id: userId,
        reason,
        issues,
        returning,
        improvements,
      });
      // Delete user account (client-side, not admin API)
      await supabase.auth.signOut();
      await supabase.from('profiles').delete().eq('id', userId);
      window.location.href = '/account-deleted';
    } catch (err) {
      setError('Error deleting account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Delete Account</h2>
        <textarea
          placeholder="Why are you deleting your account?"
          onChange={e => setReason(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <div className="mb-2">
          <label>Experienced any issues?</label>
          <input type="checkbox" onChange={e => setIssues(e.target.checked)} className="ml-2" />
        </div>
        <div className="mb-2">
          <label>Would you consider coming back?</label>
          <select onChange={e => setReturning(e.target.value)} className="w-full p-2 border rounded">
            <option value="">Select...</option>
            <option value="yes">Yes</option>
            <option value="maybe">Maybe</option>
            <option value="no">No</option>
          </select>
        </div>
        <textarea
          placeholder="What could we improve?"
          onChange={e => setImprovements(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <div className="mb-2">
          <p className="text-sm text-gray-500">
            Type <strong>{`delete ${username.toLowerCase()} account`}</strong> to confirm.
          </p>
          <input
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            className="w-full p-2 mt-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="flex gap-4 justify-end mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Confirm & Delete My Account'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function TwoFAModal({ user, onClose }: ModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnable2FA = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // TODO: Implement TOTP generation with Supabase JS v2 when available
      const data = null; const error = null;

      if (error) throw error;
      if (data) {
        alert('2FA code generated. Please verify it on your authenticator app.');
        // In a real app, you'd send this code to the user's device
      }
    } catch (err) {
      setError('Error generating 2FA code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // TODO: Implement TOTP verification with Supabase JS v2 when available
      const data = null; const error = null;

      if (error) throw error;
      if (data) {
        alert('2FA enabled successfully!');
        onClose();
      }
    } catch (err) {
      setError('Error verifying 2FA code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">Enable Two-Factor Authentication</h2>
        <p className="text-sm text-gray-700 mb-4">
          To enable two-factor authentication, we need to verify your identity.
          This adds an extra layer of security to your account.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Verification Code</label>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter the code from your authenticator app"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleVerify2FA} disabled={loading}>
            {loading ? 'Enabling...' : 'Enable 2FA'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChangePasswordModal({ user, onClose }: ModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!user) return;
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: currentPassword,
        data: {
          password: newPassword,
        },
      });

      if (error) throw error;
      alert('Password changed successfully!');
      onClose();
    } catch (err) {
      setError('Error changing password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
        <h2 className="text-xl font-semibold text-green-600 mb-4">Change Password</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your current password"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your new password"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Confirm New Password</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={e => setConfirmNewPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Confirm your new password"
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="flex gap-4 justify-end mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleChangePassword} disabled={loading}>
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function LoginHistoryModal({ user, onClose }: ModalProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoginHistory = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('login_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        if (error && error.code === '42P01') {
          setError('The login_history table does not exist in your Supabase project. Please create it.');
        } else if (error) {
          throw error;
        } else {
          setHistory(data || []);
        }
      } catch (err) {
        setError('Error fetching login history.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoginHistory();
    const interval = setInterval(fetchLoginHistory, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [user]);

  if (loading && history.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Loading Login History...</h2>
          <p className="text-sm text-gray-700">Please wait while we fetch your recent login activity.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading History</h2>
          <p className="text-sm text-gray-700">{error}</p>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">No Recent Login Activity</h2>
          <p className="text-sm text-gray-700">You haven't logged in recently.</p>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">Recent Login Activity</h2>
        <div className="overflow-y-auto max-h-96">
          {history.map((session, index) => (
            <div key={session.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
              <div>
                <p className="text-sm font-medium">{session.created_at ? new Date(session.created_at).toLocaleDateString() : 'N/A'}</p>
                <p className="text-xs text-gray-500">
                  {session.created_at ? new Date(session.created_at).toLocaleTimeString() : 'N/A'}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                {session.last_used_at ? new Date(session.last_used_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
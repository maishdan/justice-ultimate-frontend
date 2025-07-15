import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { 
  FiShield, 
  FiLock, 
  FiEye, 
  FiEyeOff,
  FiSmartphone,
  FiMail,
  FiUser,
  FiCheckCircle,
  FiAlertTriangle,
  FiSettings,
  FiKey,
  FiGlobe
} from 'react-icons/fi';

export default function SecuritySettings() {
  const [user, setUser] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    fetchUserData();
    fetchSessions();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchSessions = async () => {
    // Mock sessions data
    const mockSessions = [
      {
        id: '1',
        device: 'Chrome on Windows',
        location: 'Nairobi, Kenya',
        ip: '192.168.1.100',
        lastActive: '2024-01-14T10:30:00Z',
        isCurrent: true
      },
      {
        id: '2',
        device: 'Firefox on Android',
        location: 'Mombasa, Kenya',
        ip: '192.168.1.101',
        lastActive: '2024-01-13T15:45:00Z',
        isCurrent: false
      },
      {
        id: '3',
        device: 'Safari on iPhone',
        location: 'Kisumu, Kenya',
        ip: '192.168.1.102',
        lastActive: '2024-01-12T09:20:00Z',
        isCurrent: false
      }
    ];
    setSessions(mockSessions);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      alert('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorToggle = async () => {
    try {
      if (twoFactorEnabled) {
        // Disable 2FA
        setTwoFactorEnabled(false);
        alert('Two-factor authentication disabled');
      } else {
        // Enable 2FA - this would typically redirect to a setup page
        setTwoFactorEnabled(true);
        alert('Two-factor authentication enabled');
      }
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      alert('Error updating two-factor authentication');
    }
  };

  const revokeSession = async (sessionId: string) => {
    if (confirm('Are you sure you want to revoke this session?')) {
      try {
        // Mock session revocation
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        alert('Session revoked successfully');
      } catch (error) {
        console.error('Error revoking session:', error);
        alert('Error revoking session');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { score: 0, label: '', color: '' };
    if (password.length < 8) return { score: 1, label: 'Weak', color: 'text-red-500' };
    if (password.length < 12) return { score: 2, label: 'Fair', color: 'text-yellow-500' };
    if (password.length < 16) return { score: 3, label: 'Good', color: 'text-blue-500' };
    return { score: 4, label: 'Strong', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Security Settings</h1>
          <p className="text-gray-600">Manage your account security and privacy preferences</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">
            <FiSettings className="mr-2" />
            Advanced Settings
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Two-Factor Auth</p>
                <p className="text-2xl font-bold text-green-600">
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <FiShield className="text-green-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-blue-600">{sessions.length}</p>
              </div>
              <FiGlobe className="text-blue-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Login</p>
                <p className="text-2xl font-bold text-purple-600">Today</p>
              </div>
              <FiUser className="text-purple-500 text-xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Change Password */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiLock />
            Change Password
          </h2>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <div className="relative">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FiEyeOff /> : <FiEye />}
                </Button>
              </div>
              {newPassword && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded ${
                          level <= passwordStrength.score
                            ? passwordStrength.color.replace('text-', 'bg-')
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-sm ${passwordStrength.color}`}>
                    Password strength: {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </Button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <Button type="submit" disabled={loading || !currentPassword || !newPassword || !confirmPassword}>
              <FiKey className="mr-2" />
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <FiSmartphone />
                Two-Factor Authentication
              </h2>
              <p className="text-gray-600">
                Add an extra layer of security to your account with 2FA
              </p>
            </div>
            <Button
              onClick={handleTwoFactorToggle}
              variant={twoFactorEnabled ? "destructive" : "default"}
            >
              {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </Button>
          </div>
          
          {twoFactorEnabled && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-green-500" />
                <span className="text-green-800 font-medium">Two-factor authentication is enabled</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your account is protected with an additional security layer
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiGlobe />
            Active Sessions
          </h2>
          
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{session.device}</p>
                    <p className="text-sm text-gray-600">
                      {session.location} • {session.ip}
                    </p>
                    <p className="text-sm text-gray-500">
                      Last active: {formatDate(session.lastActive)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {session.isCurrent && (
                    <Badge className="bg-green-100 text-green-800">Current</Badge>
                  )}
                  {!session.isCurrent && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => revokeSession(session.id)}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiShield />
            Privacy Settings
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Profile Visibility</h3>
                <p className="text-sm text-gray-600">Control who can see your profile information</p>
              </div>
              <select className="p-2 border border-gray-300 rounded">
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-600">Receive email updates about your account</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Marketing Communications</h3>
                <p className="text-sm text-gray-600">Receive promotional emails and offers</p>
              </div>
              <input type="checkbox" className="rounded" />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Data Analytics</h3>
                <p className="text-sm text-gray-600">Allow us to use your data for service improvement</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiAlertTriangle />
            Security Tips
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Strong Password</h3>
              <p className="text-sm text-blue-700">
                Use a combination of letters, numbers, and special characters
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Two-Factor Auth</h3>
              <p className="text-sm text-green-700">
                Enable 2FA for additional account protection
              </p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">Regular Updates</h3>
              <p className="text-sm text-yellow-700">
                Keep your password updated and unique
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">Monitor Sessions</h3>
              <p className="text-sm text-purple-700">
                Regularly review and revoke unknown sessions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
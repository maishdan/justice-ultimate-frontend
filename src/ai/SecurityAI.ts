import { supabase } from '../lib/supabaseClient';

// Helper: Notify all admins of a flagged event
async function notifyAdminsOfSecurityEvent(event: any, reason: string) {
  // Find all admin users
  const { data: admins, error } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('role', 'admin');
  if (error || !admins) return;
  // Insert a notification for each admin
  for (const admin of admins) {
    await supabase.from('notifications').insert({
      user_id: admin.id,
      type: 'security',
      title: 'Security Alert',
      message: reason + ` (Event: ${event.event_type}, IP: ${event.ip || 'N/A'})`,
      created_at: new Date().toISOString(),
      service: 'AI Security',
      read: false
    });
  }
}

export async function analyzeSecurityEvents() {
  const { data: events, error } = await supabase
    .from('security_events')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(500);
  if (error) return { flagged: [], summary: 'Error fetching events.' };

  const flagged: any[] = [];
  const ipCounts: Record<string, number> = {};
  const failedLogins = (events as any[]).filter((e: any) => e.event_type === 'login_failed');
  for (const event of failedLogins) {
    ipCounts[event.ip] = (ipCounts[event.ip] || 0) + 1;
    if (ipCounts[event.ip] > 5) {
      flagged.push({ ...event, reason: 'Brute force suspected: >5 failed logins from same IP.' });
      await notifyAdminsOfSecurityEvent(event, 'Brute force suspected: >5 failed logins from same IP.');
    }
  }
  // Detect rapid profile updates
  const profileUpdates = (events as any[]).filter((e: any) => e.event_type === 'profile_update');
  const profileUpdateCounts: Record<string, number> = {};
  for (const event of profileUpdates) {
    profileUpdateCounts[event.user_id] = (profileUpdateCounts[event.user_id] || 0) + 1;
    if (profileUpdateCounts[event.user_id] > 10) {
      flagged.push({ ...event, reason: 'Profile update flood: >10 updates in short period.' });
      await notifyAdminsOfSecurityEvent(event, 'Profile update flood: >10 updates in short period.');
    }
  }
  // Detect file upload floods
  const fileUploads = (events as any[]).filter((e: any) => e.event_type === 'file_upload');
  const fileUploadCounts: Record<string, number> = {};
  for (const event of fileUploads) {
    fileUploadCounts[event.user_id] = (fileUploadCounts[event.user_id] || 0) + 1;
    if (fileUploadCounts[event.user_id] > 20) {
      flagged.push({ ...event, reason: 'File upload flood: >20 uploads in short period.' });
      await notifyAdminsOfSecurityEvent(event, 'File upload flood: >20 uploads in short period.');
    }
  }
  // Detect suspicious navigation
  const suspiciousNavs = (events as any[]).filter((e: any) => e.event_type === 'suspicious_navigation');
  for (const event of suspiciousNavs) {
    flagged.push({ ...event, reason: 'Suspicious navigation attempt detected.' });
    await notifyAdminsOfSecurityEvent(event, 'Suspicious navigation attempt detected.');
  }
  // Attack vector summary
  const summary = `${flagged.length} suspicious events detected. Brute force: ${Object.values(ipCounts).filter(c => c > 5).length}, Profile floods: ${Object.values(profileUpdateCounts).filter(c => c > 10).length}, File floods: ${Object.values(fileUploadCounts).filter(c => c > 20).length}, Suspicious navs: ${suspiciousNavs.length}`;
  return { flagged, summary };
}

export async function getSecuritySummary() {
  const { flagged, summary } = await analyzeSecurityEvents();
  return { flagged, summary };
} 
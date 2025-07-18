import { supabase } from './supabaseClient';

export async function logSecurityEvent(event_type: string, user_id: string, details: Record<string, any> = {}) {
  let ip = null;
  try {
    ip = await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => data.ip);
  } catch (e) {}
  await supabase.from('security_events').insert({
    event_type,
    ip,
    user_id,
    details,
    timestamp: new Date().toISOString()
  });
}

export async function logFileUpload(user_id: string, fileType: string, fileName: string, details: Record<string, any> = {}) {
  await logSecurityEvent('file_upload', user_id, { fileType, fileName, ...details });
}

export async function logProfileUpdate(user_id: string, changedFields: string[], details: Record<string, any> = {}) {
  await logSecurityEvent('profile_update', user_id, { changedFields, ...details });
}

export async function logSuspiciousNavigation(user_id: string, attemptedPath: string, details: Record<string, any> = {}) {
  await logSecurityEvent('suspicious_navigation', user_id, { attemptedPath, ...details });
} 
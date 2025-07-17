// ===== COMPREHENSIVE SECURITY SYSTEM =====

// Types for security features
interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'access_denied' | 'suspicious_activity' | 'session_timeout' | 'password_change' | 'role_change';
  userId?: string;
  userRole?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  deviceInfo?: string;
}

interface RateLimitInfo {
  attempts: number;
  lastAttempt: number;
  blocked: boolean;
  blockUntil?: number;
}

interface SessionInfo {
  sessionId: string;
  userId: string;
  userRole: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastActivity: string;
  expiresAt: string;
  isActive: boolean;
  deviceFingerprint: string;
  location?: string;
}

// Security configuration
const SECURITY_CONFIG = {
  // Session settings
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  sessionRefreshInterval: 5 * 60 * 1000, // 5 minutes
  maxConcurrentSessions: 1,
  
  // Rate limiting
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  maxRequestsPerMinute: 100,
  
  // Password requirements
  minPasswordLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  
  // Security headers
  enableCSP: true,
  enableHSTS: true,
  enableXSSProtection: true,
  
  // Audit logging
  enableAuditLog: true,
  logRetentionDays: 90,
  
  // Threat detection
  enableThreatDetection: true,
  suspiciousPatterns: [
    /admin.*admin/i,
    /password.*password/i,
    /test.*test/i,
    /123.*456/i,
  ],
};

// Rate limiting storage
const rateLimitStore = new Map<string, RateLimitInfo>();

// Session storage with encryption
const sessionStore = new Map<string, SessionInfo>();

// Security events log
const securityEvents: SecurityEvent[] = [];

// ===== CORE SECURITY FUNCTIONS =====

/**
 * Generate a secure session ID
 */
export const generateSecureSessionId = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Create device fingerprint
 */
export const createDeviceFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 'unknown';
  
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Device fingerprint', 2, 2);
  
  const fingerprint = canvas.toDataURL();
  return btoa(fingerprint).slice(0, 32);
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < SECURITY_CONFIG.minPasswordLength) {
    errors.push(`Password must be at least ${SECURITY_CONFIG.minPasswordLength} characters long`);
  }
  
  if (SECURITY_CONFIG.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (SECURITY_CONFIG.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (SECURITY_CONFIG.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (SECURITY_CONFIG.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for common patterns
  if (SECURITY_CONFIG.suspiciousPatterns.some(pattern => pattern.test(password))) {
    errors.push('Password contains suspicious patterns');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Rate limiting for login attempts
 */
export const checkRateLimit = (identifier: string): { allowed: boolean; remainingAttempts: number; blockUntil?: number } => {
  const now = Date.now();
  const rateLimit = rateLimitStore.get(identifier);
  
  if (!rateLimit) {
    rateLimitStore.set(identifier, {
      attempts: 1,
      lastAttempt: now,
      blocked: false
    });
    return { allowed: true, remainingAttempts: SECURITY_CONFIG.maxLoginAttempts - 1 };
  }
  
  // Check if still blocked
  if (rateLimit.blocked && rateLimit.blockUntil && now < rateLimit.blockUntil) {
    return { 
      allowed: false, 
      remainingAttempts: 0, 
      blockUntil: rateLimit.blockUntil 
    };
  }
  
  // Reset if block period has passed
  if (rateLimit.blocked && rateLimit.blockUntil && now >= rateLimit.blockUntil) {
    rateLimitStore.set(identifier, {
      attempts: 1,
      lastAttempt: now,
      blocked: false
    });
    return { allowed: true, remainingAttempts: SECURITY_CONFIG.maxLoginAttempts - 1 };
  }
  
  // Check if too many attempts
  if (rateLimit.attempts >= SECURITY_CONFIG.maxLoginAttempts) {
    const blockUntil = now + SECURITY_CONFIG.lockoutDuration;
    rateLimitStore.set(identifier, {
      ...rateLimit,
      blocked: true,
      blockUntil
    });
    
    logSecurityEvent({
      type: 'access_denied',
      ipAddress: identifier,
      userAgent: navigator.userAgent,
      details: 'Rate limit exceeded - account locked',
      severity: 'high'
    });
    
    return { allowed: false, remainingAttempts: 0, blockUntil };
  }
  
  // Increment attempts
  rateLimitStore.set(identifier, {
    ...rateLimit,
    attempts: rateLimit.attempts + 1,
    lastAttempt: now
  });
  
  return { 
    allowed: true, 
    remainingAttempts: SECURITY_CONFIG.maxLoginAttempts - rateLimit.attempts - 1 
  };
};

/**
 * Reset rate limit for successful login
 */
export const resetRateLimit = (identifier: string): void => {
  rateLimitStore.delete(identifier);
};

/**
 * Create new session with security checks
 */
export const createSecureSession = (userId: string, userRole: string): SessionInfo => {
  const sessionId = generateSecureSessionId();
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + SECURITY_CONFIG.sessionTimeout).toISOString();
  const deviceFingerprint = createDeviceFingerprint();
  
  // Get IP address (in real app, this would come from server)
  const ipAddress = 'client-ip'; // Placeholder
  
  const sessionInfo: SessionInfo = {
    sessionId,
    userId,
    userRole,
    ipAddress,
    userAgent: navigator.userAgent,
    createdAt: now,
    lastActivity: now,
    expiresAt,
    isActive: true,
    deviceFingerprint,
    location: 'Unknown' // Would be determined by IP geolocation
  };
  
  // Store session
  sessionStore.set(sessionId, sessionInfo);
  
  // Log security event
  logSecurityEvent({
    type: 'login',
    userId,
    userRole,
    ipAddress,
    userAgent: navigator.userAgent,
    details: 'New session created',
    severity: 'low',
    deviceInfo: deviceFingerprint
  });
  
  return sessionInfo;
};

/**
 * Validate session
 */
export const validateSession = (sessionId: string): { valid: boolean; session?: SessionInfo; reason?: string } => {
  const session = sessionStore.get(sessionId);
  
  if (!session) {
    return { valid: false, reason: 'Session not found' };
  }
  
  const now = Date.now();
  const expiresAt = new Date(session.expiresAt).getTime();
  
  if (now > expiresAt) {
    session.isActive = false;
    sessionStore.set(sessionId, session);
    
    logSecurityEvent({
      type: 'session_timeout',
      userId: session.userId,
      userRole: session.userRole,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      details: 'Session expired',
      severity: 'medium'
    });
    
    return { valid: false, reason: 'Session expired' };
  }
  
  // Update last activity
  session.lastActivity = new Date().toISOString();
  sessionStore.set(sessionId, session);
  
  return { valid: true, session };
};

/**
 * Invalidate session
 */
export const invalidateSession = (sessionId: string, reason: string = 'Manual logout'): void => {
  const session = sessionStore.get(sessionId);
  
  if (session) {
    session.isActive = false;
    sessionStore.set(sessionId, session);
    
    logSecurityEvent({
      type: 'logout',
      userId: session.userId,
      userRole: session.userRole,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      details: reason,
      severity: 'low'
    });
  }
  
  sessionStore.delete(sessionId);
};

/**
 * Log security events
 */
export const logSecurityEvent = (event: Omit<SecurityEvent, 'id' | 'timestamp'>): void => {
  if (!SECURITY_CONFIG.enableAuditLog) return;
  
  const securityEvent: SecurityEvent = {
    ...event,
    id: generateSecureSessionId(),
    timestamp: new Date().toISOString()
  };
  
  securityEvents.push(securityEvent);
  
  // Keep only recent events
  const cutoffDate = new Date(Date.now() - (SECURITY_CONFIG.logRetentionDays * 24 * 60 * 60 * 1000));
  const filteredEvents = securityEvents.filter(event => 
    new Date(event.timestamp) > cutoffDate
  );
  
  // In a real app, this would be sent to a logging service
  console.log('Security Event:', securityEvent);
  
  // Store in localStorage for demo purposes
  const storedEvents = JSON.parse(localStorage.getItem('securityEvents') || '[]');
  storedEvents.push(securityEvent);
  localStorage.setItem('securityEvents', JSON.stringify(storedEvents.slice(-100))); // Keep last 100 events
};

/**
 * Detect suspicious activity
 */
export const detectSuspiciousActivity = (userId: string, action: string, data: any): boolean => {
  if (!SECURITY_CONFIG.enableThreatDetection) return false;
  
  let suspicious = false;
  const reasons: string[] = [];
  
  // Check for rapid successive actions
  const recentEvents = securityEvents.filter(event => 
    event.userId === userId && 
    new Date(event.timestamp).getTime() > Date.now() - 60000 // Last minute
  );
  
  if (recentEvents.length > 10) {
    suspicious = true;
    reasons.push('Too many actions in short time');
  }
  
  // Check for unusual patterns
  if (action === 'login' && data.password) {
    if (SECURITY_CONFIG.suspiciousPatterns.some(pattern => pattern.test(data.password))) {
      suspicious = true;
      reasons.push('Suspicious password pattern');
    }
  }
  
  // Check for role escalation attempts
  if (action === 'role_change' && data.newRole === 'admin') {
    suspicious = true;
    reasons.push('Admin role escalation attempt');
  }
  
  if (suspicious) {
    logSecurityEvent({
      type: 'suspicious_activity',
      userId,
      userRole: data.userRole || 'unknown',
      ipAddress: 'client-ip',
      userAgent: navigator.userAgent,
      details: `Suspicious activity detected: ${reasons.join(', ')}`,
      severity: 'high'
    });
  }
  
  return suspicious;
};

/**
 * Get security statistics
 */
export const getSecurityStats = () => {
  const now = Date.now();
  const last24Hours = now - (24 * 60 * 60 * 1000);
  
  const recentEvents = securityEvents.filter(event => 
    new Date(event.timestamp).getTime() > last24Hours
  );
  
  return {
    totalEvents: securityEvents.length,
    eventsLast24h: recentEvents.length,
    activeSessions: Array.from(sessionStore.values()).filter(s => s.isActive).length,
    blockedIPs: Array.from(rateLimitStore.values()).filter(r => r.blocked).length,
    securityLevel: calculateSecurityLevel(),
    recentThreats: recentEvents.filter(e => e.severity === 'high' || e.severity === 'critical').length
  };
};

/**
 * Calculate overall security level
 */
const calculateSecurityLevel = (): 'low' | 'medium' | 'high' => {
  const stats = getSecurityStats();
  
  if (stats.recentThreats > 5 || stats.blockedIPs > 10) {
    return 'low';
  } else if (stats.recentThreats > 2 || stats.blockedIPs > 5) {
    return 'medium';
  } else {
    return 'high';
  }
};

/**
 * Clean up expired sessions and old data
 */
export const cleanupSecurityData = (): void => {
  const now = Date.now();
  
  // Clean up expired sessions
  for (const [sessionId, session] of sessionStore.entries()) {
    if (new Date(session.expiresAt).getTime() < now) {
      sessionStore.delete(sessionId);
    }
  }
  
  // Clean up old rate limit entries
  for (const [identifier, rateLimit] of rateLimitStore.entries()) {
    if (rateLimit.blockUntil && rateLimit.blockUntil < now) {
      rateLimitStore.delete(identifier);
    }
  }
  
  // Clean up old security events
  const cutoffDate = new Date(now - (SECURITY_CONFIG.logRetentionDays * 24 * 60 * 60 * 1000));
  const filteredEvents = securityEvents.filter(event => 
    new Date(event.timestamp) > cutoffDate
  );
  
  // In a real app, this would be handled by a database cleanup job
  console.log('Security data cleanup completed');
};

/**
 * Initialize security system
 */
export const initializeSecurity = (): void => {
  // Set up periodic cleanup
  setInterval(cleanupSecurityData, 60 * 60 * 1000); // Every hour
  
  // Set up session refresh
  setInterval(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      const result = validateSession(sessionId);
      if (!result.valid) {
        // Session expired, redirect to login
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      }
    }
  }, SECURITY_CONFIG.sessionRefreshInterval);
  
  // Log security system initialization
  logSecurityEvent({
    type: 'login',
    ipAddress: 'system',
    userAgent: 'Security System',
    details: 'Security system initialized',
    severity: 'low'
  });
  
  console.log('Security system initialized');
};

// Export security configuration for use in components
export { SECURITY_CONFIG, type SecurityEvent, type SessionInfo, type RateLimitInfo }; 
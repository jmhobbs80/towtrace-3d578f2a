
import { useState, useCallback, useEffect, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Session timeout after 30 minutes of inactivity
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'mousemove', 'touchstart'];

interface SessionManagerProps {
  onUserChange: (user: User | null) => void;
  onReconnecting: (status: boolean) => void;
  children?: React.ReactNode;
}

export const useSessionManager = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const reconnectAttempts = useState(0);
  const maxReconnectAttempts = 5;
  const { toast } = useToast();
  const activityTimeout = useRef<number>();
  const warningTimeout = useRef<number>();

  const resetActivityTimer = useCallback(() => {
    if (activityTimeout.current) {
      window.clearTimeout(activityTimeout.current);
    }
    if (warningTimeout.current) {
      window.clearTimeout(warningTimeout.current);
    }

    // Set warning timeout 5 minutes before session expiry
    warningTimeout.current = window.setTimeout(() => {
      toast({
        title: "Session Expiring Soon",
        description: "Your session will expire in 5 minutes due to inactivity.",
        duration: 10000,
      });
    }, INACTIVITY_TIMEOUT - 5 * 60 * 1000);

    // Set actual timeout
    activityTimeout.current = window.setTimeout(async () => {
      try {
        await signOut();
        toast({
          title: "Session Expired",
          description: "You have been logged out due to inactivity.",
          duration: 5000,
        });
      } catch (error) {
        console.error('Error during session timeout:', error);
      }
    }, INACTIVITY_TIMEOUT);
  }, [toast]);

  const logAuthAction = useCallback(async (action: string, metadata: any = {}) => {
    try {
      const { error } = await supabase.rpc('log_admin_action', {
        action_type: action,
        entity_type: 'auth',
        entity_id: user?.id,
        metadata: metadata
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging auth action:', error);
    }
  }, [user]);

  const attemptReconnect = useCallback(async () => {
    if (reconnectAttempts[0] >= maxReconnectAttempts) {
      setIsReconnecting(false);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Unable to restore session. Please sign in again.",
      });
      return false;
    }

    setIsReconnecting(true);
    reconnectAttempts[1](prev => prev + 1);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setIsReconnecting(false);
        reconnectAttempts[1](0);
        await logAuthAction('session_restored', {
          attempt: reconnectAttempts[0],
          timestamp: new Date().toISOString()
        });
        toast({
          title: "Session Restored",
          description: "Your session has been successfully restored.",
        });
        return true;
      }
    } catch (error) {
      console.error('Reconnection attempt failed:', error);
      setTimeout(attemptReconnect, Math.min(1000 * Math.pow(2, reconnectAttempts[0]), 30000));
    }
    return false;
  }, [reconnectAttempts, toast, logAuthAction]);

  const signOut = async () => {
    try {
      await logAuthAction('sign_out', {
        timestamp: new Date().toISOString(),
        reason: 'user_initiated'
      });
      await supabase.auth.signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  // Set up activity monitoring
  useEffect(() => {
    const handleActivity = () => {
      if (user) {
        resetActivityTimer();
      }
    };

    ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    if (user) {
      resetActivityTimer();
    }

    return () => {
      ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (activityTimeout.current) {
        window.clearTimeout(activityTimeout.current);
      }
      if (warningTimeout.current) {
        window.clearTimeout(warningTimeout.current);
      }
    };
  }, [user, resetActivityTimer]);

  useEffect(() => {
    const setupAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await logAuthAction('session_started', {
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Auth setup error:', error);
      } finally {
        setLoading(false);
      }
    };

    setupAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        await logAuthAction('auth_state_changed', {
          event: _event,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Set up periodic session check
    const sessionCheckInterval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && user) {
        attemptReconnect();
      }
    }, 60000);

    return () => {
      subscription.unsubscribe();
      clearInterval(sessionCheckInterval);
    };
  }, [user, attemptReconnect, logAuthAction]);

  return {
    user,
    loading,
    isReconnecting,
    reconnectAttempts: reconnectAttempts[0],
    maxReconnectAttempts,
    signOut,
    attemptReconnect
  };
};

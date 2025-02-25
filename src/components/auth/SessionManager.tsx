
import { useState, useCallback, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  }, [reconnectAttempts, toast]);

  const signOut = async () => {
    try {
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

  useEffect(() => {
    const setupAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Auth setup error:', error);
      } finally {
        setLoading(false);
      }
    };

    setupAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
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
  }, [user, attemptReconnect]);

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

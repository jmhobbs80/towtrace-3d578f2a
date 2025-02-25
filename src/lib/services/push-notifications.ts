
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export class PushNotificationService {
  private static instance: PushNotificationService;
  private swRegistration: ServiceWorkerRegistration | null = null;
  private notificationQueue: { title: string; options: NotificationOptions }[] = [];
  private isProcessing = false;

  private constructor() {
    this.init();
  }

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  private async init() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered successfully');
        
        // Check if we already have permission
        if (Notification.permission === 'granted') {
          this.subscribeToExistingPush();
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        toast({
          variant: "destructive",
          title: "Notification Setup Failed",
          description: "Failed to initialize push notifications. Please try again."
        });
      }
    }
  }

  private async subscribeToExistingPush() {
    if (!this.swRegistration) return;

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      if (subscription) {
        console.log('Existing push subscription found');
        // Update the subscription in the database
        await this.updateSubscriptionInDatabase(subscription);
      }
    } catch (error) {
      console.error('Error checking existing subscription:', error);
    }
  }

  private async updateSubscriptionInDatabase(subscription: PushSubscription) {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;

    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        subscription: this.serializeSubscription(subscription),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating subscription in database:', error);
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive important updates about your jobs and vehicles."
        });
      }
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      throw error;
    }
  }

  private serializeSubscription(subscription: PushSubscription): Record<string, any> {
    return {
      endpoint: subscription.endpoint,
      expirationTime: subscription.expirationTime,
      keys: {
        p256dh: subscription.toJSON().keys?.p256dh,
        auth: subscription.toJSON().keys?.auth
      }
    };
  }

  async subscribe() {
    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    if (!this.swRegistration) {
      throw new Error('Service Worker not registered');
    }

    try {
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BBtQCEjaIJb9A3iIyyRiMOfHP9qKR-4SRqu4zT9Bg_sit89-jNQKmYienx8lCzgCmD1z6vKmVswZT5RsVICaOlU'
      });

      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      await this.updateSubscriptionInDatabase(subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  async unsubscribe() {
    if (!this.swRegistration) return;

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();

        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (!userId) return;

        const { error } = await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', userId);

        if (error) throw error;

        toast({
          title: "Notifications Disabled",
          description: "You've successfully unsubscribed from notifications."
        });
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      throw error;
    }
  }

  // Method to test notifications
  async sendTestNotification() {
    if (Notification.permission !== 'granted') {
      await this.requestPermission();
    }

    if (Notification.permission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is a test notification from TowTrace',
        icon: '/icons/icon-192x192.png'
      });
    }
  }
}

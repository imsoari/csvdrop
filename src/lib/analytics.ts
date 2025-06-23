// Analytics utilities for tracking user interactions and events

class Analytics {
  private static instance: Analytics;
  private isInitialized = false;

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  init() {
    if (this.isInitialized) return;

    // Initialize Google Analytics if ID is provided
    const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
    if (gaId) {
      this.initGoogleAnalytics(gaId);
    }

    // Initialize Sentry if DSN is provided
    const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
    if (sentryDsn) {
      this.initSentry(sentryDsn);
    }

    this.isInitialized = true;
  }

  private initGoogleAnalytics(gaId: string) {
    // Load Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as unknown as { dataLayer: unknown[]; gtag: (...args: unknown[]) => void }).dataLayer = 
      (window as unknown as { dataLayer: unknown[] }).dataLayer || [];
    
    function gtag(...args: unknown[]) {
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push(args);
    }
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag = gtag;

    gtag('js', new Date());
    gtag('config', gaId);
  }

  private initSentry(dsn: string) {
    // Sentry would be initialized here if installed
    console.log('Sentry DSN configured:', dsn);
  }

  track(event: string, properties?: Record<string, unknown>) {
    // Track with Google Analytics
    const windowWithGtag = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (windowWithGtag.gtag) {
      windowWithGtag.gtag('event', event, properties);
    }

    // Track with custom analytics
    console.log('Analytics Event:', { event, properties });
  }

  trackPageView(path: string) {
    const windowWithGtag = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (windowWithGtag.gtag) {
      windowWithGtag.gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID, {
        page_path: path,
      });
    }
  }

  trackError(error: Error, context?: Record<string, unknown>) {
    console.error('Application Error:', error, context);
    
    // Track error with analytics
    this.track('error', {
      error_message: error.message,
      error_stack: error.stack,
      ...context,
    });
  }

  trackConversion(type: 'signup' | 'purchase' | 'subscription', value?: number) {
    this.track('conversion', {
      conversion_type: type,
      value,
      timestamp: new Date().toISOString(),
    });
  }
}

export const analytics = Analytics.getInstance();

// React hook for analytics
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackConversion: analytics.trackConversion.bind(analytics),
  };
};
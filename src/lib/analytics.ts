// Analytics and monitoring utilities
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
}

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
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', gaId);
  }

  private initSentry(dsn: string) {
    // Sentry would be initialized here if installed
    console.log('Sentry DSN configured:', dsn);
  }

  track(event: string, properties?: Record<string, any>) {
    // Track with Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', event, properties);
    }

    // Track with custom analytics
    console.log('Analytics Event:', { event, properties });
  }

  trackPageView(path: string) {
    if ((window as any).gtag) {
      (window as any).gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID, {
        page_path: path,
      });
    }
  }

  trackError(error: Error, context?: Record<string, any>) {
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
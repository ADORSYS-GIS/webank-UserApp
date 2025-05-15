export const GA_MEAS_ID = 'G-VZTDZZPX12';

type GtagEvent = {
  action?: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
};

type DataLayerEvent = {
  event: string;
  [key: string]: unknown;
};

declare global {
  interface Window { 
    gtag?: (
      command: 'event' | 'config' | 'js',
      action: string,
      params?: GtagEvent
    ) => void;
    dataLayer?: DataLayerEvent[];
  }
}

// Initialize dataLayer if it doesn't exist
if (!window.dataLayer) {
  window.dataLayer = [];
}

// Queue for events that occur before gtag is loaded
const eventQueue: DataLayerEvent[] = [];

// Process the event queue
const processEventQueue = () => {
  if (window.gtag) {
    console.log('Processing event queue, length:', eventQueue.length);
    while (eventQueue.length > 0) {
      const event = eventQueue.shift();
      if (event) {
        console.log('Processing queued event:', event);
        window.gtag('event', event.event, event);
      }
    }
  }
};

// Wait for gtag to be available
const waitForGtag = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.gtag) {
      console.log('gtag already available');
      resolve();
    } else {
      console.log('Waiting for gtag to be available...');
      const checkGtag = setInterval(() => {
        if (window.gtag) {
          console.log('gtag became available');
          clearInterval(checkGtag);
          processEventQueue();
          resolve();
        }
      }, 100);
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkGtag);
        console.log('gtag wait timed out');
        resolve();
      }, 5000);
    }
  });
};

// Initialize GA4
const initializeGA4 = async () => {
  console.log('Initializing GA4...');
  await waitForGtag();
  if (window.gtag) {
    console.log('Configuring GA4 with ID:', GA_MEAS_ID);
    window.gtag('config', GA_MEAS_ID, {
      send_page_view: false,
      debug_mode: true,
      transport_url: 'https://www.google-analytics.com',
      cookie_flags: 'SameSite=None;Secure'
    });
    processEventQueue();
  } else {
    console.warn('Failed to initialize GA4 - gtag not available');
  }
};

// Call initialization
initializeGA4();

/**
 * Log a custom event to Google Analytics 4
 * @param name - The name of the event
 * @param params - Optional parameters to include with the event
 */
export function logEvent(name: string, params?: Record<string, any>) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}

/**
 * Log a page view to Google Analytics 4
 * @param path - The path of the page being viewed
 */
export function logPageView(path: string) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title
    });
  }
}

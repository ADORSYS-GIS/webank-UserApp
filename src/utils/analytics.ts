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

/** Log any GA4 event */
export async function logEvent(name: string, params: Record<string, unknown> = {}) {
  const eventData = {
    event: name,
    ...params,
    event_name: name,
    send_to: GA_MEAS_ID,
    non_interaction: false,
    debug_mode: true
  };

  if (!window.gtag) {
    console.log('Queueing event (gtag not available):', name, eventData);
    eventQueue.push(eventData);
    return;
  }

  console.log('Sending GA4 event:', name, eventData);
  try {
    // Send directly to dataLayer first
    window.dataLayer?.push({
      ...eventData
    });
    
    // Then send via gtag
    window.gtag('event', name, eventData);
    console.log('Event sent successfully');
  } catch (error) {
    console.error('Error sending event:', error);
  }
}

/** Manually log page_view */
export async function logPageView(path: string) {
  const pageViewData = {
    event: 'page_view',
    page_path: path,
    page_title: document.title,
    send_to: GA_MEAS_ID,
    non_interaction: false,
    debug_mode: true
  };

  if (!window.gtag) {
    console.log('Queueing page_view (gtag not available):', pageViewData);
    eventQueue.push(pageViewData);
    return;
  }

  console.log('Sending GA4 page_view:', pageViewData);
  try {
    // Send directly to dataLayer first
    window.dataLayer?.push({
      ...pageViewData
    });
    
    // Then send via gtag
    window.gtag('event', 'page_view', pageViewData);
    console.log('Page view sent successfully');
  } catch (error) {
    console.error('Error sending page view:', error);
  }
}

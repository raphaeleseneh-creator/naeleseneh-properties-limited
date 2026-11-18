export type AnalyticsEventName =
  | 'property_view'
  | 'property_enquiry'
  | 'inspection_request'
  | 'whatsapp_click';

export interface AnalyticsPayload {
  event: AnalyticsEventName;
  propertyRef?: string;
  propertyTitle?: string;
  transactionType?: string;
  category?: string;
  sourcePage?: string;
  timestamp: string;
}

/**
 * Frontend analytics integration point.
 * Connect GA4 (window.gtag), Plausible, or a custom backend endpoint here at launch.
 */
export function trackAnalyticsEvent(
  event: AnalyticsEventName,
  details: Omit<AnalyticsPayload, 'event' | 'timestamp'> = {}
): AnalyticsPayload {
  const payload: AnalyticsPayload = {
    event,
    ...details,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const win = window as unknown as {
      dataLayer?: Record<string, unknown>[];
      __naelesenehEvents?: AnalyticsPayload[];
    };
    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push({ ...payload });
    }
    win.__naelesenehEvents = [...(win.__naelesenehEvents ?? []), payload];
  }

  return payload;
}

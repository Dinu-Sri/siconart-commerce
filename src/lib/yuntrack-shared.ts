export type TrackEvent = {
  at: string;
  content: string;
  location: string;
};

export type TrackResult = {
  code: string;
  status: string;
  destination: string;
  lastMileNumber: string;
  lastMileCarrier: string;
  events: TrackEvent[];
  url: string;
};

export function yuntrackUrl(code: string) {
  return `https://www.yuntrack.com/parcelTracking?id=${encodeURIComponent(code.trim())}`;
}

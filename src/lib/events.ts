export interface EventCoordinates {
  lat: number;
  lng: number;
}

export interface EventGeometry {
  type: "Point";
  coordinates: EventCoordinates;
}

export interface EventRecord {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  photo_url: string;
  main_url?: string;
  devpost_url?: string;
  project_url?: string;
  extra_url?: string;
  extra_url2?: string;
  extr?: string;
  winner_text?: string;
  type?: string;
  geometry?: EventGeometry;
}

export interface EventSectionData {
  key: string;
  title: string;
  description: string;
  events: EventRecord[];
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function dateParts(value: string) {
  const [date] = value.trim().split(/\s+/, 1);
  const [day, month, year] = date.split("-").map(Number);

  return { day, month, year };
}

export function formatEventPeriod(event: EventRecord) {
  const start = dateParts(event.start_date);
  const end = dateParts(event.end_date);
  const month =
    start.month === end.month
      ? MONTHS[end.month - 1]
      : `${MONTHS[start.month - 1]}–${MONTHS[end.month - 1]}`;

  return `${month} ${end.year}`;
}

export function normalizeAssetPath(path: string) {
  return path.startsWith("./") ? path.slice(1) : path;
}

export function eventId(sectionKey: string, event: EventRecord, index: number) {
  const slug = event.name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${sectionKey}-${slug || index}-${index}`;
}

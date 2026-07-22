import { EventExplorer } from "@/components/event-explorer";
import type { EventRecord, EventSectionData } from "@/lib/events";
import attendedCompetitions from "@/data/attended_competitions.json";
import attendedCongresses from "@/data/attended_congresses.json";
import attendedHackathons from "@/data/attended_hackathons.json";
import mentoredHackathons from "@/data/mentored_hackathons.json";
import organizedHackathons from "@/data/organized_hackathons.json";

const DEFAULT_MAPBOX_TOKEN =
  "pk.eyJ1IjoiZW5jcnlwdGV4IiwiYSI6ImNsZjVuMm54NzBtbHYzd3FoZ3h6czh1MWIifQ.a-ffpy_yiO84rbT774vpaw";

function newestFirst(events: unknown) {
  return [...(events as EventRecord[])].reverse();
}

const sections: EventSectionData[] = [
  {
    key: "hackathons-attended",
    kind: "attended",
    title: "Hackathons Attended",
    events: newestFirst(attendedHackathons),
  },
  {
    key: "events-organized",
    kind: "organized",
    title: "Events Organized",
    events: newestFirst(organizedHackathons),
  },
  {
    key: "hackathons-mentored",
    kind: "mentored",
    title: "Mentored Hackathons",
    events: newestFirst(mentoredHackathons),
  },
  {
    key: "robotics-competitions",
    kind: "competitions",
    title: "Robotic Competitions Attended",
    events: newestFirst(attendedCompetitions),
  },
  {
    key: "congresses-attended",
    kind: "congresses",
    title: "Congresses Attended",
    events: newestFirst(attendedCongresses),
  },
];

export default function Home() {
  return (
    <main className="container mt-3 mt-md-5">
      <h1>Congresses and Hackathons</h1>
      <EventExplorer
        mapboxToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || DEFAULT_MAPBOX_TOKEN}
        sections={sections}
      />
    </main>
  );
}

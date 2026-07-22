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
    title: "Hackathons attended",
    description: "Projects built, challenges tackled, and teams joined along the way.",
    events: newestFirst(attendedHackathons),
  },
  {
    key: "events-organized",
    title: "Events organized",
    description: "Communities, hackathons, meetups, and unconferences helped into existence.",
    events: newestFirst(organizedHackathons),
  },
  {
    key: "hackathons-mentored",
    title: "Hackathons mentored",
    description: "Supporting participants as they turned ambitious ideas into working projects.",
    events: newestFirst(mentoredHackathons),
  },
  {
    key: "robotics-competitions",
    title: "Robotics competitions attended",
    description: "Early engineering challenges on international competition floors.",
    events: newestFirst(attendedCompetitions),
  },
  {
    key: "congresses-attended",
    title: "Congresses attended",
    description: "Technology, industry, and developer gatherings that expanded the horizon.",
    events: newestFirst(attendedCongresses),
  },
];

const totalEvents = sections.reduce((total, section) => total + section.events.length, 0);
const mappedEvents = sections.reduce(
  (total, section) => total + section.events.filter((event) => event.geometry).length,
  0,
);
const years = sections
  .flatMap((section) => section.events)
  .map((event) => Number(event.start_date.match(/\d{4}/)?.[0]))
  .filter(Number.isFinite);
const yearRange = `${Math.min(...years)}—${Math.max(...years)}`;

export default function Home() {
  return (
    <>
      <header className="hero" id="top">
        <div className="hero__glow" />
        <div className="site-shell hero__content">
          <p className="hero__kicker">Jaume López Molina · Personal archive</p>
          <h1>Congresses, hackathons, and the people met between them.</h1>
          <p className="hero__intro">
            A growing record of building, learning, mentoring, and organizing across the
            technology community since 2018.
          </p>

          <dl className="hero__stats">
            <div>
              <dt>Events</dt>
              <dd>{totalEvents}</dd>
            </div>
            <div>
              <dt>With locations</dt>
              <dd>{mappedEvents}</dd>
            </div>
            <div>
              <dt>Years documented</dt>
              <dd>{yearRange}</dd>
            </div>
          </dl>
        </div>
      </header>

      <main className="site-shell">
        <EventExplorer
          mapboxToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || DEFAULT_MAPBOX_TOKEN}
          sections={sections}
        />
      </main>

      <footer className="site-footer">
        <div className="site-shell">
          <p>MyEvents · Built from a personal event archive.</p>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}

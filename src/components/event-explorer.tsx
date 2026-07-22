"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/event-card";
import { EventMap, type MapFocusRequest } from "@/components/event-map";
import type { EventRecord, EventSectionData } from "@/lib/events";

interface EventExplorerProps {
  mapboxToken: string;
  sections: EventSectionData[];
}

export function EventExplorer({ mapboxToken, sections }: EventExplorerProps) {
  const [focusRequest, setFocusRequest] = useState<MapFocusRequest | null>(null);
  const mappedEvents = useMemo(
    () =>
      sections
        .filter((section) => section.kind !== "mentored")
        .flatMap((section) => section.events)
        .filter((event) => event.geometry),
    [sections],
  );

  function locateEvent(event: EventRecord) {
    setFocusRequest({ event, requestId: Date.now() });
    document.getElementById("map")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <h3>Interactive Map</h3>
      <EventMap
        accessToken={mapboxToken}
        events={mappedEvents}
        focusRequest={focusRequest}
      />
      <hr className="mb-4" />

      <div className="row">
        {sections.map((section) => (
          <div className="col-12" key={section.key}>
            <h4
              style={
                section.kind === "attended" || section.kind === "organized"
                  ? undefined
                  : { marginTop: "60px" }
              }
            >
              {section.title}
            </h4>
            <div className="row">
              {section.events.map((event, index) => (
                <EventCard
                  event={event}
                  index={index}
                  key={`${event.name}-${event.start_date}`}
                  kind={section.kind}
                  onLocate={locateEvent}
                />
              ))}
            </div>
          </div>
        ))}

        <hr className="d-sm-none" />
      </div>
    </>
  );
}

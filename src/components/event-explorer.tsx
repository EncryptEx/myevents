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
    () => sections.flatMap((section) => section.events).filter((event) => event.geometry),
    [sections],
  );

  function locateEvent(event: EventRecord) {
    setFocusRequest({ event, requestId: Date.now() });
    document.getElementById("interactive-map")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <>
      <section className="map-section" id="interactive-map">
        <div className="section-heading section-heading--map">
          <div>
            <p className="eyebrow">Across the world</p>
            <h2>Interactive map</h2>
          </div>
          <p>Select a card with a location to jump to it on the map.</p>
        </div>
        <EventMap
          accessToken={mapboxToken}
          events={mappedEvents}
          focusRequest={focusRequest}
        />
      </section>

      <div className="event-sections">
        {sections.map((section) => (
          <section className="event-section" id={section.key} key={section.key}>
            <div className="section-heading">
              <div>
                <p className="eyebrow">{section.events.length} events</p>
                <h2>{section.title}</h2>
              </div>
              <p>{section.description}</p>
            </div>

            <div className="event-grid">
              {section.events.map((event, index) => (
                <EventCard
                  event={event}
                  index={index}
                  key={`${event.name}-${event.start_date}`}
                  onLocate={locateEvent}
                  sectionKey={section.key}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

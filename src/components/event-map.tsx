"use client";

import { useEffect, useRef } from "react";
import type { Map as MapboxMap } from "mapbox-gl";
import { normalizeAssetPath, type EventRecord } from "@/lib/events";

export interface MapFocusRequest {
  event: EventRecord;
  requestId: number;
}

interface EventMapProps {
  accessToken: string;
  events: EventRecord[];
  focusRequest: MapFocusRequest | null;
}

function popupFor(event: EventRecord) {
  const content = document.createElement("div");
  const heading = document.createElement("h3");
  heading.textContent = event.name;
  content.appendChild(heading);

  const description = document.createElement("p");
  description.textContent = event.description;

  if (event.extra_url) {
    description.appendChild(document.createTextNode(" For more info see "));
    const link = document.createElement("a");
    link.href = event.extra_url;
    link.textContent = "here";
    description.appendChild(link);
    description.appendChild(document.createTextNode("."));
  }

  content.appendChild(description);
  return content;
}

export function EventMap({ accessToken, events, focusRequest }: EventMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function createMap() {
      if (!containerRef.current || !accessToken) return;

      try {
        const mapboxgl = (await import("mapbox-gl")).default;
        if (cancelled || !containerRef.current) return;

        mapboxgl.accessToken = accessToken;
        const map = new mapboxgl.Map({
          container: containerRef.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [20.300080408981785, 40.74456809885214],
          zoom: 1.2,
        });
        mapRef.current = map;

        for (const event of events) {
          if (!event.geometry) continue;

          const marker = document.createElement("div");
          marker.className = "marker";
          marker.id = `markerId${events.indexOf(event)}`;
          marker.style.backgroundImage = `url(${normalizeAssetPath(event.photo_url)})`;

          new mapboxgl.Marker(marker)
            .setLngLat([
              event.geometry.coordinates.lng,
              event.geometry.coordinates.lat,
            ])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupFor(event)))
            .addTo(map);
        }
      } catch {
        // The original page left the map area blank if Mapbox could not initialize.
      }
    }

    void createMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [accessToken, events]);

  useEffect(() => {
    const coordinates = focusRequest?.event.geometry?.coordinates;
    if (!coordinates || !mapRef.current) return;

    mapRef.current.flyTo({
      center: [coordinates.lng, coordinates.lat],
      zoom: 15,
      essential: true,
    });
  }, [focusRequest]);

  return (
    <div
      id="map"
      ref={containerRef}
      style={{ width: "100%", height: "auto", minHeight: "500px" }}
    />
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
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
  content.className = "event-popup";

  const heading = document.createElement("h3");
  heading.textContent = event.name;
  content.appendChild(heading);

  const description = document.createElement("p");
  description.textContent = event.description;
  content.appendChild(description);

  if (event.extra_url) {
    const link = document.createElement("a");
    link.href = event.extra_url;
    link.rel = "noreferrer";
    link.target = "_blank";
    link.textContent = "More information";
    content.appendChild(link);
  }

  return content;
}

export function EventMap({ accessToken, events, focusRequest }: EventMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function createMap() {
      if (!containerRef.current || !accessToken) {
        setStatus("error");
        return;
      }

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
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        for (const event of events) {
          if (!event.geometry) continue;

          const marker = document.createElement("button");
          marker.className = "event-marker";
          marker.type = "button";
          marker.setAttribute("aria-label", `Open ${event.name} on the map`);
          const markerImage = new window.Image();
          markerImage.addEventListener("load", () => {
            marker.style.backgroundImage = `url("${normalizeAssetPath(event.photo_url)}")`;
          });
          markerImage.addEventListener("error", () => {
            marker.style.backgroundImage = 'url("/static/img/hackupc.svg")';
          });
          markerImage.src = normalizeAssetPath(event.photo_url);

          new mapboxgl.Marker({ element: marker })
            .setLngLat([
              event.geometry.coordinates.lng,
              event.geometry.coordinates.lat,
            ])
            .setPopup(new mapboxgl.Popup({ offset: 24 }).setDOMContent(popupFor(event)))
            .addTo(map);
        }

        map.once("load", () => {
          if (!cancelled) setStatus("ready");
        });
      } catch {
        if (!cancelled) setStatus("error");
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
    if (!coordinates || !mapRef.current || status !== "ready") return;

    mapRef.current.flyTo({
      center: [coordinates.lng, coordinates.lat],
      zoom: 14,
      essential: true,
    });
  }, [focusRequest, status]);

  return (
    <div className="map-shell">
      <div aria-label="Interactive event map" className="event-map" ref={containerRef} />
      {status === "loading" ? <p className="map-status">Loading the map…</p> : null}
      {status === "error" ? (
        <p className="map-status map-status--error">
          The map could not be loaded. Check your Mapbox token or network connection.
        </p>
      ) : null}
    </div>
  );
}

import Image from "next/image";
import type { MouseEvent } from "react";
import {
  eventId,
  formatEventPeriod,
  normalizeAssetPath,
  type EventRecord,
} from "@/lib/events";

interface EventCardProps {
  event: EventRecord;
  index: number;
  sectionKey: string;
  onLocate: (event: EventRecord) => void;
}

interface EventLink {
  href: string;
  icon: string;
  label: string;
}

function linksFor(event: EventRecord): EventLink[] {
  return [
    event.main_url && {
      href: event.main_url,
      icon: "/static/img/earth-americas-solid.svg",
      label: `${event.name} website`,
    },
    event.devpost_url && {
      href: event.devpost_url,
      icon: "/static/img/devpost.png",
      label: `${event.name} on Devpost`,
    },
    (event.project_url || event.extr) && {
      href: event.project_url || event.extr || "",
      icon: "/static/img/github.svg",
      label: `${event.name} project`,
    },
    event.extra_url && {
      href: event.extra_url,
      icon: "/static/img/earth-americas-solid.svg",
      label: `More information about ${event.name}`,
    },
    event.extra_url2 && {
      href: event.extra_url2,
      icon: "/static/img/earth-americas-solid.svg",
      label: `Additional information about ${event.name}`,
    },
  ].filter((link): link is EventLink => Boolean(link));
}

export function EventCard({ event, index, sectionKey, onLocate }: EventCardProps) {
  const canLocate = Boolean(event.geometry);
  const id = eventId(sectionKey, event, index);
  const typeClass = event.type
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  function handleClick() {
    if (canLocate) onLocate(event);
  }

  function stopCardClick(mouseEvent: MouseEvent<HTMLAnchorElement>) {
    mouseEvent.stopPropagation();
  }

  return (
    <article
      className={`event-card${canLocate ? " event-card--locatable" : ""}`}
      id={id}
      onClick={handleClick}
      onKeyDown={(keyboardEvent) => {
        if (canLocate && (keyboardEvent.key === "Enter" || keyboardEvent.key === " ")) {
          keyboardEvent.preventDefault();
          onLocate(event);
        }
      }}
      role={canLocate ? "button" : undefined}
      tabIndex={canLocate ? 0 : undefined}
      title={canLocate ? `Show ${event.name} on the map` : undefined}
    >
      {event.winner_text ? (
        <span className="winner-ribbon">{event.winner_text}</span>
      ) : null}

      <div className="event-card__image">
        <Image
          alt={`${event.name} logo`}
          fill
          onError={(imageEvent) => {
            imageEvent.currentTarget.srcset = "";
            imageEvent.currentTarget.src = "/static/img/hackupc.svg";
          }}
          sizes="(max-width: 720px) 34vw, (max-width: 1100px) 24vw, 190px"
          src={normalizeAssetPath(event.photo_url)}
        />
      </div>

      <div className="event-card__content">
        <div className="event-card__heading">
          <h3>{event.name}</h3>
          <div className="event-links">
            {linksFor(event).map((link, linkIndex) => (
              <a
                aria-label={link.label}
                href={link.href}
                key={`${link.href}-${linkIndex}`}
                onClick={stopCardClick}
                rel="noreferrer"
                target="_blank"
                title={link.label}
              >
                <Image alt="" height={19} src={link.icon} width={19} />
              </a>
            ))}
          </div>
        </div>

        <p className="event-card__description">{event.description}</p>

        <div className="event-card__meta">
          <time dateTime={event.start_date} title={`${event.start_date} – ${event.end_date}`}>
            {formatEventPeriod(event)}
          </time>
          {event.type ? (
            <span className={`event-type event-type--${typeClass}`}>
              {event.type}
            </span>
          ) : null}
          {canLocate ? <span className="map-hint">View on map</span> : null}
        </div>
      </div>
    </article>
  );
}

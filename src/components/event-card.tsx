/* eslint-disable @next/next/no-img-element */

import { Fragment } from "react";

import {
  formatEventPeriod,
  normalizeAssetPath,
  type EventRecord,
  type EventSectionKind,
} from "@/lib/events";

interface EventCardProps {
  event: EventRecord;
  index: number;
  kind: EventSectionKind;
  onLocate: (event: EventRecord) => void;
}

interface EventLink {
  href: string;
  icon: string;
  alt: string;
}

function linksFor(event: EventRecord, kind: EventSectionKind): EventLink[] {
  const links: Array<EventLink | null> = [
    event.main_url
      ? {
          href: event.main_url,
          icon: "/static/img/earth-americas-solid.svg",
          alt: "earth logo",
        }
      : null,
  ];

  if ((kind === "attended" || kind === "organized") && event.devpost_url) {
    links.push({ href: event.devpost_url, icon: "/static/img/devpost.png", alt: "devpost logo" });
  }

  if (kind === "attended" && event.project_url) {
    links.push({ href: event.project_url, icon: "/static/img/github.svg", alt: "github logo" });
  }

  if ((kind === "mentored" || kind === "competitions") && event.extra_url) {
    links.push({
      href: event.extra_url,
      icon: "/static/img/earth-americas-solid.svg",
      alt: "earth logo",
    });
  }

  return links.filter((link): link is EventLink => link !== null);
}

function typeColor(type: string) {
  return (
    {
      Hackathon: "bg-primary",
      Unconference: "bg-success",
      Meetup: "bg-info",
    }[type] || "bg-black"
  );
}

function wrapperClass(kind: EventSectionKind) {
  return kind === "organized" ? "col-md-11 col-12 mt-3" : "col-12 col-md-11 mt-3 mr";
}

function idPrefix(kind: EventSectionKind) {
  if (kind === "attended") return "attended_hackathons";
  if (kind === "organized") return "organized_hackathons";
  if (kind === "congresses") return "attended_congresses";
  return "attended_competitions";
}

export function EventCard({ event, index, kind, onLocate }: EventCardProps) {
  const locatable = Boolean(event.geometry);

  return (
    <div className="col-12 col-lg-6">
      <div className="row">
        <div
          className={`${wrapperClass(kind)}${event.winner_text ? " relativebox" : ""}`}
          id={`${idPrefix(kind)}_${index}`}
        >
          {event.winner_text ? (
            <div className="ribbon ribbon-top-left">
              <span>{event.winner_text}</span>
            </div>
          ) : null}

          <div
            className="row mb-4 border rounded shadow p-3"
            onClick={locatable ? () => onLocate(event) : undefined}
            style={locatable ? { cursor: "pointer" } : undefined}
          >
            <div className="col-4">
              <img alt="" src={normalizeAssetPath(event.photo_url)} className="portait rounded" />
            </div>

            <div className="col-8">
              <div className="row">
                <div className="col-12">
                  <h6 style={{ fontSize: "120%", fontWeight: "bold" }}>
                    {event.name}
                    <div style={{ float: "right" }}>
                      {linksFor(event, kind).map((link, linkIndex) => (
                        <Fragment key={`${link.href}-${linkIndex}`}>
                          {linkIndex > 0 ? " " : null}
                          <a className="text-decoration-none" href={link.href}>
                            <img className="icon" src={link.icon} alt={link.alt} />
                          </a>
                        </Fragment>
                      ))}
                    </div>
                  </h6>
                </div>

                <div className="col-12">
                  <p className="text-muted card-text text-justify">{event.description}</p>

                  {kind === "organized" ? (
                    <>
                      <span className="text-muted card-text text-justify">
                        {formatEventPeriod(event)}
                      </span>
                      {event.type ? (
                        <span
                          className={`badge ${typeColor(event.type)} rounded-pill`}
                          style={{ float: "right" }}
                        >
                          {event.type}
                        </span>
                      ) : null}
                    </>
                  ) : (
                    <p className="text-muted card-text text-justify">{formatEventPeriod(event)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Calendar, MapPin, Users, Clock, Globe } from "lucide-react";
import { Event } from "@/components/events/types/events";
import SwipeReveal from "./SwipeReveal";

interface Props {
  event: Event;
  className?: string;
}

export default function EventDetailsBox({ event, className }: Props) {
  return (
    <SwipeReveal>
      <div className={` ${className} space-y-4 text-white `}>
        <h3
          style={{
            color: event.color,
          }}
          className="font-elnath text-xl uppercase border-b pb-2 inline-block"
        >
          Event Details
        </h3>
        <div className="space-y-3 text-sm">
          {event.lastDate && !event.schedule && !event.prelimsDate && !event.finalsDate && (
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 shrink-0 mt-0.5" style={{ color: event.color }} />
              <span>{event.lastDate}</span>
            </div>
          )}
          {event.prelimsDate && (
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 shrink-0 mt-0.5" style={{ color: event.color }} />
              <span>Prelims: {event.prelimsDate}</span>
            </div>
          )}
          {event.finalsDate && (
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 shrink-0 mt-0.5" style={{ color: event.color }} />
              <span>Finals: {event.finalsDate}</span>
            </div>
          )}
          {event.schedule && event.schedule.map((session, i) => (
            <div key={i} className="flex items-start gap-3">
              <Calendar className="w-4 h-4 shrink-0 mt-0.5" style={{ color: event.color }} />
              <div className="flex flex-col w-full">
                <span>{session.title && `${session.title}: `}{session.date}</span>
                {session.timeSlots?.map((slot, j) => (
                  <div key={j} className="mt-2 border-l-2 pl-3" style={{ borderColor: event.color + '40' }}>
                    <div className="text-sm font-medium text-white/90 mb-1.5 flex items-center">
                       <Clock className="w-3.5 h-3.5 mr-1.5 opacity-80" />
                       {slot.time}
                    </div>
                    <div className="space-y-1.5">
                      {slot.venues.map((v, k) => (
                        <div key={k} className="text-xs text-white/70 flex items-start gap-2">
                          <MapPin className="w-3 h-3 min-w-[0.75rem] mt-[0.1rem] opacity-60" />
                          <span>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 shrink-0" style={{ color: event.color }} />
            <span>{event.format}</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4" style={{ color: event.color }} />
            <span>{event.teamSize}</span>
          </div>
        </div>
      </div>
    </SwipeReveal>
  );
}

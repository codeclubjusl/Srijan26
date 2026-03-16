import { Award } from "lucide-react";
import { Event } from "@/components/events/types/events";
import SwipeReveal from "./SwipeReveal";

interface Props {
  event: Event;
  className?: string;
}

export default function EventPrizePool({ event, className }: Props) {
  return (
    <SwipeReveal>
      <div className={` ${className} space-y-4`}>
        <h3
          style={{color: event.color}}
          className="font-elnath text-xl uppercase border-b pb-2 inline-block"
        >
          Prize Pool
        </h3>
        <div className="flex items-center gap-4">
          <span
            className="text-4xl font-bold tracking-wider"
            style={{ color: event.color }}
          >
            {event.prizePool}
          </span>
        </div>
        {(event.winnerPrize ||
          event.runnersUpPrize ||
          event.secondRunnersUpPrize) && (
          <div className="space-y-2 pt-2 text-base text-gray-300">
            {event.winnerPrize && (
              <div className="flex items-center gap-2">
                <Award size={20} style={{ color: event.color }} />
                <p className="uppercase tracking-wider">
                  1st Prize:{" "}
                  <span className="font-bold text-white tracking-wider">
                    {event.winnerPrize}
                  </span>
                </p>
              </div>
            )}
            {event.runnersUpPrize && (
              <div className="flex items-center gap-2">
                <Award size={20} style={{ color: event.color }} />
                <p className="uppercase tracking-wider">
                  2nd Prize:{" "}
                  <span className="font-bold text-white tracking-wider">
                    {event.runnersUpPrize}
                  </span>
                </p>
              </div>
            )}
            {event.secondRunnersUpPrize && (
              <div className="flex items-center gap-2">
                <Award size={20} style={{ color: event.color }} />
                <p className="uppercase tracking-wider">
                  3rd Prize:{" "}
                  <span className="font-bold text-white tracking-wider">
                    {event.secondRunnersUpPrize}
                  </span>
                </p>
              </div>
            )}
            {/* AND MORE CONDITIONAL RENDERING */}
            {event.andMore && (
              <div className="flex items-center gap-2 text-sm">
                <p style={{ color: event.color }} className="font-medium">
                  Check below for more prizes
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </SwipeReveal>
  );
}

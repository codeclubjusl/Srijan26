import { clsx } from "clsx";
import Link from "next/link"; // Required for navigation

interface NotificationProps {
  title: string;
  message: string;
  date?: string; // Made optional since it's no longer being displayed
  type?: "info" | "alert" | "success";
  isNew?: boolean;
  registerLink?: string; // e.g., /register/ss3
  moreInfoLink?: string; // e.g., /events/ss3
  color?: string;        // The dynamic color from your event data
}

export default function NotificationCard({
  title,
  message,
  date,
  type = "info",
  isNew = false,
  registerLink,
  moreInfoLink,
  color = "#EBD87D", // Defaults to your original gold if no color is passed
}: NotificationProps) {
  return (
    <div
      className={clsx(
        "group relative flex flex-col gap-2 sm:gap-3 p-4 sm:p-6 rounded-lg border transition-all duration-300",
        "bg-white/5 backdrop-blur-sm hover:bg-white/10",
        "border-white/10 hover:border-white/30"
      )}
      style={{
        // Dynamically apply the left border color if it's a new notification
        borderLeft: isNew ? `4px solid ${color}` : undefined,
      }}
    >
      <div className="flex justify-between items-start flex-wrap gap-2">
        <h3 
          className="text-lg sm:text-xl md:text-2xl font-futura font-bold tracking-wide uppercase leading-snug"
          style={{ color: color }} // Dynamic Title Color
        >
          {title}
        </h3>
        {isNew && (
          <span 
            className="px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-black rounded-sm"
            style={{ backgroundColor: color }} // Dynamic Badge Color
          >
            New
          </span>
        )}
      </div>

      <p className="text-white/80 font-euclid text-sm sm:text-base leading-relaxed break-words">
        {message}
      </p>

      {/* Bottom Row: Update Text & Action Buttons */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity text-xs sm:text-sm">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          {/* Replaced {date} with "New Update" below */}
          <span className="font-euclid" style={{ color: color }}>New Update</span>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-wrap items-center gap-3">
          {moreInfoLink && (
            <Link
              href={moreInfoLink}
              className="px-4 py-1.5 text-xs sm:text-sm font-futura font-bold uppercase tracking-wider text-white border border-white/20 hover:bg-white/10 rounded-sm transition-colors"
            >
              More Info
            </Link>
          )}
          {registerLink && (
            <Link
              href={registerLink}
              className="px-4 py-1.5 text-xs sm:text-sm font-futura font-bold uppercase tracking-wider text-black rounded-sm transition-opacity hover:opacity-80"
              style={{ backgroundColor: color }} // Dynamic Button Color
            >
              Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
import SwipeReveal from "./SwipeReveal";

interface Props {
  rules: string[];
  color: string;
  className?: string;
}

export default function EventRules({ rules, color, className }: Props) {
  if (!rules || rules.length === 0) return null;

  return (
    <SwipeReveal>
      <div className={` ${className} space-y-4`}>
        <h2 className="font-elnath text-3xl uppercase border-b pb-2" style={{ color }}>
          Event Rules
        </h2>
        <ul className="space-y-3 text-white">
          {rules.map((rule, index) => {
            // This regex splits the string around anything wrapped in ** **
            const parts = rule.split(/(\*\*.*?\*\*)/g);

            return (
              <li key={index} className="flex items-start gap-3">
                <span
                  className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="leading-relaxed">
                  {parts.map((part, i) => {
                    // If the chunk starts and ends with **, render it bold
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return (
                        <strong key={i} style={{color}} className="font-euclid font-semibold">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    }
                    // Otherwise, render normal text
                    return part;
                  })}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </SwipeReveal>
  );
}
import { ReactNode } from "react";

export default function Tooltip({
  message,
  children,
}: {
  message: string;
  children: ReactNode;
}) {
  return (
    <div className="group relative flex max-w-max flex-col items-center justify-center">
      {children}
      <div className="absolute top-2 left-0 sm:left-full mr-auto ml-auto min-w-max -translate-x-full -translate-y-1/2 sm:translate-x-0 scale-0 transform rounded-lg px-3 py-2 text-sm font-medium transition-all duration-500 group-hover:scale-100">
        <div className="flex max-w-xs flex-col items-center shadow-lg">
          <div className="rounded bg-gray-800 p-2 text-center text-white">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}

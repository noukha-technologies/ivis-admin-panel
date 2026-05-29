"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "../../utils/cn";
import type { CalendarProps } from "../../interfaces/ui.interfaces";

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  bookedDates,
  ...props
}: CalendarProps) {
  // Define custom modifiers for booked dates to highlight or line-through them
  const customModifiers = {
    booked: bookedDates || [],
    ...props.modifiers,
  };

  const customModifiersClassNames = {
    booked: "line-through text-stone-500/70 hover:bg-transparent cursor-not-allowed pointer-events-none opacity-40",
    ...props.modifiersClassNames,
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-[#09090b] p-4 text-stone-50 shadow-2xl inline-block max-w-sm">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-2", className)}
        modifiers={customModifiers}
        modifiersClassNames={customModifiersClassNames}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          month_caption: "flex justify-center pt-1 relative items-center mb-2",
          caption_label: "text-sm font-semibold tracking-wide text-stone-100",
          nav: "space-x-1 flex items-center",
          button_previous: cn(
            "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 transition-opacity hover:bg-neutral-800 rounded-md border border-neutral-800 flex items-center justify-center text-stone-300 absolute left-1"
          ),
          button_next: cn(
            "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 transition-opacity hover:bg-neutral-800 rounded-md border border-neutral-800 flex items-center justify-center text-stone-300 absolute right-1"
          ),
          month_grid: "w-full border-collapse space-y-1",
          weekdays: "flex mb-2",
          weekday: "text-neutral-500 rounded-md w-9 font-normal text-[0.8rem] uppercase tracking-wider text-center",
          week: "flex w-full mt-1.5",
          day: cn(
            "h-9 w-9 p-0 font-medium transition-all hover:bg-neutral-800 hover:text-stone-50 rounded-full flex items-center justify-center cursor-pointer text-stone-300 relative text-center focus:outline-none"
          ),
          selected:
            "bg-white text-stone-900 hover:bg-white hover:text-stone-900 focus:bg-white focus:text-stone-900 rounded-full font-bold shadow-md",
          today: "bg-neutral-800/60 text-stone-100 rounded-full border border-neutral-700",
          outside:
            "outside text-neutral-600 opacity-40 aria-selected:bg-neutral-800/20 aria-selected:text-neutral-500 aria-selected:opacity-30",
          disabled: "text-neutral-600 opacity-30 cursor-not-allowed line-through",
          range_middle:
            "aria-selected:bg-neutral-800/30 aria-selected:text-stone-100",
          hidden: "invisible",
          ...classNames,
        } as any}
        components={{
          Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) => {
            if (orientation === "left") {
              return <ChevronLeft className={cn("h-4 w-4", chevronClassName)} {...chevronProps} />;
            }
            return <ChevronRight className={cn("h-4 w-4", chevronClassName)} {...chevronProps} />;
          },
        }}
        {...props}
      />
    </div>
  );
}

Calendar.displayName = "Calendar";

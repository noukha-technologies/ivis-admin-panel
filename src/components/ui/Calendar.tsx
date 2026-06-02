"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "../../utils/cn";
import type { CalendarProps } from "../../interfaces/ui.interfaces";
import "react-day-picker/style.css";

export function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    bookedDates,
    ...props
}: CalendarProps) {
    const customModifiers = {
        booked: bookedDates || [],
        ...props.modifiers,
    };

    const customModifiersClassNames = {
        booked:
            "line-through text-slate-600 hover:bg-transparent cursor-not-allowed pointer-events-none opacity-40",
        ...props.modifiersClassNames,
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-[#1c1c1e] p-4 text-white shadow-2xl inline-block max-w-sm">
            <DayPicker
                showOutsideDays={showOutsideDays}
                className={cn("p-2", className)}
                modifiers={customModifiers}
                modifiersClassNames={customModifiersClassNames}
                classNames={{
                    months:
                        "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    month_caption:
                        "flex justify-center items-center pt-1 mb-2 h-9 relative",
                    caption_label:
                        "text-sm font-semibold tracking-wide text-white",
                    nav: "absolute inset-0 flex items-center justify-between px-1 pointer-events-none",
                    button_previous: cn(
                        "h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100 transition-opacity hover:bg-white/10 rounded-full flex items-center justify-center text-white pointer-events-auto cursor-pointer"
                    ),
                    button_next: cn(
                        "h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100 transition-opacity hover:bg-white/10 rounded-full flex items-center justify-center text-white pointer-events-auto cursor-pointer"
                    ),
                    month_grid: "w-full border-collapse space-y-1",
                    weekdays: "flex mb-2",
                    weekday:
                        "text-slate-500 rounded-md w-9 font-medium text-[0.7rem] uppercase tracking-wider text-center",
                    week: "flex w-full mt-1.5",
                    day: cn(
                        "h-9 w-9 p-0 font-medium transition-all hover:bg-white/10 hover:text-white rounded-full flex items-center justify-center cursor-pointer text-slate-300 relative text-center focus:outline-none text-[13.5px]"
                    ),
                    day_button: cn(
                        "h-9 w-9 p-0 font-medium transition-all hover:bg-white/10 hover:text-white rounded-full flex items-center justify-center cursor-pointer text-slate-300 relative text-center focus:outline-none text-[13.5px]"
                    ),
                    selected:
                        "bg-white text-[#1c1c1e] hover:bg-white/90 hover:text-[#1c1c1e] focus:bg-white focus:text-[#1c1c1e] rounded-full font-bold shadow-sm",
                    today:
                        "bg-white/10 text-white rounded-full border border-white/20 font-bold",
                    outside:
                        "outside text-slate-700 opacity-30 aria-selected:bg-white/5 aria-selected:text-slate-400",
                    disabled:
                        "text-slate-700 opacity-30 cursor-not-allowed line-through",
                    range_middle:
                        "aria-selected:bg-white/10 aria-selected:text-white",
                    hidden: "invisible",
                    ...classNames,
                } as any}
                components={{
                    Chevron: ({ orientation }) => {
                        if (orientation === "left") {
                            return <ChevronLeft className="h-4 w-4 text-white" />;
                        }
                        return <ChevronRight className="h-4 w-4 text-white" />;
                    },
                }}
                {...props}
            />
        </div>
    );
}

Calendar.displayName = "Calendar";
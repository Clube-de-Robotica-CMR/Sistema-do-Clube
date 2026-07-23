import { Trash2 } from "lucide-react";

import type { Meeting } from "@/core/entities/meeting.entity";

import { formatMeetingDate } from "../utils";

interface MeetingCardProps {
    meeting: Meeting;

    onOpen(meeting: Meeting): void;

    onDelete(meeting: Meeting): void;
}

export default function MeetingCard({
    meeting,
    onOpen,
    onDelete,
}: MeetingCardProps) {
    return (
        <div className="group relative">
            <button
                onClick={() => onOpen(meeting)}
                className="
                    flex
                    w-full
                    cursor-pointer
                    flex-col
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    text-left
                    shadow-sm
                    transition-all
                    hover:-translate-y-1
                    hover:border-violet-300
                    hover:shadow-lg
                "
            >
                <span className="text-2xl font-bold text-slate-900">
                    {formatMeetingDate(meeting.date)}
                </span>

                <span className="mt-2 text-sm text-slate-500">
                    {meeting.quarter} trimestre
                </span>
            </button>

            <button
                onClick={() => onDelete(meeting)}
                className="
                    absolute
                    right-4
                    top-4
                    rounded-xl
                    p-2
                    text-slate-400
                    opacity-0
                    transition-all
                    hover:bg-red-100
                    hover:text-red-600
                    group-hover:opacity-100
                    cursor-pointer
                "
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
}
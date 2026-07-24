import { Trash2 } from "lucide-react";

import type { Competition } from "@/core/entities/competition.entity";

import { formatCompetitionDate } from "../utils";

interface CompetitionCardProps {
    competition: Competition;

    onOpen(): void;

    onDelete(): void;
}

export default function CompetitionCard({
    competition,
    onOpen,
    onDelete,
}: CompetitionCardProps) {
    return (
        <div className="relative">
            <button
                onClick={onOpen}
                className="
                    w-full
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    text-left
                    transition
                    hover:border-violet-300
                    hover:shadow-lg
                    cursor-pointer
                "
            >
                <h3 className="text-lg font-semibold">
                    {competition.name}
                </h3>

                <p className="mt-2 text-slate-500">
                    {formatCompetitionDate(
                        competition.date
                    )}
                </p>
            </button>

            <button
                onClick={onDelete}
                className="
                    absolute
                    right-4
                    top-4
                    rounded-xl
                    p-2
                    text-slate-500
                    transition
                    hover:bg-red-100
                    hover:text-red-600
                    cursor-pointer
                "
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
}
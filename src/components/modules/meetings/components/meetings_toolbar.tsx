import {
    CalendarPlus,
    SlidersHorizontal,
    Trash2,
} from "lucide-react";

import Button from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface MeetingsToolbarProps {
    role: "admin" | "diretoria";

    filtersApplied: boolean;

    onFilter(): void;

    onCreate(): void;

    onDeleteAll(): void;
}

export default function MeetingsToolbar({
    role,
    filtersApplied,
    onFilter,
    onCreate,
    onDeleteAll,
}: MeetingsToolbarProps) {
    return (
        <div className="flex items-center justify-between">
            <button
                onClick={onFilter}
                className={cn(
                    "flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border bg-white transition",
                    filtersApplied
                        ? "border-violet-500 ring-2 ring-violet-100"
                        : "border-slate-200 hover:border-violet-300 hover:bg-violet-50"
                )}
            >
                <SlidersHorizontal size={20} />
            </button>

            <div className="flex gap-3">
                {role === "admin" && (
                    <Button
                        variant="danger"
                        className="h-12 px-5 whitespace-nowrap"
                        onClick={onDeleteAll}
                    >
                        <Trash2 size={18} />
                        <span>Apagar todos</span>
                    </Button>
                )}

                <Button
                    className="h-12 px-5 whitespace-nowrap"
                    onClick={onCreate}
                >
                    <CalendarPlus size={18} />
                    <span>Novo encontro</span>
                </Button>
            </div>
        </div>
    );
}
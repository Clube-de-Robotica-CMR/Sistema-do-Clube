import { cn } from "@/lib/cn";

export function attendanceColor(
    percentage: number
) {
    if (percentage > 50) {
        return cn(
            "font-semibold",
            "text-green-600"
        );
    }

    if (percentage > 25) {
        return cn(
            "font-semibold",
            "text-yellow-600"
        );
    }

    return cn(
        "font-semibold",
        "text-red-600"
    );
}

export function gipBadgeColor(
    gip: number
) {
    if (gip > 0.5) {
        return cn(
            "bg-violet-100",
            "text-violet-700"
        );
    }

    if (gip > 0) {
        return cn(
            "bg-sky-100",
            "text-sky-700"
        );
    }

    return cn(
        "bg-slate-100",
        "text-slate-600"
    );
}

export function absenceBadge(absences: number) {
    switch (absences) {
        case 0:
            return "bg-sky-100 text-sky-700";

        case 1:
            return "bg-sky-300 text-slate-700";

        case 2:
            return "bg-emerald-100 text-emerald-700";

        case 3:
            return "bg-yellow-100 text-yellow-700";

        case 4:
            return "bg-orange-100 text-orange-700";

        default:
            return "bg-red-100 text-red-700";
    }
}
import { cn } from "@/lib/cn";
import type { BonusRow } from "../types";

import {
    attendanceColor,
    absenceBadge,
    gipBadgeColor,
} from "../utils";

interface BonusRowProps {
    row: BonusRow;
}

export default function BonusRow({
    row,
}: BonusRowProps) {
    return (
        <tr className="border-b transition-colors hover:bg-slate-50">
            <td className="px-6 py-4">
                {row.number}
            </td>

            <td className="px-6 py-4 font-medium">
                {row.war_name}
            </td>

            <td className="px-6 py-4 text-center">
                {row.class}
            </td>

            <td className="px-6 py-4 text-center">
                <span className={attendanceColor(
                    row.attendance_percentage
                )}
                >
                    {row.attendance_percentage}%
                </span>
            </td>

            <td className="px-6 py-4 text-center">
                <span
                    className={gipBadgeColor(
                        row.grade_bonus
                    )}
                >
                    +{row.grade_bonus.toFixed(1)}
                </span>
            </td>

            <td className="px-6 py-4 text-center">
                <span
                    className={cn(
                        "inline-flex rounded-full px-3 py-1 text-sm font-semibold",
                        absenceBadge(row.unjustified_absences_in_year)
                    )}
                >
                    {row.unjustified_absences_in_year} / 5
                </span>
            </td>
        </tr>
    );
}
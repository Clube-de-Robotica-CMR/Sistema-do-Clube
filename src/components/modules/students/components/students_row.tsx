import { Eye, Pencil, Trash2 } from "lucide-react";

import type { Member } from "@/core/entities/member.entity";

interface StudentsRowProps {
    member: Member;

    onView(member: Member): void;

    onEdit(member: Member): void;

    onDelete(member: Member): void;
}

export default function StudentsRow({
    member,
    onView,
    onEdit,
    onDelete,
}: StudentsRowProps) {
    return (
        <tr className="border-b transition-colors hover:bg-violet-50/40">
            <td className="px-6 py-4 font-medium">
                {member.war_name}
            </td>

            <td className="px-6 py-4">
                {member.number}
            </td>

            <td className="px-6 py-4">
                {member.class}
            </td>

            <td className="px-6 py-4">
                {member.field}
            </td>

            <td className="px-6 py-4">
                {member.level}
            </td>

            <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => onView(member)}
                        className="
                rounded-xl
                p-2
                text-slate-500
                transition
                hover:bg-sky-100
                hover:text-sky-700
                cursor-pointer
            "
                    >
                        <Eye size={18} />
                    </button>

                    <button
                        onClick={() => onEdit(member)}
                        className="
                rounded-xl
                p-2
                text-slate-500
                transition
                hover:bg-violet-100
                hover:text-violet-700
                cursor-pointer
            "
                    >
                        <Pencil size={18} />
                    </button>

                    <button
                        onClick={() => onDelete(member)}
                        className="
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
            </td>
        </tr>
    );
}
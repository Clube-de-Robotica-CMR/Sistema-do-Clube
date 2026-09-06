import {
    Eye,
    Pencil,
    Trash2,
    UsersRound,
} from "lucide-react";

import Card from "@/components/ui/card";

import type {
    GroupWithMembers,
} from "@/core/entities/member.entity";

interface GroupCardProps {
    group: GroupWithMembers;

    onView(group: GroupWithMembers): void;
    onEdit(group: GroupWithMembers): void;
    onDelete(group: GroupWithMembers): void;
}

export default function GroupCard({
    group,
    onView,
    onEdit,
    onDelete,
}: GroupCardProps) {
    return (
        <Card className="group relative overflow-hidden p-6 transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                    <UsersRound size={24} />
                </div>

                <div className="flex gap-1">
                    <button
                        onClick={() => onView(group)}
                        className="cursor-pointer rounded-xl p-2 text-slate-500 transition hover:bg-sky-100 hover:text-sky-700"
                    >
                        <Eye size={18} />
                    </button>

                    <button
                        onClick={() => onEdit(group)}
                        className="cursor-pointer rounded-xl p-2 text-slate-500 transition hover:bg-violet-100 hover:text-violet-700"
                    >
                        <Pencil size={18} />
                    </button>

                    <button
                        onClick={() => onDelete(group)}
                        className="cursor-pointer rounded-xl p-2 text-slate-500 transition hover:bg-red-100 hover:text-red-600"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900">
                {group.name}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
                {group.members.length}{" "}
                {group.members.length === 1
                    ? "membro"
                    : "membros"}
            </p>
        </Card>
    );
}
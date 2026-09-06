import Dialog from "@/components/ui/dialog";
import Card from "@/components/ui/card";

import type {
    GroupWithMembers,
} from "@/core/entities/member.entity";

interface GroupDetailsDialogProps {
    open: boolean;
    group: GroupWithMembers | null;

    onClose(): void;
}

export default function GroupDetailsDialog({
    open,
    group,
    onClose,
}: GroupDetailsDialogProps) {
    if (!group) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
        >
            <Card className="rounded-3xl p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold">
                        {group.name}
                    </h2>

                    <p className="mt-2 text-slate-500">
                        {group.members.length}{" "}
                        {group.members.length === 1
                            ? "membro"
                            : "membros"}
                    </p>
                </div>

                {group.members.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 py-14 text-center text-slate-500">
                        Este grupo ainda não possui membros.
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <table className="w-full">
                            <thead className="border-b bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                        Número
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                        Nome
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                        Área
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                        Nível
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {group.members.map((member) => (
                                    <tr
                                        key={member.id}
                                        className="border-b last:border-none"
                                    >
                                        <td className="px-6 py-4">
                                            {member.number}
                                        </td>

                                        <td className="px-6 py-4 font-medium">
                                            {member.war_name}
                                        </td>

                                        <td className="px-6 py-4">
                                            {member.field}
                                        </td>

                                        <td className="px-6 py-4">
                                            {member.level}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </Dialog>
    );
}
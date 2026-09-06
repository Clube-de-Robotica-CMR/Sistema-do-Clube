import Card from "@/components/ui/card";

import type {
    GroupWithMembers,
    Member,
} from "@/core/entities/member.entity";

import StudentsRow from "./students_row";

interface StudentsTableProps {
    members: Member[];
    groups: GroupWithMembers[];

    onView(member: Member): void;
    onEdit(member: Member): void;
    onDelete(member: Member): void;
}

export default function StudentsTable({
    members,
    groups,
    onView,
    onEdit,
    onDelete,
}: StudentsTableProps) {
    const groupNames = new Map(
        groups.map((group) => [
            group.id,
            group.name,
        ])
    );

    return (
        <Card className="overflow-hidden">
            <table className="w-full">
                <thead className="border-b bg-slate-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                            Nome de Guerra
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                            Número
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                            Turma
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                            Área
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                            Nível
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                            Grupo
                        </th>

                        <th className="w-32 px-6 py-4" />
                    </tr>
                </thead>

                <tbody>
                    {members.map((member) => (
                        <StudentsRow
                            key={member.id}
                            member={member}
                            groupName={
                                member.group_id
                                    ? groupNames.get(
                                        member.group_id
                                    )
                                    : undefined
                            }
                            onView={onView}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </Card>
    );
}
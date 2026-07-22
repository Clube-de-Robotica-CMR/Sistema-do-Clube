import Card from "@/components/ui/card";

import { Member } from "@/core/entities/member.entity";

import StudentsRow from "./students_row";

interface StudentsTableProps {
    members: Member[];

    onView(member: Member): void;

    onEdit(member: Member): void;

    onDelete(member: Member): void;
}

export default function StudentsTable({
    members,
    onView,
    onEdit,
    onDelete,
}: StudentsTableProps) {
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

                        <th className="w-32 px-6 py-4" />
                    </tr>
                </thead>

                <tbody>
                    {members.map((member) => (
                        <StudentsRow
                            key={member.id}
                            member={member}
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
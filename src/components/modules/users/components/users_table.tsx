import Card from "@/components/ui/card";

import type { User } from "@/core/entities/user.entity";

import UserRow from "./user_row";

interface UsersTableProps {
    users: User[];

    onEdit(user: User): void;

    onDelete(user: User): void;
}

export default function UsersTable({
    users,
    onEdit,
    onDelete,
}: UsersTableProps) {
    return (
        <Card className="overflow-hidden">
            <table className="w-full">
                <thead className="border-b bg-slate-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                            Nome
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                            Cargo
                        </th>

                        <th className="w-32 px-6 py-4" />
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <UserRow
                            key={user.id}
                            user={user}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </Card>
    );
}
import { useEffect, useState } from "react";

import type { User } from "@/core/entities/user.entity";

import { deleteUser, findUsers } from "./services";

import UsersToolbar from "./components/users_toolbar";
import UsersTable from "./components/users_table";
import UsersLoading from "./components/users_loading";
import UsersEmpty from "./components/users_empty";
import UserFormDialog from "./components/user_form_dialog";
import ConfirmDialog from "@/components/ui/confirm_dialog";

export default function UsersModule() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [createOpen, setCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    async function loadUsers() {
        try {
            setLoading(true);
            const data = await findUsers();
            setUsers(data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    function handleEdit(user: User) {
        setEditingUser(user);
    }

    function handleDelete(user: User) {
        setDeletingUser(user);
    }

    async function confirmDelete() {
        if (!deletingUser) return;

        await deleteUser(deletingUser.id);
        setDeletingUser(null);
        loadUsers();
    }

    return (
        <>
            <div className="flex h-full flex-col gap-6">
                <header>
                    <h1 className="text-3xl font-bold">Usuários</h1>

                    <p className="mt-2 text-slate-500">
                        Gerencie os usuários do sistema.
                    </p>
                </header>

                <UsersToolbar onCreate={() => setCreateOpen(true)} />

                <div className="flex-1">
                    {loading ? (
                        <UsersLoading />
                    ) : users.length === 0 ? (
                        <UsersEmpty />
                    ) : (
                        <UsersTable
                            users={users}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>

            <UserFormDialog
                open={createOpen}
                mode="create"
                onClose={() => setCreateOpen(false)}
                onSaved={() => {
                    setCreateOpen(false);
                    loadUsers();
                }}
            />

            <UserFormDialog
                open={editingUser !== null}
                mode="edit"
                user={editingUser ?? undefined}
                onClose={() => setEditingUser(null)}
                onSaved={() => {
                    setEditingUser(null);
                    loadUsers();
                }}
            />

            <ConfirmDialog
                open={deletingUser !== null}
                variant="danger"
                title="Remover usuário?"
                description="Esta ação não poderá ser desfeita."
                confirmText="Remover"
                cancelText="Cancelar"
                onClose={() => setDeletingUser(null)}
                onConfirm={confirmDelete}
            />
        </>
    );
}
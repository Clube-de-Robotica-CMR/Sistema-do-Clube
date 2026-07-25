import { useState } from "react";

import type {
    User,
    UpdateUserDTO,
} from "@/core/entities/user.entity";

import Dialog from "@/components/ui/dialog";
import Card from "@/components/ui/card";

import UserForm from "./user_form";

import { updateUser } from "../services";

interface EditUserDialogProps {
    open: boolean;

    user: User;

    onClose(): void;

    onUpdated(): void;
}

export default function EditUserDialog({
    open,
    user,
    onClose,
    onUpdated,
}: EditUserDialogProps) {
    const [loading, setLoading] = useState(false);

    async function handleUpdate(data: UpdateUserDTO) {
        try {
            setLoading(true);

            await updateUser(data);

            onClose();
            onUpdated();
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md">
            <Card className="rounded-3xl p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold">
                        Editar usuário
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Atualize as informações do usuário.
                    </p>
                </div>

                <UserForm
                    key={user.id}
                    mode="edit"
                    initialValues={user}
                    loading={loading}
                    submitText="Salvar alterações"
                    onSubmit={handleUpdate}
                />
            </Card>
        </Dialog>
    );
}
import { useState } from "react";

import Dialog from "@/components/ui/dialog";
import Card from "@/components/ui/card";

import UserForm from "./user_form";

import { createUser } from "../services";

import type {
    CreateUserDTO,
} from "@/core/entities/user.entity";

interface CreateUserDialogProps {
    open: boolean;

    onClose(): void;

    onCreated(): void;
}

export default function CreateUserDialog({
    open,
    onClose,
    onCreated,
}: CreateUserDialogProps) {
    const [loading, setLoading] =
        useState(false);

    async function handleCreate(
        data: CreateUserDTO
    ) {
        try {
            setLoading(true);

            await createUser(data);

            onClose();
            onCreated();
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
        >
            <Card className="rounded-3xl p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold">
                        Novo usuário
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Cadastre um novo usuário da
                        diretoria.
                    </p>
                </div>

                <UserForm
                    mode="create"
                    loading={loading}
                    submitText="Criar usuário"
                    onSubmit={handleCreate}
                />
            </Card>
        </Dialog>
    );
}
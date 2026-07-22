import { useState } from "react";

import ConfirmDialog from "@/components/ui/confirm_dialog";

import type { Member } from "@/core/entities/member.entity";

import { deleteMember } from "../services";

interface DeleteStudentDialogProps {
    open: boolean;

    member: Member | null;

    onClose(): void;

    onDeleted(): void;
}

export default function DeleteStudentDialog({
    open,
    member,
    onClose,
    onDeleted,
}: DeleteStudentDialogProps) {
    const [loading, setLoading] =
        useState(false);

    async function handleDelete() {
        if (!member) return;

        try {
            setLoading(true);

            await deleteMember(member.id);

            onDeleted();

            onClose();
        } finally {
            setLoading(false);
        }
    }

    return (
        <ConfirmDialog
            open={open}
            variant="danger"
            title="Excluir aluno?"
            description={
                member
                    ? `O aluno "${member.war_name}" será removido permanentemente do sistema. Esta ação não poderá ser desfeita.`
                    : ""
            }
            confirmText="Excluir"
            cancelText="Cancelar"
            loading={loading}
            onConfirm={handleDelete}
            onClose={onClose}
        />
    );
}
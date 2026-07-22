import { useEffect, useState } from "react";

import Card from "@/components/ui/card";
import Dialog from "@/components/ui/dialog";

import StudentForm from "./student_form";

import { updateMember } from "../services";

import type {
    Member,
    UpdateMemberDTO,
    CreateMemberDTO,
} from "@/core/entities/member.entity";

interface EditStudentDialogProps {
    open: boolean;

    member: Member | null;

    onClose(): void;

    onUpdated(): void;
}

export default function EditStudentDialog({
    open,
    member,
    onClose,
    onUpdated,
}: EditStudentDialogProps) {
    const [loading, setLoading] =
        useState(false);

    useEffect(() => {
        if (!open) {
            setLoading(false);
        }
    }, [open]);

    async function handleSubmit(
        data: CreateMemberDTO
    ) {
        if (!member) return;

        try {
            setLoading(true);

            const payload: UpdateMemberDTO = {
                id: member.id,
                ...data,
            };

            await updateMember(payload);

            onUpdated();

            onClose();
        } finally {
            setLoading(false);
        }
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
                        Editar aluno
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Atualize as informações do
                        membro do Clube de Robótica.
                    </p>
                </div>

                <StudentForm
                    initialData={member ?? undefined}
                    loading={loading}
                    submitText="Salvar alterações"
                    onSubmit={handleSubmit}
                />
            </Card>
        </Dialog>
    );
}
import { useState } from "react";

import Card from "@/components/ui/card";
import Dialog from "@/components/ui/dialog";

import StudentForm from "./student_form";

import { createMember } from "../services";

import type { CreateMemberDTO } from "@/core/entities/member.entity";

interface CreateStudentDialogProps {
    open: boolean;

    onClose(): void;

    onCreated(): void;
}

export default function CreateStudentDialog({
    open,
    onClose,
    onCreated,
}: CreateStudentDialogProps) {
    const [loading, setLoading] =
        useState(false);

    async function handleSubmit(
        data: CreateMemberDTO
    ) {
        try {
            setLoading(true);

            await createMember(data);

            onCreated();

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
                        Novo aluno
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Cadastre um novo membro do
                        Clube de Robótica.
                    </p>
                </div>

                <StudentForm
                    loading={loading}
                    submitText="Cadastrar"
                    onSubmit={handleSubmit}
                />
            </Card>
        </Dialog>
    );
}
import Card from "@/components/ui/card";
import Dialog from "@/components/ui/dialog";

import type { Member } from "@/core/entities/member.entity";

interface StudentDetailsDialogProps {
    open: boolean;

    member: Member | null;

    onClose(): void;
}

function Field({
    label,
    value,
}: {
    label: string;
    value?: string;
}) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">
                {label}
            </p>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                {value || "-"}
            </div>
        </div>
    );
}

export default function StudentDetailsDialog({
    open,
    member,
    onClose,
}: StudentDetailsDialogProps) {
    if (!member) {
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
                        {member.war_name}
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Informações completas do aluno.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <Field
                        label="Nome de guerra"
                        value={member.war_name}
                    />

                    <Field
                        label="Nome completo"
                        value={member.full_name}
                    />

                    <Field
                        label="Número"
                        value={member.number}
                    />

                    <Field
                        label="Turma"
                        value={member.class}
                    />

                    <Field
                        label="Telefone"
                        value={member.phone}
                    />

                    <Field
                        label="Área"
                        value={member.field}
                    />

                    <Field
                        label="Nível"
                        value={member.level}
                    />

                    <Field
                        label="Diretoria"
                        value={
                            member.is_director
                                ? "Sim"
                                : "Não"
                        }
                    />

                    <Field
                        label="Criado em"
                        value={new Date(
                            member.created_at
                        ).toLocaleString("pt-BR")}
                    />

                    <Field
                        label="Última atualização"
                        value={new Date(
                            member.updated_at
                        ).toLocaleString("pt-BR")}
                    />
                </div>
            </Card>
        </Dialog>
    );
}
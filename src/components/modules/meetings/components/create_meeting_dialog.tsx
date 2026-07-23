import { useEffect, useState } from "react";

import type {
    AttendanceStatus,
    CreateMeetingDTO,
    RegisterAttendanceDTO,
} from "@/core/entities/meeting.entity";

import type { Member } from "@/core/entities/member.entity";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Dialog from "@/components/ui/dialog";

import AttendanceEditor from "./attendance_editor";

import { findMembers } from "@/components/modules/students/services";

import {
    createMeeting,
    registerAttendances,
} from "../services";
import { FieldErrors, ValidationError } from "@/lib/validation_error";

interface AttendanceItem {
    member_id: string;
    status: AttendanceStatus;
}

interface CreateMeetingDialogProps {
    open: boolean;
    onClose(): void;
    onCreated(): void;
}

export default function CreateMeetingDialog({
    open,
    onClose,
    onCreated,
}: CreateMeetingDialogProps) {
    const [errors, setErrors] = useState<FieldErrors>({});
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const [members, setMembers] = useState<Member[]>([]);

    // Estados do formulário
    const [date, setDate] = useState("");
    const [quarter, setQuarter] = useState<"1°" | "2°" | "3°">("1°");
    const [attendances, setAttendances] = useState<AttendanceItem[]>([]);

    // Resetar o formulário e carregar dados de forma segura ao abrir
    useEffect(() => {
        if (!open) {
            // Limpa tudo ao fechar para evitar vazamento de estado
            setDate("");
            setQuarter("1°");
            setAttendances([]);
            setErrors({});
            setLoadError(false);
            return;
        }

        async function load() {
            try {
                setLoading(true);
                setLoadError(false);
                const fetchedMembers = await findMembers();

                setMembers(fetchedMembers);
                setAttendances(
                    fetchedMembers.map((member) => ({
                        member_id: member.id,
                        status: "Falta",
                    }))
                );
            } catch (err) {
                console.error("Erro ao carregar membros:", err);
                setLoadError(true);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [open]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        try {
            setLoading(true);
            setErrors({});

            // Correção de fuso horário: adiciona o horário local para evitar que retroceda 1 dia
            const parsedDate = new Date(`${date}T00:00:00`);

            const meeting = await createMeeting({
                date: parsedDate,
                quarter,
            } satisfies CreateMeetingDTO);

            await registerAttendances({
                meeting_id: meeting.id,
                attendances,
            } satisfies RegisterAttendanceDTO);

            onCreated();
            onClose();
        } catch (error) {
            if (error instanceof ValidationError) {
                setErrors(error.details.fieldErrors);
                return;
            }
            // Evita travar a aplicação se for um erro genérico
            alert("Ocorreu um erro inesperado ao salvar o encontro.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg">
            <Card className="rounded-3xl p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold">Novo encontro</h2>
                    <p className="mt-2 text-slate-500">
                        Crie um encontro e registre as presenças iniciais.
                    </p>
                </div>

                {loadError ? (
                    <div className="text-center py-6">
                        <p className="text-red-500 font-medium mb-3">Erro ao carregar lista de membros.</p>
                        <Button type="button" onClick={() => onClose()}>Fechar</Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-medium">Data</span>
                                <input
                                    required
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className={`h-12 w-full rounded-xl border px-4 transition focus:outline-none focus:border-violet-500 ${errors.date ? "border-red-500 bg-red-50/30" : "border-slate-200"
                                        }`}
                                />
                                {errors.date && (
                                    <span className="text-xs font-medium text-red-500">
                                        {errors.date[0]}
                                    </span>
                                )}
                            </label>

                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-medium">Trimestre</span>
                                <select
                                    value={quarter}
                                    onChange={(e) => setQuarter(e.target.value as "1°" | "2°" | "3°")}
                                    className={`h-12 w-full rounded-xl border px-4 transition focus:outline-none focus:border-violet-500 ${errors.quarter ? "border-red-500 bg-red-50/30" : "border-slate-200"
                                        }`}
                                >
                                    <option value="1°">1°</option>
                                    <option value="2°">2°</option>
                                    <option value="3°">3°</option>
                                </select>
                                {errors.quarter && (
                                    <span className="text-xs font-medium text-red-500">
                                        {errors.quarter[0]}
                                    </span>
                                )}
                            </label>
                        </div>

                        <div>
                            <h3 className="mb-4 text-lg font-semibold">Presenças</h3>
                            {loading && members.length === 0 ? (
                                <p className="text-sm text-slate-400 animate-pulse">Carregando lista de chamada...</p>
                            ) : (
                                <AttendanceEditor
                                    members={members}
                                    attendances={attendances}
                                    onChange={setAttendances}
                                />
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" loading={loading} disabled={loading}>
                                Criar encontro
                            </Button>
                        </div>
                    </form>
                )}
            </Card>
        </Dialog>
    );
}

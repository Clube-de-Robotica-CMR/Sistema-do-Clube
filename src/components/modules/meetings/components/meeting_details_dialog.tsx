import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import type {
    Attendance,
    AttendanceStatus,
    Meeting,
    Quarter,
    RegisterAttendanceDTO,
} from "@/core/entities/meeting.entity";

import type { Member } from "@/core/entities/member.entity";

import Dialog from "@/components/ui/dialog";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

import AttendanceEditor from "./attendance_editor";

import { findMembers } from "@/components/modules/students/services";

import {
    deleteMeeting,
    findAttendances,
    registerAttendances,
    updateMeeting,
} from "../services";

import { formatMeetingDate } from "../utils";
import ConfirmDialog from "@/components/ui/confirm_dialog";
import { FieldErrors, ValidationError } from "@/lib/validation_error";
import Input from "@/components/ui/input";
import { cn } from "@/lib/cn";

interface AttendanceItem {
    member_id: string;
    status: AttendanceStatus;
}

interface MeetingDetailsDialogProps {
    meeting: Meeting | null;

    open: boolean;

    onClose(): void;

    onUpdated(): void;
}

export default function MeetingDetailsDialog({
    meeting,
    open,
    onClose,
    onUpdated,
}: MeetingDetailsDialogProps) {
    const [errors, setErrors] =
        useState<FieldErrors>({});

    const [loading, setLoading] =
        useState(false);

    const [editing, setEditing] =
        useState(false);

    const [members, setMembers] =
        useState<Member[]>([]);

    const [attendances, setAttendances] =
        useState<AttendanceItem[]>([]);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [date, setDate] = useState("");

    const [quarter, setQuarter] =
        useState<Quarter>("1°");

    useEffect(() => {
        if (!open || !meeting) return;

        async function load() {
            setErrors({});

            const [
                members,
                attendances,
            ] = await Promise.all([
                findMembers(),
                findAttendances(meeting!.id),
            ]);

            setDate(
                new Date(meeting!.date)
                    .toISOString()
                    .split("T")[0]
            );

            setQuarter(meeting!.quarter);

            setMembers(members);

            setAttendances(
                attendances.map(
                    (
                        attendance: Attendance
                    ) => ({
                        member_id:
                            attendance.member_id,
                        status:
                            attendance.status,
                    })
                )
            );

            setEditing(false);
        }

        load();
    }, [open, meeting]);

    function attendanceBadge(status?: AttendanceStatus) {
        switch (status) {
            case "Presente":
                return "bg-green-100 text-green-700";

            case "Falta Justificada":
                return "bg-yellow-100 text-yellow-700";

            case "Falta":
                return "bg-red-100 text-red-700";

            default:
                return "bg-slate-100 text-slate-600";
        }
    }

    async function handleSave() {
        if (!meeting) return;

        try {
            setLoading(true);

            setErrors({});

            await updateMeeting({
                ...meeting,
                date: new Date(date),
                quarter,
            });

            await registerAttendances({
                meeting_id: meeting.id,
                attendances,
            });

            setEditing(false);

            onUpdated();
        } catch (error) {
            if (error instanceof ValidationError) {
                setErrors(error.details.fieldErrors);

                return;
            }

            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!meeting) return;

        try {
            setLoading(true);

            await deleteMeeting(meeting.id);

            setDeleteOpen(false);

            onClose();

            onUpdated();
        } finally {
            setLoading(false);
        }
    }

    if (!meeting) {
        return null;
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="lg"
            >
                <Card className="rounded-3xl p-8">
                    <div className="mb-8 flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">
                                {formatMeetingDate(
                                    meeting.date
                                )}
                            </h2>

                            <p className="mt-2 text-slate-500">
                                {meeting.quarter} trimestre
                            </p>
                        </div>

                        <div className="mb-8 flex items-start justify-between gap-8">
                            <div className="flex-1">
                                {editing ? (
                                    <div className="space-y-4">
                                        <Input
                                            label="Data"
                                            type="date"
                                            value={date}
                                            error={errors.date?.[0]}
                                            onChange={(e) =>
                                                setDate(e.target.value)
                                            }
                                        />

                                        <label className="space-y-2 block">
                                            <span className="text-sm font-medium">
                                                Trimestre
                                            </span>

                                            <select
                                                value={quarter}
                                                onChange={(e) =>
                                                    setQuarter(
                                                        e.target
                                                            .value as Quarter
                                                    )
                                                }
                                                className="h-12 w-full rounded-xl border border-slate-300 px-4 focus:border-violet-600 focus:ring-4 focus:ring-violet-100"
                                            >
                                                <option value="1°">
                                                    1°
                                                </option>

                                                <option value="2°">
                                                    2°
                                                </option>

                                                <option value="3°">
                                                    3°
                                                </option>
                                            </select>
                                        </label>
                                    </div>
                                ) : (<></>)}
                            </div>

                            {!editing ? (
                                <div className="flex gap-3">
                                    <Button
                                        variant="secondary"
                                        className="h-10 w-10 p-0 flex items-center justify-center rounded-xl" // Altera para quadrado perfeito
                                        onClick={() => setEditing(true)}
                                    >
                                        <Pencil size={18} />
                                    </Button>

                                    <Button
                                        variant="danger"
                                        className="h-10 w-10 p-0 flex items-center justify-center rounded-xl" // Altera para quadrado perfeito
                                        onClick={() => setDeleteOpen(true)}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>

                            ) : (
                                <div className="flex gap-3">
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setEditing(false);

                                            setErrors({});
                                        }}
                                    >
                                        Cancelar
                                    </Button>

                                    <Button
                                        loading={loading}
                                        onClick={handleSave}
                                    >
                                        Salvar alterações
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {editing ? (
                        <AttendanceEditor
                            members={members}
                            attendances={
                                attendances
                            }
                            onChange={
                                setAttendances
                            }
                        />
                    ) : (
                        <div className="max-h-[40vh] space-y-3 overflow-y-auto pr-2">
                            {members.map((member) => {
                                const attendance =
                                    attendances.find(
                                        (attendance) =>
                                            attendance.member_id ===
                                            member.id
                                    );

                                console.log(attendance)

                                return (
                                    <div
                                        key={member.id}
                                        className="
                    flex
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    border-slate-200
                    p-4
                "
                                    >
                                        <div>
                                            <p className="font-semibold">
                                                {member.war_name}
                                            </p>

                                            <p className="text-sm text-slate-500">
                                                {member.number}
                                            </p>
                                        </div>

                                        <span
                                            className={cn(
                                                "rounded-full px-4 py-2 text-sm font-medium",
                                                attendanceBadge(
                                                    attendance?.status
                                                )
                                            )}
                                        >
                                            {attendance?.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>
            </Dialog>

            <ConfirmDialog
                open={deleteOpen}
                loading={loading}
                variant="danger"
                title="Excluir encontro?"
                description={`O encontro do dia ${formatMeetingDate(meeting.date)} será removido permanentemente.`}
                confirmText="Excluir"
                cancelText="Cancelar"
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />
        </>
    );
}
import type {
    AttendanceStatus,
} from "@/core/entities/meeting.entity";

import type { Member } from "@/core/entities/member.entity";

interface AttendanceItem {
    member_id: string;
    status: AttendanceStatus;
}

interface AttendanceEditorProps {
    members: Member[];

    attendances: AttendanceItem[];

    onChange(
        attendances: AttendanceItem[]
    ): void;
}

const statuses: AttendanceStatus[] = [
    "Presente",
    "Falta Justificada",
    "Falta",
];

export default function AttendanceEditor({
    members,
    attendances,
    onChange,
}: AttendanceEditorProps) {
    function handleStatusChange(
        memberId: string,
        status: AttendanceStatus
    ) {
        // 1. Verifica se já existe uma chamada criada para esse membro
        const exists = attendances.some((a) => a.member_id === memberId);

        if (!exists) {
            // 2. Se não existir, adiciona o novo status ao final da lista
            onChange([...attendances, { member_id: memberId, status }]);
        } else {
            // 3. Se já existir, atualiza como você já estava fazendo
            onChange(
                attendances.map((attendance) =>
                    attendance.member_id === memberId
                        ? { ...attendance, status }
                        : attendance
                )
            );
        }
    }


    return (
        <div className="space-y-3">
            {members.map((member) => {
                const attendance =
                    attendances.find(
                        (attendance) =>
                            attendance.member_id ===
                            member.id
                    );

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
                            <p className="text-sm text-slate-500">
                                {member.number}
                            </p>
                            <p className="font-medium">
                                {member.war_name}
                            </p>

                        </div>

                        <select
                            value={
                                attendance?.status ??
                                "Falta"
                            }
                            onChange={(event) =>
                                handleStatusChange(
                                    member.id,
                                    event.target
                                        .value as AttendanceStatus
                                )
                            }
                            className="
                                h-11
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                transition
                                focus:border-violet-500
                                focus:outline-none
                            "
                        >
                            {statuses.map((status) => (
                                <option
                                    key={status}
                                    value={status}
                                >
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            })}
        </div>
    );
}
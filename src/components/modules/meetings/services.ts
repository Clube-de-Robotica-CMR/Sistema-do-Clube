import type {
    Attendance,
    CreateMeetingDTO,
    FindMeetingsFilter,
    Meeting,
    RegisterAttendanceDTO,
} from "@/core/entities/meeting.entity";

import { rpcClient } from "@/services/api";

export async function findMeetings(
    filters: Partial<FindMeetingsFilter>
): Promise<Meeting[]> {
    return rpcClient(
        "meetings",
        "read",
        filters
    );
}

export async function createMeeting(
    data: CreateMeetingDTO
): Promise<Meeting> {
    return rpcClient(
        "meetings",
        "create",
        data
    );
}

export async function updateMeeting(
    data: Meeting
): Promise<void> {
    return rpcClient(
        "meetings",
        "update",
        data
    );
}

export async function deleteMeeting(
    id: string
): Promise<void> {
    await rpcClient(
        "meetings",
        "delete",
        { id }
    );
}

export async function deleteAllMeetings(): Promise<void> {
    await rpcClient(
        "meetings",
        "delete_all"
    );
}

export async function findAttendances(
    meetingId: string
): Promise<Attendance[]> {
    return rpcClient(
        "meetings",
        "find_attendances",
        {
            meeting_id: meetingId,
        }
    );
}

export async function registerAttendances(
    data: RegisterAttendanceDTO
): Promise<void> {
    await rpcClient(
        "meetings",
        "save_attendances",
        data
    );
}
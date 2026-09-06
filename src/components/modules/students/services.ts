import { rpcClient } from "@/services/api";

import type {
    Member,
    CreateMemberDTO,
    UpdateMemberDTO,
    FindMembersFilter,
    GroupWithMembers,
} from "@/core/entities/member.entity";

export async function findMembers(
    filters: FindMembersFilter = {}
): Promise<Member[]> {
    return rpcClient<Member[]>(
        "members",
        "read",
        filters
    );
}

export async function findGroups():
    Promise<GroupWithMembers[]> {
    return rpcClient<GroupWithMembers[]>(
        "members",
        "read_groups"
    );
}

export async function createMember(
    data: CreateMemberDTO
): Promise<Member> {
    return rpcClient<Member>(
        "members",
        "create",
        data
    );
}

export async function updateMember(
    data: UpdateMemberDTO
): Promise<Member> {
    return rpcClient<Member>(
        "members",
        "update",
        data
    );
}

export async function deleteMember(
    id: string
): Promise<void> {
    await rpcClient(
        "members",
        "delete",
        { id }
    );
}

export async function deleteAllMembers():
    Promise<void> {
    await rpcClient(
        "members",
        "delete_all"
    );
}
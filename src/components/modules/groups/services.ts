import { rpcClient } from "@/services/api";

import type {
    CreateGroupDTO,
    GroupWithMembers,
    UpdateGroupDTO,
} from "@/core/entities/member.entity";

export async function findGroups():
Promise<GroupWithMembers[]> {
    return rpcClient<GroupWithMembers[]>(
        "members",
        "read_groups"
    );
}

export async function createGroup(
    data: CreateGroupDTO
): Promise<void> {
    await rpcClient(
        "members",
        "create_group",
        data
    );
}

export async function updateGroup(
    data: UpdateGroupDTO
): Promise<void> {
    await rpcClient(
        "members",
        "update_group",
        data
    );
}

export async function deleteGroup(
    id: string
): Promise<void> {
    await rpcClient(
        "members",
        "delete_group",
        { id }
    );
}
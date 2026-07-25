import type {
    User,
    CreateUserDTO,
    UpdateUserDTO,
} from "@/core/entities/user.entity";

import { rpcClient } from "@/services/api";

export async function findUsers() {
    return rpcClient<User[]>(
        "users",
        "read"
    );
}

export async function createUser(
    data: CreateUserDTO
) {
    return rpcClient<string>(
        "users",
        "create",
        data
    );
}

export async function updateUser(
    data: UpdateUserDTO
) {
    return rpcClient<string>(
        "users",
        "update",
        data
    );
}

export async function deleteUser(
    id: string
) {
    return rpcClient<string>(
        "users",
        "delete",
        { id }
    );
}
import { CreateUserDTO, User } from "@/core/entities/user.entity";
import { DBError } from "@/core/errors/db-error";
import { UsersRepository } from "@/core/ports/users/users_repository";
import { db } from "@/infra/db/drizzle/client";
import { users_table } from "@/infra/db/schemas/users.schema";
import { eq } from "drizzle-orm";

export class DrizzleUsersRepository implements UsersRepository {
    private map_to_domain(dbUser: any): User {
        return {
            id: dbUser.id,
            name: dbUser.name,
            password: dbUser.password,
            role: dbUser.role as "admin" | "diretoria",
            created_at: dbUser.created_at,
            updated_at: dbUser.updated_at,
        };
    }

    async get_all(): Promise<User[] | undefined> {
        const result = await db.select().from(users_table)
        if (!result[0]) return undefined
        return result.map((user) => this.map_to_domain(user))
    }

    async get_by_name(name: string): Promise<User | undefined> {
        const result = await db
            .select()
            .from(users_table)
            .where(eq(users_table.name, name));

        if (!result[0]) return undefined
        return this.map_to_domain(result[0])
    }

    async get_by_id(id: string): Promise<User | undefined> 
    {
        const result = await db
            .select()
            .from(users_table)
            .where(eq(users_table.id, id));

        if (!result[0]) return undefined
        return this.map_to_domain(result[0])
    }

    async save(user: CreateUserDTO): Promise<undefined> {
        const result = await db
            .insert(users_table)
            .values(user)
            .returning();

        if (!result[0]) throw new DBError("Erro na criação de usuário")
    }

    async update(user: User): Promise<undefined> {
        const result = await db
            .update(users_table)
            .set(user)
            .where(eq(users_table.id, user.id))
            .returning();

        if (!result[0]) throw new DBError("Erro ao tentar atualizar o usuário")
    }

    async delete(id: string): Promise<undefined> {
        const result = await db
            .delete(users_table)
            .where(eq(users_table.id, id))
            .returning();

        if (!result[0]) throw new DBError("Erro ao tentar deletar o usuário")
    }
}
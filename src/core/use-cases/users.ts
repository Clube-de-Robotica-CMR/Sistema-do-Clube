import users from "@/pages/api/users";
import { RoleSchema, UpdateUserDTO, UserSchema } from "../entities/user.entity";
import { NotFoundError, UnauthorizedError } from "../errors/domain-errors";
import { HashService } from "../ports/auth/hash_service";
import { UsersRepository } from "../ports/users/users_repository";

export class UsersUseCase {
    constructor(
        private usersRepo: UsersRepository,
        private hashService: HashService
    ) { }

    async update(user: UpdateUserDTO) {
        if (user.password) {
            user.password = await this.hashService.hash(user.password);
        }

        const oldUser = await this.usersRepo.get_by_id(user.id);
        if (!oldUser) throw new NotFoundError("O usuário não existe");

        if (oldUser.role === RoleSchema.enum.admin) throw new UnauthorizedError("Não é possível atualizar os dados de um usuário admin");

        if (user.role === RoleSchema.enum.admin) throw new UnauthorizedError("Não é possível trocar o cargo de um usuário para admin");

        const newUserData = {
            id: user.id ?? oldUser.id,
            name: user.name ?? oldUser.name,
            password: user.password ?? oldUser.password,
            role: user.role ?? oldUser.role,
            created_at: oldUser.created_at,
            updated_at: new Date()
        }

        const newUser = UserSchema.parse(newUserData)

        return await this.usersRepo.update(newUser);
    }

    async delete(id: string) {
        const oldUser = await this.usersRepo.get_by_id(id);
        if (!oldUser) throw new NotFoundError("O usuário não existe");

        if (oldUser.role === RoleSchema.enum.admin) throw new UnauthorizedError("Não é permitido deletar um usuário admin");

        return await this.usersRepo.delete(id);
    }
}
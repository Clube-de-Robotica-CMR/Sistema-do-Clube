import { api_handler } from '@/infra/adapters/input/api_handler';
import { create_router } from '@/infra/adapters/input/router';
import { DrizzleUsersRepository } from '@/infra/adapters/output/drizzle/users_repository';
import { BcryptHashService } from '@/infra/adapters/output/bcrypt/hash_service';
import { CreateUserSchema, UpdateUserSchema, UserSchema } from '@/core/entities/user.entity';
import z from 'zod';
import { NotFoundError, RequestError } from '@/core/errors/domain-errors';
import { require_admin } from '@/infra/adapters/input/require_admin';
import { get_data_from_request } from '@/infra/adapters/input/get_data';

const usersRepo = new DrizzleUsersRepository();
const hashService = new BcryptHashService();

const router = create_router({
    'read': async (req, res) => {
        const users = await usersRepo.get_all();
        if (!users) throw new NotFoundError("Não existem usuários.")

        const safeUsers = users
            .map(
                user => {
                    if (!user) return undefined;
                    const { password, ...rest } = user;
                    return rest;
                })
            .filter(
                user => user !== undefined
            );

        return res.status(200).json({
            ok: true,
            data: safeUsers,
        });
    },

    'create': async (req, res) => {
        const data = get_data_from_request(req)

        const validatedBody = CreateUserSchema.parse(data);

        const existingUser = await usersRepo.get_by_name(validatedBody.name);
        if (existingUser) {
            throw new RequestError("Esse nome de usuário já está em uso.")
        }

        const hashedPassword = await hashService.hash(validatedBody.password);

        const newUser = {
            name: validatedBody.name,
            password: hashedPassword,
            role: validatedBody.role,
        }

        await usersRepo.save(newUser);

        return res.status(200).json({
            ok: true,
            message: 'Usuário criado com sucesso.',
        });
    },

    'update': async (req, res) => {
        const data = get_data_from_request(req)

        const validatedBody = UpdateUserSchema.parse(data)

        if (validatedBody.password) {
            validatedBody.password = await hashService.hash(validatedBody.password);
        }

        const oldUser = await usersRepo.get_by_id(validatedBody.id)
        if (!oldUser) throw new NotFoundError("O usuário que você está tentando atualizar não existe.")

        const newUserData = {
            id: validatedBody.id ?? oldUser.id,
            name: validatedBody.name ?? oldUser.name,
            password: validatedBody.password ?? oldUser.password,
            role: validatedBody.role ?? oldUser.role,
            created_at: oldUser.created_at,
            updated_at: new Date()
        }

        const newUser = UserSchema.parse(newUserData)

        await usersRepo.update(newUser);

        return res.status(200).json({
            ok: true,
            message: 'Usuário atualizado com sucesso.',
        });
    },

    'delete': async (req, res) => {
        const data = get_data_from_request(req)

        const { id } = z.object({ id: z.uuid('ID inválido') }).parse(data);

        const oldUser = await usersRepo.get_by_id(id)
        if (!oldUser) throw new NotFoundError("O usuário não existe.")

        await usersRepo.delete(id);

        return res.status(200).json({
            ok: true,
            message: 'Usuário deletado com sucesso.',
        });
    }
},
    require_admin
);

export default api_handler(router);
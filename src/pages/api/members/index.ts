import { api_handler } from '@/infra/adapters/input/api_handler';
import { create_router } from '@/infra/adapters/input/router';
import { DrizzleMembersRepository } from '@/infra/adapters/output/drizzle/members_repository';
import { CreateMemberSchema, UpdateMemberSchema, MemberSchema, SearchFilterSchema } from '@/core/entities/member.entity';
import { NotFoundError, RequestError } from '@/core/errors/domain-errors';
import { require_login } from '@/infra/adapters/input/require_login';
import { get_data_from_request } from '@/infra/adapters/input/get_data';
import z from 'zod';
import { require_admin } from '@/infra/adapters/input/require_admin';

const membersRepo = new DrizzleMembersRepository();

const router = create_router({
    'read': async (req, res) => {
        const data = get_data_from_request(req);

        const filters = SearchFilterSchema.parse(data);

        const members = await membersRepo.get_all(filters);

        if (!members) throw new NotFoundError("Membros não encontrados.")

        return res.status(200).json({
            ok: true,
            data: members,
        });
    },

    'create': async (req, res) => {
        const data = get_data_from_request(req);
        const validatedBody = CreateMemberSchema.parse(data);

        const existingMember = await membersRepo.get_by_number(validatedBody.number);
        if (existingMember) {
            const msg = `O aluno de número "${validatedBody.number}" já está cadastrado.`;
            throw new RequestError(msg,
                {
                    "number": [msg]
                }
            );
        }

        await membersRepo.save(validatedBody);

        return res.status(201).json({
            ok: true,
            message: 'Membro cadastrado com sucesso.',
        });
    },

    'update': async (req, res) => {
        const data = get_data_from_request(req);
        const validatedBody = UpdateMemberSchema.parse(data);

        const oldMember = await membersRepo.get_by_id(validatedBody.id);
        if (!oldMember) {
            throw new NotFoundError("O membro solicitado não existe.");
        }

        if (validatedBody.number && validatedBody.number !== oldMember.number) {
            const memberWithNumber = await membersRepo.get_by_number(validatedBody.number);
            if (memberWithNumber) {
                const msg = "Esse número de aluno já está em uso por outro cadastro.";
                throw new RequestError(msg,
                    {
                        "number": [msg]
                    }
                );
            }
        }

        const newMemberData = {
            ...oldMember,
            ...validatedBody,
            updated_at: new Date()
        };

        const fullValidatedMember = MemberSchema.parse(newMemberData);

        await membersRepo.update(fullValidatedMember);

        return res.status(200).json({
            ok: true,
            message: 'Cadastro do membro atualizado com sucesso.',
        });
    },

    'delete': async (req, res) => {
        const data = get_data_from_request(req);
        const { id } = z.object({ id: z.uuid('ID inválido') }).parse(data);

        const member = await membersRepo.get_by_id(id);
        if (!member) {
            throw new NotFoundError("Membro não encontrado.");
        }

        await membersRepo.delete(id);

        return res.status(200).json({
            ok: true,
            message: 'Membro removido com sucesso.',
        });
    },

    'delete_all': async (req, res) => {
        require_admin(req, res);

        await membersRepo.delete_all();

        return res.status(200).json({
            ok: true,
            message: 'Todos os membros foram removidos com sucesso',
        });
    }
},
    require_login
);

export default api_handler(router);
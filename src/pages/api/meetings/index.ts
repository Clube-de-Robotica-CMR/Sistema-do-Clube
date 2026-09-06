import { CreateMeetingSchema, MeetingSchema, MeetingsFilterSchema, MetricSearchSchema, QuarterSchema, RegisterAttendanceSchema } from "@/core/entities/meeting.entity";
import { NotFoundError } from "@/core/errors/domain-errors";
import { MeetingsUseCase } from "@/core/use-cases/meetings";
import { api_handler } from "@/infra/adapters/input/api_handler";
import { get_data_from_request } from "@/infra/adapters/input/get_data";
import { require_admin } from "@/infra/adapters/input/require_admin";
import { require_login } from "@/infra/adapters/input/require_login";
import { create_router } from "@/infra/adapters/input/router";
import { DrizzleMeetingsRepository } from "@/infra/adapters/output/drizzle/meetings_repository";
import { DrizzleMembersRepository } from "@/infra/adapters/output/drizzle/members_repository";
import z from "zod";

const meetingsRepo = new DrizzleMeetingsRepository();
const membersRepo = new DrizzleMembersRepository();
const meetingsUseCase = new MeetingsUseCase(meetingsRepo, membersRepo);

const router = create_router({
    "create": async (req, res) => {
        const data = get_data_from_request(req)

        const validatedBody = CreateMeetingSchema.parse(data)

        const meeting = {
            ...validatedBody,
            year: validatedBody.date.getFullYear()
        }
        const result = await meetingsRepo.save_meeting(meeting)

        return res.status(200).json({
            ok: true,
            data: result,
        })
    },

    "read": async (req, res) => {
        const data = get_data_from_request(req)
        const filters = MeetingsFilterSchema.partial().parse(data)

        const meetings = await meetingsRepo.get_meetings(filters)
        if (!meetings) throw new NotFoundError("Não foi encontrado nenhum encontro.")

        return res.status(200).json({
            ok: true,
            data: meetings
        })
    },

    'get_metrics_by_member': async (req, res) => {
        const data = get_data_from_request(req);

        const { quarter, member_id } = MetricSearchSchema.extend({
            member_id: z.uuid("ID inválido ou não existente."),
        }).parse(data);

        const metrics = await meetingsUseCase.get_member_metrics({ quarter }, member_id)

        return res.status(200).json({
            ok: true,
            data: metrics,
        });
    },

    'get_all_metrics': async (req, res) => {
        const data = get_data_from_request(req);

        const { quarter } = MetricSearchSchema.parse(data)

        const members = await membersRepo.get_all();

        const metrics = await Promise.all(
            members.map(async (member) => ({
                ...member,
                ...(await meetingsUseCase.get_member_metrics({
                    quarter,
                }, member.id))
            }))
        );

        return res.status(200).json({
            ok: true,
            data: metrics,
        })
    },

    'update': async (req, res) => {
        const data = get_data_from_request(req);

        const UpdateMeetingSchema = CreateMeetingSchema.partial().extend({
            id: z.uuid('ID inválido')
        });

        const validatedBody = UpdateMeetingSchema.parse(data);

        const oldMeeting = await meetingsRepo.get_meeting_by_id(validatedBody.id);
        if (!oldMeeting) {
            throw new NotFoundError("O encontro solicitado não existe.");
        }

        const updatedMeetingData = {
            ...oldMeeting,
            ...validatedBody,
            updated_at: new Date()
        };

        const fullValidatedMeeting = MeetingSchema.parse(updatedMeetingData);
        await meetingsRepo.update_meeting(fullValidatedMeeting);

        return res.status(200).json({
            ok: true,
            message: 'Encontro atualizado com sucesso.',
        });
    },

    'delete': async (req, res) => {
        const data = get_data_from_request(req);
        const { id } = z.object({ id: z.uuid('ID inválido') }).parse(data);

        const meeting = await meetingsRepo.get_meeting_by_id(id);
        if (!meeting) {
            throw new NotFoundError("Encontro não encontrado.");
        }

        await meetingsRepo.delete_meeting(id);

        return res.status(200).json({
            ok: true,
            message: 'Encontro e suas respectivas presenças removidos com sucesso.',
        });
    },

    'delete_all': async (req, res) => {
        require_admin(req, res);

        await meetingsRepo.delete_all_meetings();

        return res.status(200).json({
            ok: true,
            message: 'Todos os encontros e suas respectivas presenças removidos com sucesso.',
        });
    },

    "save_attendances": async (req, res) => {
        const data = get_data_from_request(req);
        const validatedBody = RegisterAttendanceSchema.parse(data);

        await meetingsUseCase.register_attendance(validatedBody);

        return res.status(200).json({
            ok: true,
            message: 'Lista de presença registrada/atualizada com sucesso.',
        });
    },

    "find_attendances": async (req, res) => {
        const data = get_data_from_request(req);
        const { meeting_id } = z.object({ meeting_id: z.uuid('ID inválido') }).parse(data);

        const attendances = await meetingsRepo.get_attendances_by_meeting(meeting_id)

        return res.status(200).json({
            ok: true,
            data: attendances,
        })
    }
},
    require_login
);

export default api_handler(router);
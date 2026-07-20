import { CreateMeetingSchema, MeetingSchema, MeetingsFilterSchema, QuarterSchema, RegisterAttendanceSchema } from "@/core/entities/meeting.entity";
import { NotFoundError } from "@/core/errors/domain-errors";
import { MeetingsUseCase } from "@/core/use-cases/meetings";
import { api_handler } from "@/infra/adapters/input/api_handler";
import { get_data_from_request } from "@/infra/adapters/input/get_data";
import { require_admin } from "@/infra/adapters/input/require_admin";
import { require_login } from "@/infra/adapters/input/require_login";
import { create_router } from "@/infra/adapters/input/router";
import { DrizzleMeetingsRepository } from "@/infra/adapters/output/drizzle/meetings_repository";
import z from "zod";

const meetingsRepo = new DrizzleMeetingsRepository();
const meetingsUseCase = new MeetingsUseCase(meetingsRepo);

const router = create_router({
    "create": async (req, res) => {
        const data = get_data_from_request(req)

        const validatedBody = CreateMeetingSchema.parse(data)

        const meeting = {
            ...validatedBody,
            year: validatedBody.date.getFullYear()
        }
        await meetingsRepo.save_meeting(meeting)

        return res.status(200).json({
            ok: true,
            message: "Encontro criado com sucesso.",
        })
    },

    "read": async (req, res) => {
        const data = get_data_from_request(req)
        const filters = MeetingsFilterSchema.parse(data)

        const meetings = await meetingsRepo.get_meetings_by_period(filters)
        if (!meetings) throw new NotFoundError("Não foi encontrado nenhum encontro.")

        return res.status(200).json({
            ok: true,
            data: meetings
        })
    },

    'get_metrics': async (req, res) => {
        const data = get_data_from_request(req);

        const QuerySchema = z.object({
            member_id: z.uuid('ID de membro inválido'),
            year: z.coerce.number().min(2026),
            quarter: QuarterSchema,
        });

        const validatedBody = QuerySchema.parse(data);

        const metrics = await meetingsUseCase.get_member_metrics(validatedBody)

        return res.status(200).json({
            ok: true,
            data: metrics,
        });
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

        const year = validatedBody.date ? new Date(validatedBody.date).getFullYear() : oldMeeting.year;

        const updatedMeetingData = {
            ...oldMeeting,
            ...validatedBody,
            year,
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
},
    require_login
);

export default api_handler(router);
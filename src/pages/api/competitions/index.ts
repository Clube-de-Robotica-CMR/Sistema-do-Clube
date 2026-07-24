import { CreateCompetitionSchema, CompetitionSchema, SaveCompetitionResultsSchema, CompetitionFiltersSchema } from "@/core/entities/competition.entity";
import { NotFoundError } from "@/core/errors/domain-errors";
import { CompetitionResultsUseCase } from "@/core/use-cases/competitions";
import { api_handler } from "@/infra/adapters/input/api_handler";
import { get_data_from_request } from "@/infra/adapters/input/get_data";
import { require_login } from "@/infra/adapters/input/require_login";
import { create_router } from "@/infra/adapters/input/router";
import { DrizzleCompetitionsRepository } from "@/infra/adapters/output/drizzle/competitions_repository";
import z from "zod";

const competitionsRepo = new DrizzleCompetitionsRepository();
const competitionsUseCase = new CompetitionResultsUseCase(competitionsRepo);

const router = create_router({
    "create": async (req, res) => {
        const data = get_data_from_request(req);
        const validatedBody = CreateCompetitionSchema.parse(data);

        const competition = {
            ...validatedBody,
            year: validatedBody.date.getFullYear()
        };
        const result = await competitionsRepo.save(competition);

        return res.status(200).json({
            ok: true,
            data: result,
        });
    },

    "read": async (req, res) => {
        const data = get_data_from_request(req);

        const filters = CompetitionFiltersSchema.parse(data);

        const competitions = await competitionsRepo.get_all(filters);
        if (!competitions) throw new NotFoundError("Nenhuma competição foi encontrada.");

        return res.status(200).json({
            ok: true,
            data: competitions
        });
    },

    "read_by_id": async (req, res) => {
        const data = get_data_from_request(req);
        const { id } = z.object({ id: z.uuid('ID inválido') }).parse(data);

        const competition = await competitionsRepo.get_by_id(id);
        if (!competition) throw new NotFoundError("Competição não encontrada.");

        return res.status(200).json({
            ok: true,
            data: competition
        });
    },

    "update": async (req, res) => {
        const data = get_data_from_request(req);

        const UpdateCompetitionSchema = CreateCompetitionSchema.partial().extend({
            id: z.uuid('ID inválido')
        });
        const validatedBody = UpdateCompetitionSchema.parse(data);

        const oldCompetition = await competitionsRepo.get_by_id(validatedBody.id);
        if (!oldCompetition) {
            throw new NotFoundError("A competição solicitada não existe.");
        }

        const year = validatedBody.date ? new Date(validatedBody.date).getFullYear() : oldCompetition.year;

        const updatedCompetitionData = {
            ...oldCompetition,
            ...validatedBody,
            year,
            updated_at: new Date()
        };

        const fullValidatedCompetition = CompetitionSchema.parse(updatedCompetitionData);
        await competitionsRepo.update(fullValidatedCompetition);

        return res.status(200).json({
            ok: true,
            message: 'Competição atualizada com sucesso.',
        });
    },

    "delete": async (req, res) => {
        const data = get_data_from_request(req);
        const { id } = z.object({ id: z.uuid('ID inválido') }).parse(data);

        const competition = await competitionsRepo.get_by_id(id);
        if (!competition) {
            throw new NotFoundError("Competição não encontrada.");
        }

        await competitionsRepo.delete(id);

        return res.status(200).json({
            ok: true,
            message: 'Competição e seus respectivos resultados removidos com sucesso.',
        });
    },

    "save_results": async (req, res) => {
        const data = get_data_from_request(req);
        const validatedBody = SaveCompetitionResultsSchema.parse(data);

        await competitionsRepo.save_results(validatedBody);

        return res.status(200).json({
            ok: true,
            message: 'Resultados da competição salvos com sucesso.',
        });
    },

    "get_results_by_competition": async (req, res) => {
        const data = get_data_from_request(req);
        const { id } = z.object({ id: z.uuid('ID inválido') }).parse(data);

        const results = await competitionsRepo.get_results_by_competition(id);
        if (!results) throw new NotFoundError("Nenhum resultado encontrado para esta competição.");

        return res.status(200).json({
            ok: true,
            data: results
        });
    },

    "get_member_score": async (req, res) => {
        const data = get_data_from_request(req);
        const { member_number } = z.object({
            member_number: z.string().min(4, 'Número do membro inválido')
        }).parse(data);

        const score = await competitionsUseCase.get_member_score(member_number);
        if (!score) throw new NotFoundError("Nenhum histórico de pontuação encontrado para este membro.");

        return res.status(200).json({
            ok: true,
            data: score
        });
    },

    "get_ranking": async (req, res) => {
        const ranking = await competitionsUseCase.get_ranked_members();
        if (!ranking) throw new NotFoundError("Nenhum membro pontuado para gerar o ranking.");

        return res.status(200).json({
            ok: true,
            data: ranking
        });
    }
},
    require_login
);

export default api_handler(router);
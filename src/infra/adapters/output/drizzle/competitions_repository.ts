import { competitions_table, competition_results_table } from '@/infra/db/schemas/competitions.schema';
import { CompetitionsRepository, RawMemberMedalsDTO } from '@/core/ports/competitions/competitions_repository';
import { Competition, CompetitionResult, CreateCompetitionDTO, PlacementSchema, SaveCompetitionResultsDTO } from '@/core/entities/competition.entity';
import { eq, inArray, and, sql, count } from 'drizzle-orm';
import { db } from '@/infra/db/drizzle/client';
import { DBError } from '@/core/errors/db-error';

export class DrizzleCompetitionsRepository implements CompetitionsRepository {
    async save(competition: CreateCompetitionDTO & { year: number }): Promise<void> {
        const result = await db
            .insert(competitions_table)
            .values(competition)
            .returning();

        if (result.length === 0) throw new DBError("Erro na criação de competição");
    }

    async get_by_id(id: string): Promise<Competition | null> {
        const [result] = await db
            .select()
            .from(competitions_table)
            .where(eq(competitions_table.id, id));
            
        return result || null;
    }

    async get_all(): Promise<Competition[] | null> {
        const results = await db
            .select()
            .from(competitions_table);
            
        return results.length > 0 ? results : null;
    }

    async update(competition: Competition): Promise<void> {
        const result = await db
            .update(competitions_table)
            .set(competition)
            .where(eq(competitions_table.id, competition.id))
            .returning();

        if (result.length === 0) throw new DBError("Erro ao tentar atualizar competição")
    }

    async delete(id: string): Promise<void> {
        const result = await db
            .delete(competitions_table)
            .where(eq(competitions_table.id, id))
            .returning();

        if (result.length === 0) throw new DBError("Erro ao tentar deletar competição")
    }

    async save_results(data: SaveCompetitionResultsDTO): Promise<void> {
        if (data.results.length === 0) return;

        const rowsToInsert = data.results.map((res) => ({
            competition_id: data.competition_id,
            member_number: res.member_number,
            member_war_name: res.member_war_name, 
            placement: res.placement,
        }));

        const result = await db
            .insert(competition_results_table)
            .values(rowsToInsert)
            .onConflictDoUpdate({
                target: [competition_results_table.member_number, competition_results_table.competition_id],
                set: { 
                    placement: sql`EXCLUDED.placement`,
                    member_war_name: sql`EXCLUDED.member_war_name`,
                    updated_at: new Date()
                },
            })
            .returning();

        if (result.length === 0) throw new DBError("Erro o tentar salvar os resultados")
    }

    async get_results_by_competition(competition_id: string): Promise<CompetitionResult[] | null> {
        const results = await db
            .select()
            .from(competition_results_table)
            .where(eq(competition_results_table.competition_id, competition_id));

        return results.length > 0 ? results : null;
    }

    async delete_results(competition_id: string, member_numbers: string[]): Promise<void> {
        if (member_numbers.length === 0) return;

        const result = await db
            .delete(competition_results_table)
            .where(
                and(
                    eq(competition_results_table.competition_id, competition_id),
                    inArray(competition_results_table.member_number, member_numbers)
                )
            )
            .returning();

        if (result.length === 0) throw new DBError("Erro ao tentar deletar os resultados")
    }

    async get_member_medals(member_number: string): Promise<RawMemberMedalsDTO | null> {
        const [result] = await db
            .select({
                member_number: competition_results_table.member_number,
                name: sql<string>`MAX(${competition_results_table.member_war_name})`, 
                gold_count: count(sql`CASE WHEN ${competition_results_table.placement} = ${PlacementSchema.enum['1°']} THEN 1 END`),
                silver_count: count(sql`CASE WHEN ${competition_results_table.placement} = ${PlacementSchema.enum['2°']} THEN 1 END`),
                bronze_count: count(sql`CASE WHEN ${competition_results_table.placement} = ${PlacementSchema.enum['3°']} THEN 1 END`),
            })
            .from(competition_results_table)
            .where(eq(competition_results_table.member_number, member_number))
            .groupBy(competition_results_table.member_number);

        return result ? {
            member_number: result.member_number,
            name: result.name,
            gold_count: Number(result.gold_count),
            silver_count: Number(result.silver_count),
            bronze_count: Number(result.bronze_count),
        } : null;
    }

    async get_all_members_medals(): Promise<RawMemberMedalsDTO[] | null> {
        const results = await db
            .select({
                member_number: competition_results_table.member_number,
                name: sql<string>`MAX(${competition_results_table.member_war_name})`,
                gold_count: count(sql`CASE WHEN ${competition_results_table.placement} = ${PlacementSchema.enum['1°']} THEN 1 END`),
                silver_count: count(sql`CASE WHEN ${competition_results_table.placement} = ${PlacementSchema.enum['2°']} THEN 1 END`),
                bronze_count: count(sql`CASE WHEN ${competition_results_table.placement} = ${PlacementSchema.enum['3°']} THEN 1 END`),
            })
            .from(competition_results_table)
            .groupBy(competition_results_table.member_number);

        if (results.length === 0) return null;

        return results.map(row => ({
            member_number: row.member_number,
            name: row.name,
            gold_count: Number(row.gold_count),
            silver_count: Number(row.silver_count),
            bronze_count: Number(row.bronze_count),
        }));
    }
}
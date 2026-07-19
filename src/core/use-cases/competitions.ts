import { CompetitionsRepository } from "@/core/ports/competitions/competitions_repository";

export interface MemberScoreResponse {
    member_number: string;
    name: string;
    gold_count: number;
    silver_count: number;
    bronze_count: number;
    total_points: number;
    can_ascend: boolean;
}

export class CompetitionResultsUseCase {
    constructor(private competitionsRepository: CompetitionsRepository) {}

    calculate_total_points(medals: { gold_count: number, silver_count: number, bronze_count: number }): number {
        const gold_medal_points = 3;
        const silver_medal_points = 2;
        const bronze_medal_points = 1;
        return (
            (medals.gold_count * gold_medal_points) 
            + (medals.silver_count * silver_medal_points) 
            + (medals.bronze_count * bronze_medal_points)
        );
    };

    can_ascend(points: number): boolean {
        const points_to_ascend = 12
        return points > points_to_ascend;
    }

    async get_member_score(member_number: string): Promise<MemberScoreResponse | null> {
        const medals = await this.competitionsRepository.get_member_medals(member_number);
        if (!medals) return null;

        const total_points = this.calculate_total_points({
            gold_count: medals.gold_count,
            silver_count: medals.silver_count,
            bronze_count: medals.bronze_count
        });

        const can_ascend = this.can_ascend(total_points)

        return {
            member_number: medals.member_number,
            name: medals.name,
            gold_count: medals.gold_count,
            silver_count: medals.silver_count,
            bronze_count: medals.bronze_count,
            total_points,
            can_ascend,
        };
    }

    async get_ranked_members(): Promise<MemberScoreResponse[] | null> {
        const allMedals = await this.competitionsRepository.get_all_members_medals();
        if (!allMedals) return null;

        const ranked: MemberScoreResponse[] = allMedals.map((medals) => {
            const total_points = this.calculate_total_points({
            gold_count: medals.gold_count,
            silver_count: medals.silver_count,
            bronze_count: medals.bronze_count
        });
            const can_ascend = this.can_ascend(total_points);

            return {
                member_number: medals.member_number,
                name: medals.name,
                gold_count: medals.gold_count,
                silver_count: medals.silver_count,
                bronze_count: medals.bronze_count,
                total_points,
                can_ascend,
            };
        });
        
        const filteredAndSorted = ranked
            .filter((member) => member.total_points > 0)
            .sort((a, b) => b.total_points - a.total_points);

        return filteredAndSorted.length > 0 ? filteredAndSorted : null;
    }
}
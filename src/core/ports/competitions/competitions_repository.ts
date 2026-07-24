import { Competition, CompetitionFilters, CompetitionResult, CreateCompetitionDTO, SaveCompetitionResultsDTO } from '@/core/entities/competition.entity';

export interface RawMemberMedalsDTO {
    member_number: string;
    name: string;
    gold_count: number;
    silver_count: number;
    bronze_count: number;
}

export interface CompetitionsRepository {
    save(competition: CreateCompetitionDTO & { year: number }): Promise<Competition>;
    get_by_id(id: string): Promise<Competition | null>;
    get_all(filters: CompetitionFilters): Promise<Competition[]>;
    update(competition: Competition): Promise<void>;
    delete(id: string): Promise<void>;

    save_results(data: SaveCompetitionResultsDTO): Promise<void>;
    get_results_by_competition(competition_id: string): Promise<CompetitionResult[]>;
    delete_results(competition_id: string, member_numbers: string[]): Promise<void>;

    get_member_medals(member_number: string): Promise<RawMemberMedalsDTO | null>;
    get_all_members_medals(): Promise<RawMemberMedalsDTO[]>;
}
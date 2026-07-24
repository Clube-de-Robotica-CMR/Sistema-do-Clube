import type {
    Competition,
    CompetitionResult,
} from "@/core/entities/competition.entity";

export interface CompetitionWithResults
    extends Competition {
    results: CompetitionResult[];
}
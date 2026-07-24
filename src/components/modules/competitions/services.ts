import {
    Competition,
    CompetitionFilters,
    CompetitionResult,
    CreateCompetitionDTO,
    SaveCompetitionResultsDTO,
} from "@/core/entities/competition.entity";

import { rpcClient } from "@/services/api";

export function findCompetitions(filters: CompetitionFilters) {
    return rpcClient<Competition[]>(
        "competitions",
        "read",
        filters
    );
}

export function createCompetition(
    data: CreateCompetitionDTO
) {
    return rpcClient<Competition>(
        "competitions",
        "create",
        data
    );
}

export function updateCompetition(
    data: Partial<
        Competition
    > & { id: string }
) {
    return rpcClient<string>(
        "competitions",
        "update",
        data
    );
}

export function deleteCompetition(
    id: string
) {
    return rpcClient<string>(
        "competitions",
        "delete",
        { id }
    );
}

export function saveCompetitionResults(
    data: SaveCompetitionResultsDTO
) {
    return rpcClient<string>(
        "competitions",
        "save_results",
        data
    );
}

export function findCompetitionResults(
    competitionId: string
) {
    return rpcClient<
        CompetitionResult[]
    >(
        "competitions",
        "get_results_by_competition",
        {
            id: competitionId,
        }
    );
}
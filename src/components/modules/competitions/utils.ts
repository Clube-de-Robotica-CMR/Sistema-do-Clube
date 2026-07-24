import type { CompetitionResult } from "@/core/entities/competition.entity";

export function formatCompetitionDate(
    date: Date | string
) {
    return new Date(date).toLocaleDateString("pt-BR", {
        timeZone: "UTC"
    });
}

export function groupResults(
    results: CompetitionResult[]
) {
    return {
        first: results.filter(
            (result) =>
                result.placement === "1°"
        ),

        second: results.filter(
            (result) =>
                result.placement === "2°"
        ),

        third: results.filter(
            (result) =>
                result.placement === "3°"
        ),
    };
}

export function placementMedal(
    placement: "1°" | "2°" | "3°"
) {
    switch (placement) {
        case "1°":
            return "🥇"

        case "2°":
            return "🥈"

        case "3°":
            return "🥉"
    }
}

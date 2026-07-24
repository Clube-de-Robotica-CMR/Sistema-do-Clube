
import type { Quarter } from "@/core/entities/meeting.entity";
import type { BonusRow } from "./types";
import { rpcClient } from "@/services/api";

export async function findBonusRows(
    quarter: Quarter
) {
    return rpcClient<BonusRow[]>(
        "meetings",
        "get_all_metrics",
        {
            quarter,
        }
    );
}
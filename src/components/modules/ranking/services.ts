import type { RankingRow } from "./types";
import { rpcClient } from "@/services/api";

export async function findRanking() {
    return rpcClient<RankingRow[]>(
        "competitions",
        "get_ranking"
    );
}
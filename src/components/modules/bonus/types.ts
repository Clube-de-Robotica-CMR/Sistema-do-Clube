import type { Member } from "@/core/entities/member.entity";
import type { MemberMetricsResponse } from "@/core/use-cases/meetings";

export interface BonusRow
    extends Member,
    MemberMetricsResponse { }
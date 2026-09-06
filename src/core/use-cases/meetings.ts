import { MeetingsRepository } from "@/core/ports/meetings/meetings_repository";
import { NotFoundError } from "../errors/domain-errors";
import { AttendanceStatus, AttendanceStatusSchema, FindMeetingsFilter, MetricSearch, Quarter, RegisterAttendanceDTO } from "../entities/meeting.entity";
import { DrizzleMembersRepository } from "@/infra/adapters/output/drizzle/members_repository";
import { MembersRepository } from "../ports/members/members_repository";

export interface MemberMetricsResponse {
  member_id: string;
  quarter: Quarter;
  total_meetings_in_quarter: number;
  presents_in_quarter: number;
  attendance_percentage: number;
  grade_bonus: number;
  unjustified_absences_in_year: number;
  is_at_risk_of_expulsion: boolean;
}

export class MeetingsUseCase {
  constructor(private meetingsRepository: MeetingsRepository, private membersRepository: MembersRepository) { }

  async register_attendance(data: RegisterAttendanceDTO): Promise<void> {
    const meeting = await this.meetingsRepository.get_meeting_by_id(data.meeting_id);
    if (!meeting) {
      throw new NotFoundError("Encontro não encontrado para registrar a lista de presença.");
    }

    const now = new Date();
    const attendances = data.attendances.map(record => ({
      meeting_id: data.meeting_id,
      member_id: record.member_id,
      status: record.status,
      updated_at: now,
    }));

    await this.meetingsRepository.save_attendances(attendances);
  }

  async get_member_metrics(search: MetricSearch, member_id: string): Promise<MemberMetricsResponse> {
    const periodFilter: FindMeetingsFilter = { quarter: search.quarter };

    const memberAttendances = await this.meetingsRepository.get_member_attendances_by_period(member_id, periodFilter);

    const presences = memberAttendances
      ? memberAttendances.filter(att => att.status === AttendanceStatusSchema.enum.Presente).length
      : 0;

    const absenses = memberAttendances
      ? memberAttendances.filter(att => att.status === AttendanceStatusSchema.enum.Falta).length
      : 0;

    const totalMeetings = presences + absenses;

    const attendancePercentage = totalMeetings > 0
      ? Math.round((presences / totalMeetings) * 100)
      : 0;

    let gradeBonus = 0;
    if (attendancePercentage > 50) {
      gradeBonus = 1.0;
    } else if (attendancePercentage > 25) {
      gradeBonus = 0.5;
    }

    const member = await this.membersRepository.get_by_id(member_id);
    if (member?.level === "Nível A") gradeBonus = 1.0;

    const unjustifiedAbsences = await this.meetingsRepository.get_member_unjustified_absences(member_id);
    const totalUnjustifiedAbsences = unjustifiedAbsences ? unjustifiedAbsences.length : 0;

    const maxUnjustifiedAbsences = 5;
    const isAtRiskOfExpulsion = totalUnjustifiedAbsences >= maxUnjustifiedAbsences;

    return {
      member_id,
      quarter: search.quarter,
      total_meetings_in_quarter: totalMeetings,
      presents_in_quarter: presences,
      attendance_percentage: attendancePercentage,
      grade_bonus: gradeBonus,
      unjustified_absences_in_year: totalUnjustifiedAbsences,
      is_at_risk_of_expulsion: isAtRiskOfExpulsion
    };
  }
}
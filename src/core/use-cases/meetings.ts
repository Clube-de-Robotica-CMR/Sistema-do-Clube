import { MeetingsRepository } from "@/core/ports/meetings/meetings_repository";
import { NotFoundError } from "../errors/domain-errors";
import { AttendanceStatus, AttendanceStatusSchema, FindMeetingsFilter, MetricSearch, Quarter, RegisterAttendanceDTO } from "../entities/meeting.entity";

export interface MemberMetricsResponse {
  member_id: string;
  year: number;
  quarter: Quarter;
  total_meetings_in_quarter: number;
  presents_in_quarter: number;
  attendance_percentage: number;
  grade_bonus: number;
  unjustified_absences_in_year: number;
  is_at_risk_of_expulsion: boolean;
}

export class MeetingsUseCase {
  constructor(private meetingsRepository: MeetingsRepository) { }

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

  async get_member_metrics(search: MetricSearch): Promise<MemberMetricsResponse> {
    const periodFilter: FindMeetingsFilter = { year: search.year, quarter: search.quarter };

    const allMeetings = await this.meetingsRepository.get_meetings(periodFilter);
    const totalMeetings = allMeetings ? allMeetings.length : 0;

    const memberAttendances = await this.meetingsRepository.get_member_attendances_by_period(search.member_id, periodFilter);

    const presents = memberAttendances
      ? memberAttendances.filter(att => att.status === AttendanceStatusSchema.enum.Presente).length
      : 0;

    const attendancePercentage = totalMeetings > 0
      ? Math.round((presents / totalMeetings) * 100)
      : 0;

    let gradeBonus = 0;
    if (attendancePercentage > 50) {
      gradeBonus = 1.0;
    } else if (attendancePercentage > 25) {
      gradeBonus = 0.5;
    }

    const unjustifiedAbsences = await this.meetingsRepository.get_member_unjustified_absences_by_year(search.member_id, search.year);
    const totalUnjustifiedAbsences = unjustifiedAbsences ? unjustifiedAbsences.length : 0;

    const maxUnjustifiedAbsences = 5;
    const isAtRiskOfExpulsion = totalUnjustifiedAbsences >= maxUnjustifiedAbsences;

    return {
      member_id: search.member_id,
      year: search.year,
      quarter: search.quarter,
      total_meetings_in_quarter: totalMeetings,
      presents_in_quarter: presents,
      attendance_percentage: attendancePercentage,
      grade_bonus: gradeBonus,
      unjustified_absences_in_year: totalUnjustifiedAbsences,
      is_at_risk_of_expulsion: isAtRiskOfExpulsion
    };
  }
}
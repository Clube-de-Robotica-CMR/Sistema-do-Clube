import { Meeting, Attendance, CreateMeetingDTO, FindMeetingsFilter, Quarter, AttendanceStatus, CreateAttendanceDTO, AttendanceStatusSchema } from '@/core/entities/meeting.entity';
import { DBError } from '@/core/errors/db-error';
import { MeetingsRepository } from '@/core/ports/meetings/meetings_repository';
import { db } from '@/infra/db/drizzle/client';
import { meetings_table, attendance_table, attendanceStatusEnum } from '@/infra/db/schemas/meetings.schema';
import { eq, and, sql } from 'drizzle-orm';

export class DrizzleMeetingsRepository implements MeetingsRepository {

  private mapMeetingToDomain(dbMeeting: any): Meeting {
    return {
      id: dbMeeting.id,
      date: dbMeeting.date,
      quarter: dbMeeting.quarter as Quarter,
      created_at: dbMeeting.created_at,
      updated_at: dbMeeting.updated_at,
    };
  }

  private mapAttendanceToDomain(dbAttendance: any): Attendance {
    return {
      id: dbAttendance.id,
      meeting_id: dbAttendance.meeting_id,
      member_id: dbAttendance.member_id,
      status: dbAttendance.status as AttendanceStatus,
      created_at: dbAttendance.created_at,
      updated_at: dbAttendance.updated_at,
    };
  }

  async save_meeting(meeting: CreateMeetingDTO & { year: number }): Promise<Meeting> {
    const result = await db
      .insert(meetings_table)
      .values(meeting)
      .returning();

    if (!result[0]) throw new DBError("Erro ao tentar cadastrar o encontro.");
    return result[0];
  }

  async get_meeting_by_id(id: string): Promise<Meeting | null> {
    const result = await db
      .select()
      .from(meetings_table)
      .where(eq(meetings_table.id, id))
      .limit(1);

    if (!result[0]) return null;
    return this.mapMeetingToDomain(result[0]);
  }

  async get_meetings(filters: Partial<FindMeetingsFilter>): Promise<Meeting[]> {
    const conditions = [];

    if (filters.quarter) conditions.push(eq(meetings_table.quarter, filters.quarter));

    const result = await db
      .select()
      .from(meetings_table)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    if (result.length === 0) return [];
    return result.map(this.mapMeetingToDomain);
  }

  async update_meeting(meeting: Meeting): Promise<void> {
    const result = await db
      .update(meetings_table)
      .set(meeting)
      .where(eq(meetings_table.id, meeting.id))
      .returning();

    if (!result[0]) throw new DBError("Erro ao tentar atualizar o encontro.");
  }

  async delete_meeting(id: string): Promise<void> {
    const result = await db
      .delete(meetings_table)
      .where(eq(meetings_table.id, id))
      .returning();

    if (!result[0]) throw new DBError("Erro ao tentar deletar o encontro.");
  }

  async delete_all_meetings(): Promise<void> {
    const result = await db
      .delete(meetings_table)
      .returning();

    if (!result[0]) throw new DBError("Erro ao tentar deletar todos os encontros.");
  }

  async save_attendances(
    attendances: CreateAttendanceDTO[]
  ): Promise<void> {
    if (attendances.length === 0) return;

    const now = new Date();
    const result = await db
      .insert(attendance_table)
      .values(attendances)
      .onConflictDoUpdate({
        target: [attendance_table.member_id, attendance_table.meeting_id],
        set: {
          status: sql`EXCLUDED.status`,
          updated_at: now,
        }
      })
      .returning();

    if (result.length !== attendances.length) {
      throw new DBError("Erro ao tentar salvar ou atualizar a lista de presença.");
    }
  }

  async delete_attendances(meeting_id: string, member_ids: string[]): Promise<void> {
    if (member_ids.length === 0) return;

    const result = await db
      .delete(attendance_table)
      .where(
        and(
          eq(attendance_table.meeting_id, meeting_id),
          sql`${attendance_table.member_id} IN ${member_ids}`
        )
      )
      .returning();

    if (result.length !== member_ids.length) {
      throw new DBError("Alguns registros de presença não puderam ser removidos.");
    }
  }

  async get_attendances_by_meeting(meeting_id: string): Promise<Attendance[]> {
    const result = await db
      .select()
      .from(attendance_table)
      .where(eq(attendance_table.meeting_id, meeting_id));

    if (result.length === 0) return [];
    return result.map(this.mapAttendanceToDomain);
  }

  async get_member_attendances_by_period(member_id: string, filters: FindMeetingsFilter): Promise<Attendance[]> {
    const result = await db
      .select({
        id: attendance_table.id,
        meeting_id: attendance_table.meeting_id,
        member_id: attendance_table.member_id,
        status: attendance_table.status,
        created_at: attendance_table.created_at,
        updated_at: attendance_table.updated_at,
      })
      .from(attendance_table)
      .innerJoin(meetings_table, eq(attendance_table.meeting_id, meetings_table.id))
      .where(
        and(
          eq(attendance_table.member_id, member_id),
          eq(meetings_table.quarter, filters.quarter)
        )
      );

    if (result.length === 0) return [];
    return result.map(this.mapAttendanceToDomain);
  }

  async get_member_unjustified_absences(member_id: string): Promise<Attendance[]> {
    const result = await db
      .select({
        id: attendance_table.id,
        meeting_id: attendance_table.meeting_id,
        member_id: attendance_table.member_id,
        status: attendance_table.status,
        created_at: attendance_table.created_at,
        updated_at: attendance_table.updated_at,
      })
      .from(attendance_table)
      .innerJoin(meetings_table, eq(attendance_table.meeting_id, meetings_table.id))
      .where(
        and(
          eq(attendance_table.member_id, member_id),
          eq(attendance_table.status, AttendanceStatusSchema.enum.Falta)
        )
      );

    if (result.length === 0) return [];
    return result.map(this.mapAttendanceToDomain);
  }
}
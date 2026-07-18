import { Meeting, Attendance, CreateMeetingDTO, FindMeetingsFilter, CreateAttendanceDTO } from '@/core/entities/meeting.entity';

export interface MeetingsRepository {
  save_meeting(meeting: CreateMeetingDTO): Promise<void>;
  get_meeting_by_id(id: string): Promise<Meeting | null>;
  get_meetings_by_period(filters: FindMeetingsFilter): Promise<Meeting[] | null>;
  update_meeting(meeting: Meeting): Promise<void>; 
  delete_meeting(id: string): Promise<void>;
  
  save_attendances(attendances: CreateAttendanceDTO[]): Promise<void>;
  get_attendances_by_meeting(meeting_id: string): Promise<Attendance[] | null>;
  delete_attendances(meeting_id: string, member_ids: string[]): Promise<void>;
  
  get_member_attendances_by_period(member_id: string, filters: FindMeetingsFilter): Promise<Attendance[] | null>;
  get_member_unjustified_absences_by_year(member_id: string, year: number): Promise<Attendance[] | null>;
}
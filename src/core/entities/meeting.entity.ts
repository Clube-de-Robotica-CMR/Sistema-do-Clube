import z from "zod";

export const QuarterSchema = z.enum(['1°', '2°', '3°']);
export type Quarter = z.infer<typeof QuarterSchema>;

export const AttendanceStatusSchema = z.enum(['Presente', 'Falta Justificada', 'Falta']);
export type AttendanceStatus = z.infer<typeof AttendanceStatusSchema>;

export const MeetingSchema = z.object({
    id: z.uuid(),
    date: z.coerce.date(),
    quarter: QuarterSchema,
    year: z.number().min(2026),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export const AttendanceSchema = z.object({
    id: z.uuid(),
    meeting_id: z.uuid(),
    member_id: z.uuid(),
    status: AttendanceStatusSchema,
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export const CreateMeetingSchema = MeetingSchema.pick({
    date: true,
    quarter: true,
});

export const MeetingsFilterSchema = MeetingSchema.pick({
    year: true,
    quarter: true,
})

export const MetricSearchSchema = MeetingsFilterSchema.extend({
    member_id: z.uuid(),
})

export const CreateAttendanceSchema = AttendanceSchema.pick({
    member_id: true,
    status: true,
    meeting_id: true,
})

export const RegisterAttendanceSchema = z.object({
    meeting_id: z.uuid(),
    attendances: z.array(CreateAttendanceSchema.omit({ meeting_id: true }))
});

export type FindMeetingsFilter = z.infer<typeof MeetingsFilterSchema>
export type MetricSearch = z.infer<typeof MetricSearchSchema>

export type Meeting = z.infer<typeof MeetingSchema>;
export type Attendance = z.infer<typeof AttendanceSchema>;
export type CreateMeetingDTO = z.infer<typeof CreateMeetingSchema>;
export type CreateAttendanceDTO = z.infer<typeof CreateAttendanceSchema>;
export type RegisterAttendanceDTO = z.infer<typeof RegisterAttendanceSchema>
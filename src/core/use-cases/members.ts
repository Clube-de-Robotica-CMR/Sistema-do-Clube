import { FindMembersFilter, Member } from "../entities/member.entity";
import { MeetingsRepository } from "../ports/meetings/meetings_repository";
import { MembersRepository } from "../ports/members/members_repository";

export interface StudentReportItem extends Member {
    unjustified_absences: number;
}

export class GetStudentsReportUseCase {
    constructor(
        private membersRepository: MembersRepository,
        private meetingsRepository: MeetingsRepository
    ) { }

    async execute(filters?: FindMembersFilter): Promise<StudentReportItem[]> {
        const members = await this.membersRepository.get_all(filters);

        const reportItems = await Promise.all(
            members.map(async (member) => {
                const absences = await this.meetingsRepository.get_member_unjustified_absences(member.id);

                return {
                    ...member,
                    unjustified_absences: absences.length,
                };
            })
        );

        return reportItems;
    }
}
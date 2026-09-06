import {
    CreateGroupDTO,
    CreateMemberDTO,
    FindMembersFilter,
    Group,
    GroupWithMembers,
    Member,
    UpdateGroupDTO,
} from "@/core/entities/member.entity";

export interface MembersRepository {

    /* Members */

    get_all(
        filters?: FindMembersFilter
    ): Promise<Member[]>;

    get_by_id(
        id: string
    ): Promise<Member | null>;

    get_by_ids(
    ids: string[]
): Promise<Member[]>;

    get_by_number(
        number: string
    ): Promise<Member | null>;

    save(
        member: CreateMemberDTO
    ): Promise<void>;

    update(
        member: Member
    ): Promise<void>;

    delete(
        id: string
    ): Promise<void>;

    delete_all(): Promise<void>;


    /* Groups */

    get_groups(): Promise<GroupWithMembers[]>;

    get_group_by_id(
        id: string
    ): Promise<Group | null>;

    get_group_by_name(
        name: string
    ): Promise<Group | null>;

    create_group(
        group: CreateGroupDTO
    ): Promise<void>;

    update_group(
        group: UpdateGroupDTO
    ): Promise<void>;

    delete_group(
        id: string
    ): Promise<void>;
}
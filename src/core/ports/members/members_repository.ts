import { CreateMemberDTO, FindMembersFilter, Member } from '@/core/entities/member.entity';

export interface MembersRepository {
  get_all(filters?: FindMembersFilter): Promise<Member[] | null>;
  get_by_id(id: string): Promise<Member | null>;
  get_by_number(number: string): Promise<Member | null>;
  save(member: CreateMemberDTO): Promise<void>;
  update(member: Member): Promise<void>;
  delete(id: string): Promise<void>;
  delete_all(): Promise<void>;
}
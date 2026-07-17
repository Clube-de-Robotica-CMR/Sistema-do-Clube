import { CreateMemberDTO, FindMembersFilter, Member, MemberField, MemberLevel } from '@/core/entities/member.entity';
import { DBError } from '@/core/errors/db-error';
import { MembersRepository } from '@/core/ports/members/members_repository';
import { db } from '@/infra/db/drizzle/client';
import { members_table } from '@/infra/db/schemas/members.schema';
import { eq, ilike, or, and, SQL } from 'drizzle-orm';

export class DrizzleMembersRepository implements MembersRepository {
  
  private mapToDomain(dbMember: any): Member {
    return {
      id: dbMember.id,
      war_name: dbMember.war_name,
      full_name: dbMember.full_name,
      number: dbMember.number,
      class: dbMember.class,
      phone: dbMember.phone ?? undefined,
      level: dbMember.level as MemberLevel,
      field: dbMember.field as MemberField,
      is_director: dbMember.is_director,
      created_at: dbMember.created_at,
      updated_at: dbMember.updated_at,
    };
  }

  async get_all(filters?: FindMembersFilter): Promise<Member[] | null> {
    const conditions = [];

    if (filters) {
      if (filters.search) {
        const searchPattern = `%${filters.search}%`;
        conditions.push(
          or(
            ilike(members_table.war_name, searchPattern),
            ilike(members_table.full_name, searchPattern),
            ilike(members_table.number, searchPattern),
            ilike(members_table.class, searchPattern)
          ) as SQL
        );
      }

      if (filters.class) conditions.push(eq(members_table.class, filters.class));
      if (filters.level) conditions.push(eq(members_table.level, filters.level));
      if (filters.field) conditions.push(eq(members_table.field, filters.field));
      if (filters.is_director !== undefined) conditions.push(eq(members_table.is_director, filters.is_director));
    }

    const query = db.select().from(members_table);
    
    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    const result = await query;
    if (!result[0]) return null

    return result.map(this.mapToDomain);
  }

  async get_by_id(id: string): Promise<Member | null> {
    const result = await db
        .select().from(members_table)
        .where(eq(members_table.id, id))
        .limit(1);
    
    if (!result[0]) return null;
    return this.mapToDomain(result[0]);
  }

  async get_by_number(number: string): Promise<Member | null> {
    const result = await db
        .select().from(members_table)
        .where(eq(members_table.number, number))
        .limit(1);

    if (!result[0]) return null;
    return this.mapToDomain(result[0]);
  }

  async save(member: CreateMemberDTO): Promise<void> {
    const result = await db
        .insert(members_table)
        .values(member)
        .returning();

    if (!result[0]) throw new DBError("Erro na criação de membro.")
  }

  async update(member: Member): Promise<void> {
    const result = await db
      .update(members_table)
      .set(member)
      .where(eq(members_table.id, member.id))
      .returning();

    if (!result[0]) throw new DBError("Erro ao tentar atualizar membro.");
  }

  async delete(id: string): Promise<void> {
    const result = await db
        .delete(members_table)
        .where(eq(members_table.id, id))
        .returning();

    if (!result[0]) throw new DBError("Erro ao tentar deletar membro.");
  }
}
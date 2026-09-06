import {
  CreateGroupDTO,
  CreateMemberDTO,
  FindMembersFilter,
  Group,
  GroupWithMembers,
  Member,
  MemberField,
  MemberLevel,
  UpdateGroupDTO,
} from "@/core/entities/member.entity";
import { DBError } from '@/core/errors/db-error';
import { MembersRepository } from '@/core/ports/members/members_repository';
import { db } from '@/infra/db/drizzle/client';
import { members_table, groups_table } from '@/infra/db/schemas/members.schema';
import {
  and,
  eq,
  ilike,
  inArray,
  isNull,
  or,
  SQL,
} from "drizzle-orm";

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

      group_id: dbMember.group_id ?? null,

      created_at: dbMember.created_at,
      updated_at: dbMember.updated_at,
    };
  }



  async get_all(filters?: FindMembersFilter): Promise<Member[]> {
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
      if (filters.group_id === null) conditions.push(isNull(members_table.group_id));
      else if (filters.group_id) conditions.push(eq(members_table.group_id, filters.group_id));
        
    }

    const query = db.select().from(members_table);

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    const result = await query;
    if (!result[0]) return []

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

  async get_by_ids(
    ids: string[]
): Promise<Member[]> {
    if (ids.length === 0) {
        return [];
    }

    const result = await db
        .select()
        .from(members_table)
        .where(
            inArray(
                members_table.id,
                ids
            )
        );

    return result.map(
        this.mapToDomain
    );
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

  async delete_all(): Promise<void> {
    const result = await db
      .delete(members_table)
      .returning();

    if (!result[0]) throw new DBError("Erro ao tentar deletar todos os membros.");
  }

  private mapGroupToDomain(
    dbGroup: any
  ): Group {
    return {
      id: dbGroup.id,
      name: dbGroup.name,
      created_at: dbGroup.created_at,
      updated_at: dbGroup.updated_at,
    };
  }

  async get_group_by_id(
    id: string
  ): Promise<Group | null> {
    const result = await db
      .select()
      .from(groups_table)
      .where(
        eq(groups_table.id, id)
      )
      .limit(1);

    if (!result[0]) {
      return null;
    }

    return this.mapGroupToDomain(
      result[0]
    );
  }

  async get_group_by_name(
    name: string
  ): Promise<Group | null> {
    const result = await db
      .select()
      .from(groups_table)
      .where(
        eq(groups_table.name, name)
      )
      .limit(1);

    if (!result[0]) {
      return null;
    }

    return this.mapGroupToDomain(
      result[0]
    );
  }

  async get_groups():
    Promise<GroupWithMembers[]> {
    const groups = await db
      .select()
      .from(groups_table);

    const members = await db
      .select()
      .from(members_table);

    return groups.map((group) => ({
      ...this.mapGroupToDomain(group),

      members: members
        .filter(
          (member) =>
            member.group_id === group.id
        )
        .map((member) =>
          this.mapToDomain(member)
        ),
    }));
  }

  async create_group(
    group: CreateGroupDTO
  ): Promise<void> {
    await db.transaction(async (tx) => {
      const created = await tx
        .insert(groups_table)
        .values({
          name: group.name,
        })
        .returning();

      const createdGroup = created[0];

      if (!createdGroup) {
        throw new DBError(
          "Erro ao criar grupo."
        );
      }

      if (group.member_ids.length === 0) {
        return;
      }

      await tx
        .update(members_table)
        .set({
          group_id: createdGroup.id,
          updated_at: new Date(),
        })
        .where(
          inArray(
            members_table.id,
            group.member_ids
          )
        );
    });
  }

  async update_group(
    group: UpdateGroupDTO
  ): Promise<void> {
    await db.transaction(async (tx) => {

      if (group.name !== undefined) {
        await tx
          .update(groups_table)
          .set({
            name: group.name,
            updated_at: new Date(),
          })
          .where(
            eq(
              groups_table.id,
              group.id
            )
          );
      }

      if (
        group.member_ids !== undefined
      ) {
        /*
         * Remove todos os membros
         * atualmente pertencentes ao grupo.
         */
        await tx
          .update(members_table)
          .set({
            group_id: null,
            updated_at: new Date(),
          })
          .where(
            eq(
              members_table.group_id,
              group.id
            )
          );

        /*
         * Define a nova composição.
         */
        if (
          group.member_ids.length > 0
        ) {
          await tx
            .update(members_table)
            .set({
              group_id: group.id,
              updated_at: new Date(),
            })
            .where(
              inArray(
                members_table.id,
                group.member_ids
              )
            );
        }
      }
    });
  }

  async delete_group(
    id: string
  ): Promise<void> {
    const result = await db
      .delete(groups_table)
      .where(
        eq(groups_table.id, id)
      )
      .returning();

    if (!result[0]) {
      throw new DBError(
        "Erro ao remover grupo."
      );
    }
  }
}
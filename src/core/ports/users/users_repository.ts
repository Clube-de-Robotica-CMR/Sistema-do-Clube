import { CreateUserDTO, UpdateUserDTO, User } from "../../entities/user.entity";

export interface UsersRepository {
    get_all(): Promise<User[] | undefined>
    get_by_name(name: string): Promise<User | undefined>
    get_by_id(id: string): Promise<User | undefined>
    save(user: CreateUserDTO): Promise<undefined>
    update(user: UpdateUserDTO): Promise<undefined>
    delete(id: string): Promise<undefined>
}
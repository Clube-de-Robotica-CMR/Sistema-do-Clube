import { CreateUserDTO, UpdateUserDTO, User } from "../../entities/user.entity";

export interface UsersRepository {
    get_all(): Promise<User[]>
    get_by_name(name: string): Promise<User | null>
    get_by_id(id: string): Promise<User | null>
    save(user: CreateUserDTO): Promise<void>
    update(user: User): Promise<void>
    delete(id: string): Promise<void>
}
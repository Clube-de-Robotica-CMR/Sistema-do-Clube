import { UsersRepository } from '../ports/users/users_repository';
import { HashService } from '../ports/auth/hash_service';
import { LoginUserDTO } from '../entities/user.entity';
import { AuthError } from '@supabase/supabase-js';

export const auth_user = async (
    input: LoginUserDTO,
    usersRepo: UsersRepository,
    hashService: HashService
) => {
    const user = await usersRepo.get_by_name(input.name);
    if (!user) throw new AuthError("Nome ou senha incorretos")

    const passwordMatch = await hashService.compare(input.password, user.password);
    if (!passwordMatch) throw new AuthError("Nome ou senha incorretos")

    return {
        id: user.id,
        name: user.name,
        role: user.role,
    };
};
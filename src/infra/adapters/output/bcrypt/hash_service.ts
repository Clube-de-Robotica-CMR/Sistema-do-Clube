import { HashService } from '@/core/ports/auth/hash_service';
import bcrypt from 'bcryptjs';

export class BcryptHashService implements HashService {
    async hash(plainText: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(plainText, salt);
    }

    async compare(plainText: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plainText, hash);
    }
}
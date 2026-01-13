import { PasswordHasher } from '@/lib/security/password-hasher';
import { usersTable } from './../../db/schema';
import { db } from "@/lib/db/db";

export interface CreateUserCommand {
    username: string;
    email: string;
    password: string;
}

export async function createUser(data: CreateUserCommand): Promise<number> {
    const hashedPassword = PasswordHasher.hash(data.password);

    const [user] = await db.insert(usersTable).values({
        name: data.username,
        email: data.email,
        password: hashedPassword,
    }).returning({ id: usersTable.id });

    return user.id;
}
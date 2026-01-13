import { PasswordHasher } from '@/lib/security/password-hasher';
import { usersTable, UsersTable } from './../../db/schema';
import { db } from "@/lib/db/db";

export interface CreateUserCommand {
    username: string;
    email: string;
    password: string;
}

export async function createUser(data: CreateUserCommand): Promise<void> {
    const hashedPassword = PasswordHasher.hash(data.password);

    const user: UsersTable = {
        id: 0,
        name: data.username,
        email: data.email,
        password: hashedPassword,
        createdAt: new Date(),
    }

    await db.insert(usersTable).values(user);

    // TODO: set cookies/tokens? idk
}
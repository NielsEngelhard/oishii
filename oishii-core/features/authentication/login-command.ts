import { PasswordHasher } from '@/lib/security/password-hasher';
import { usersTable } from './../../db/schema';
import { db } from "@/lib/db/db";
import { eq } from 'drizzle-orm';

export interface LoginCommand {
    email: string;
    password: string;
}

export async function login(data: LoginCommand): Promise<number> {
    const [result] = await db.select({ id: usersTable.id, password: usersTable.password })
                           .from(usersTable)
                           .where(eq(usersTable.email, data.email))
                           .limit(1);

    if (!result)
        throw new Error("User not found");

    const passwordsMatch = PasswordHasher.verify(data.password, result.password);

    if (!passwordsMatch)
        throw new Error("Invalid password");

    return result.id;
}
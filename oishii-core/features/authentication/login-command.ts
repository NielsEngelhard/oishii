import { PasswordHasher } from '@/lib/security/password-hasher';
import { usersTable } from './../../db/schema';
import { db } from "@/lib/db/db";
import { eq } from 'drizzle-orm';

export interface LoginCommand {
    email: string;
    password: string;
}

export async function login(data: LoginCommand): Promise<void> {
    const [result] = await db.select({ password: usersTable.password })
                           .from(usersTable)
                           .where(eq(usersTable.email, data.email))
                           .limit(1);

    if (!result)
        throw new Error("User not found");
    
    const passowrdsMatch = PasswordHasher.verify(data.password, result.password);

    if (!passowrdsMatch)
        throw new Error("Invalid password");

    // TODO set cookies/tokens idk
}
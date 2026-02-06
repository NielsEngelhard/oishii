import { UserPlan } from "@/db/schemas/enum/user-plan";

export interface AuthUser {
    id: number;
    email: string;
    name: string;
    language: string;
    plan: UserPlan;
}

export interface IAuthService {
    createSession(userId: number): Promise<string>; // returns session/token ID
    validateSession(sessionId: string): Promise<AuthUser | null>;
    invalidateSession(sessionId: string): Promise<void>;
    refreshSession(sessionId: string): Promise<string>;
}
import { UserPlan } from "@/db/schemas/enum/user-plan";

export interface IUserTeaser {
    id: number;
    name: string;
    aboutMe: string | null;
    totalRecipes: number;
    language: string;
    plan: UserPlan;
}

export interface IUserDetails {
    id: number;
    name: string;
    aboutMe: string | null;
    totalRecipes: number;
    totalFriends: number;
    createdAt: Date;
    isFriend: boolean;
    isCurrentUser: boolean;
    language: string;
    plan: UserPlan;
}

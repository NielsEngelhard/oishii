export interface IUserTeaser {
    id: number;
    name: string;
    aboutMe: string | null;
    totalRecipes: number;
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
}

export const LOGIN_ROUTE: string = "/login";
export const SIGNUP_ROUTE: string = "/login?sign-up";
export const PROFILE_ROUTE: string = "/profile";

export const RECIPE_DETAILS_ROUTE = (recipeId: string): string => `/recipe/${recipeId}`;
export const CREATE_RECIPE_ROUTE: string ="/recipe/create";
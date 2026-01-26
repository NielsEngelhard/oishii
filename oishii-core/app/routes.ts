export const HOME_LANDING_PAGE_ROUTE: string = "/";
export const ABOUT_ROUTE: string = "/about";

export const LOGIN_ROUTE: string = "/login";
export const SIGNUP_ROUTE: string = "/login?sign-up";
export const PROFILE_ROUTE: string = "/profile";

export const RECIPE_DETAILS_ROUTE = (slug: string): string => `/recipe/${slug}`;
export const CREATE_RECIPE_ROUTE: string = "/recipe/create";
export const EDIT_RECIPE_ROUTE = (slug: string): string => `/recipe/${slug}/edit`;

export const MY_RECIPES_ROUTE: string = "/recipes/my";

export const USER_PROFILE_ROUTE = (userId: string): string => `/user/${userId}`;
export const FRIENDS_ROUTE: string = "/friends";
export const EXPLORE_ROUTE: string = "/explore";
import { UserPlan } from "@/db/schemas/enum/user-plan";

export interface CurrentUserData {
  id: string;
  username: string;
  avatar?: string;
  language: string;
  plan: UserPlan;
}

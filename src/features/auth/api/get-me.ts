import { apiClient } from "@/lib/api-client";
import type { CurrentUser } from "../types";

// The signed-in user's application profile. The API client adds the Bearer token.
export function getMe(): Promise<CurrentUser> {
  return apiClient<CurrentUser>("/me");
}

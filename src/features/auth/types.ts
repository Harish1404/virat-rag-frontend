// Matches the backend's GET /me response (backend/app/routes/users.py → UserResponse).
export type CurrentUser = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: "user" | "admin";
  created_at: string;
  last_login: string | null;
};

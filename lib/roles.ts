export type UserRole = "pm" | "developer" | "client";

export interface OrchestraUser {
  id: string;
  role: UserRole;
  name: string;
  title: string;
  email: string;
  password: string;
  avatar: string;
}

export const MOCK_USERS: OrchestraUser[] = [
  {
    id: "u1",
    role: "pm",
    name: "Sarah Chen",
    title: "Project Manager",
    email: "sarah@acmecorp.com",
    password: "demo",
    avatar: "SC"
  },
  {
    id: "u2",
    role: "developer",
    name: "Mike Torres",
    title: "Senior Engineer",
    email: "mike@acmecorp.com",
    password: "demo",
    avatar: "MT"
  },
  {
    id: "u3",
    role: "client",
    name: "James Whitfield",
    title: "Director of Operations",
    email: "james@acmecorp.com",
    password: "demo",
    avatar: "JW"
  }
];

export function getUserFromStorage(): OrchestraUser | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem("orchestra_user");
    return stored ? (JSON.parse(stored) as OrchestraUser) : null;
  } catch {
    return null;
  }
}

export function setUserInStorage(user: OrchestraUser) {
  localStorage.setItem("orchestra_user", JSON.stringify(user));
}

export function clearUserFromStorage() {
  localStorage.removeItem("orchestra_user");
}

export function getRouteForRole(role: UserRole): string {
  switch (role) {
    case "pm":
      return "/pm/1-intake";
    case "developer":
      return "/dev";
    case "client":
      return "/client";
  }
}

export type MockUser = OrchestraUser;

export const roleRouteMap: Record<UserRole, string> = {
  pm: getRouteForRole("pm"),
  developer: getRouteForRole("developer"),
  client: getRouteForRole("client")
};

export function findUserByCredentials(email: string, password: string): OrchestraUser | null {
  const normalizedEmail = email.trim().toLowerCase();

  return (
    MOCK_USERS.find((user) => user.email.toLowerCase() === normalizedEmail && user.password === password) ?? null
  );
}

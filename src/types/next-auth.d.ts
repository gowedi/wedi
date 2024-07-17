import "next-auth";

export type Role = "USER" | "ADMIN"

declare module "next-auth" {
  export interface User {
    role: Role;
    userId: string;
    userToken: string;
    encryptionKey: string;
    challengeId?: string;
  }

  export interface Session {
    user: User  
  }
}

declare module "@auth/core/adapters" {
  export interface AdapterUser {
    role: Role
    userId: string;
    userToken: string;
    encryptionKey: string;
    challengeId?: string;
  }
}

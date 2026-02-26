import { UserRole } from "@prisma/client";

type User = {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    name: string;
    email: string;
    phone?: string | null;
    college?: string | null;
    registrationComplete: boolean;
    emailVerified: Date | null;
    image?: string | null;
    password?: string | null;
    role?: UserRole;
    year?: string | null;
    department?: string | null;
    verificationToken?: string | null;
    teamIds?: string[];
    pendingTeamIds?: string[];
    wishlistedEventIds?: string[];
    workshopIds?: string[];
    teams?: {
        id: string;
        name: string;
        eventSlug: string;
        event: {
            name: string;
            slug: string;
        };
    }[];
}

type SessionUser = {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: UserRole;
    emailVerified: Date | null;
    registrationComplete: boolean;
}



export type { User, SessionUser };

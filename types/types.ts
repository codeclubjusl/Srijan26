type User = {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    name: string;
    email: string;
    registrationComplete: boolean;
    emailVerified: Date | null;
    image?: string | null;
    password?: string | null;
    role?: string;
    year?: string | null;
    department?: string | null;
}

type SessionUser = {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: string;
    emailVerified: Date | null;
    registrationComplete: boolean;
}

type Event = {
    slug: string;
    id: string;
    name: string;
    minMembers: number;
    maxMembers: number;
}

type Team = {
    id: string;
    name: string;
    joiningCode: string;
    leader: string;
    members: User[];
    eventSlug: string;
    allowResetCode: boolean;
}

export type {User, SessionUser, Event, Team};
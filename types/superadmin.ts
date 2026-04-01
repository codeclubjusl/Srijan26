import type { AuthUser } from "@/services/AuthService";

type Campus = "JADAVPUR" | "SALT_LAKE";
type MerchandiseColor = "BLACK" | "WHITE";

interface SuperAdminDashboardProps {
    user: AuthUser;
}

interface UserData {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    college: string | null;
    department: string | null;
    year: string | null;
    role: string;
    emailVerified: Date | null;
    createdAt: Date;
}

interface MerchandiseData {
    id: string;
    size: string | null;
    color: MerchandiseColor | null;
    status: string | null;
    preferredCampus: Campus;
    customText: string | null;
    user: {
        name: string;
        email: string;
        phone: string | null;
        department: string | null;
        year: string | null;
    };
}

interface LiveEvent {
    id: string;
    slug: string;
    name: string;
    round: string;
    location: string;
}

interface EventDB {
    id: string;
    name: string;
    slug: string;
}

interface UserSearch {
    id: string;
    name: string;
    email: string;
    role: string;
}

export type {Campus, MerchandiseColor, SuperAdminDashboardProps, UserData, MerchandiseData, LiveEvent, EventDB, UserSearch}
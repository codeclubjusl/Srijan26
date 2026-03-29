import { checkAdminAuthorization } from "@/services/AuthService";
import { SuperAdminDashboard } from "@/components/admin/SuperAdminDashboard";
import { redirect } from "next/navigation";

export default async function SuperAdminPage() {
    const user = await checkAdminAuthorization();

    if (user.role !== "SUPERADMIN") {
        redirect("/admin");
    }

    return <SuperAdminDashboard user={user} />;
}
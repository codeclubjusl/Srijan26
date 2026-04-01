import { auth } from "@/auth";
import { getLiveEvents, addLiveEvent, removeLiveEvent } from "@/lib/liveEvents";

export async function GET() {
    const session = await auth();
    if (session?.user?.role !== "SUPERADMIN") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const events = await getLiveEvents();
        return Response.json(events);
    } catch (err) {
        console.error(err);
        return Response.json({ error: "Failed to fetch live events" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (session?.user?.role !== "SUPERADMIN") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { slug, name, round, location } = body;

        if (!slug || !name || !round || !location) {
            return Response.json({ error: "Missing fields" }, { status: 400 });
        }

        const newEvent = await addLiveEvent({ slug, name, round, location });
        return Response.json(newEvent);
    } catch (err) {
        console.error(err);
        return Response.json({ error: "Failed to add event" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (session?.user?.role !== "SUPERADMIN") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return Response.json({ error: "Missing id" }, { status: 400 });
        }

        await removeLiveEvent(id);
        return Response.json({ success: true });
    } catch (err) {
        console.error(err);
        return Response.json({ error: "Failed to remove event" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await auth();
    if (session?.user?.role !== "SUPERADMIN") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, slug, name, round, location } = body;

        if (!id || !slug || !name || !round || !location) {
            return Response.json({ error: "Missing fields" }, { status: 400 });
        }

        const { updateLiveEvent } = await import("@/lib/liveEvents");
        await updateLiveEvent({ id, slug, name, round, location });

        return Response.json({ success: true });
    } catch (err) {
        console.error(err);
        return Response.json({ error: "Failed to update event" }, { status: 500 });
    }
}

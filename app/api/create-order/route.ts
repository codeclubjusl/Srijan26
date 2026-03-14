import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createMerchandiseOrder } from "@/actions/merchandise";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({
                success: false,
                error: "Not authenticated"
            }, { status: 401 });
        }

        const body = await req.json();
        const { size, color, campus, customText, phone } = body;

        if (!size || !color || !campus || !phone) {
            return NextResponse.json({
                success: false,
                error: "Missing required fields"
            }, { status: 400 });
        }

        const amount = 349; // Securely set price on the server

        // Call the server action to create Cashfree order
        const result = await createMerchandiseOrder({
            amount,
            currency: "INR",
            merchandise: "SHIRT",
            size,
            color,
            campus,
            customText,
            phone,
            userId: session.user.id,
        });

        if (result.error) {
            return NextResponse.json({
                success: false,
                error: result.error
            }, { status: 400 });
        }

        if (!result.data) {
            return NextResponse.json({
                success: false,
                error: "Order creation failed - no data returned"
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: {
                orderId: result.data.orderId,
                paymentSessionId: result.data.paymentSessionId,
                amount: result.data.amount
            }
        });

    } catch (err) {
        console.error("Error creating merchandise order:", err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong"
        }, { status: 500 });
    }
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface PaymentConfig {
    createOrderApi: string;
    verifyOrderApi: string;
    successRedirect?: string;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

interface OrderResponse {
    success: boolean;
    data?: {
        orderId: string;
        paymentSessionId: string;
        amount: number;
    };
    error?: string;
}

interface CashfreeInstance {
    checkout(options: { paymentSessionId: string; redirectTarget: '_modal' | '_self' }): Promise<any>;
}

declare global {
    interface Window {
        Cashfree?: (config: { mode: 'sandbox' | 'production' }) => CashfreeInstance;
    }
}

export function usePayment(config: PaymentConfig) {
    const router = useRouter();
    const { data: session } = useSession();
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!document.querySelector('script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]')) {
            const script = document.createElement('script');
            script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
            script.onload = () => {
                setIsScriptLoaded(true);
                console.log('✅ Cashfree SDK loaded');
            };
            script.onerror = () => {
                console.error('❌ Failed to load Cashfree SDK');
            };
            document.head.appendChild(script);
        } else {
            setIsScriptLoaded(true);
        }
    }, []);

    const handlePayment = useCallback(async (payload: any) => {
        const CASHFREE_CLIENT_ID = process.env.NEXT_PUBLIC_CASHFREE_CLIENT_ID;

        // In production, we should check if script is loaded and Cashfree is on window
        if (!isScriptLoaded || typeof window === "undefined" || !window.Cashfree) {
            toast.error("Payment system is initializing. Please wait a moment.");
            return;
        }

        setIsLoading(true);

        try {
            // 1. Create order on backend
            const res = await fetch(config.createOrderApi, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result: OrderResponse = await res.json();

            if (!result.success || !result.data) {
                throw new Error(result.error || "Failed to create order");
            }

            const { orderId, paymentSessionId } = result.data;

            // 2. Initialize Cashfree
            const env = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || 'PRODUCTION';
            const mode = env === 'PRODUCTION' ? 'production' : 'sandbox';
            const cashfree = window.Cashfree({ mode });

            // 3. Open Cashfree Checkout Modal
            const checkoutOptions = {
                paymentSessionId: paymentSessionId,
                redirectTarget: "_modal" as const
            };

            const paymentResult = await cashfree.checkout(checkoutOptions);

            if (paymentResult.error) {
                throw new Error(paymentResult.error.message || "Payment cancelled or failed");
            }

            // 4. Verify payment on backend
            if (paymentResult.redirect || paymentResult.paymentDetails) {
                const verifyRes = await fetch(config.verifyOrderApi, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ order_id: orderId }),
                });

                const verifyResult = await verifyRes.json();

                if (verifyResult.success) {
                    toast.success("Payment successful!");
                    if (config.onSuccess) {
                        config.onSuccess(verifyResult);
                    } else {
                        router.push(config.successRedirect || "/dashboard");
                    }
                } else {
                    throw new Error(verifyResult.error || "Payment verification failed");
                }
            }

        } catch (err: any) {
            console.error("Payment Flow Error:", err);
            toast.error(err.message || "Something went wrong during payment.");
            if (config.onError) config.onError(err);
        } finally {
            setIsLoading(false);
        }
    }, [config, isScriptLoaded, router]);

    return {
        isReady: isScriptLoaded && !!session,
        isLoading,
        handlePayment,
    };
}
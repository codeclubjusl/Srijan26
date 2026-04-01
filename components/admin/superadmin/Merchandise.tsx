"use client";
import React, { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { downloadCSV } from "@/utils/downloadCSV";
import { MerchandiseData } from "@/types/superadmin";

function Merchandise() {
    const [merchandise, setMerchandise] = useState<MerchandiseData[]>([]);
    const [loadingMerch, setLoadingMerch] = useState(false);

    // Filters
    const [yearFilterValue, setYearFilterValue] = useState<string>("");
    const [yearFilterOperator, setYearFilterOperator] = useState<"gt" | "lt">(
        "gt",
    );
    const [merchCampusFilter, setMerchCampusFilter] = useState<string>("all");
    const [merchColorFilter, setMerchColorFilter] = useState<string>("BLACK");
    
    useEffect(() => {
        fetchMerchandise();
    }, []);

    async function fetchMerchandise() {
        setLoadingMerch(true);
        try {
            const res = await fetch("/api/superadmin/merchandise");
            if (res.ok) {
                const data = await res.json();
                setMerchandise(data);
            }
        } catch (error) {
            console.error("Failed to fetch merchandise", error);
        } finally {
            setLoadingMerch(false);
        }
    }

    const filteredMerchandise = merchandise.filter((item) => {
        // Year Filter
        if (yearFilterValue) {
            const itemYear = parseInt(item.user.year || "0");
            const filterYear = parseInt(yearFilterValue);

            if (!isNaN(itemYear) && !isNaN(filterYear)) {
                if (yearFilterOperator === "gt" && itemYear <= filterYear)
                    return false;
                if (yearFilterOperator === "lt" && itemYear >= filterYear)
                    return false;
            }
        }

        // Campus Filter
        if (
            merchCampusFilter !== "all" &&
            item.preferredCampus !== merchCampusFilter
        ) {
            return false;
        }

        // Color Filter
        if (merchColorFilter !== "all" && item.color !== merchColorFilter) {
            return false;
        }

        return true;
    });

    const exportMerchandise = () => {
        if (!filteredMerchandise.length) return;
        const headers = [
            "Order ID",
            "User Name",
            "Email",
            "Phone",
            "Department",
            "Year",
            "Size",
            "Color",
            "Campus",
            "Custom Text",
            "Status",
        ];
        const rows = filteredMerchandise.map((m) => [
            m.id,
            m.user.name,
            m.user.email,
            m.user.phone || "",
            m.user.department || "",
            m.user.year || "",
            m.size || "",
            m.color || "",
            m.preferredCampus,
            m.customText || "",
            m.status || "",
        ]);

        downloadCSV(headers, rows, "merchandise-orders.csv");
    };

    return (
        <TabsContent value="merchandise" className="space-y-4">
            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Merchandise Orders</CardTitle>
                            <CardDescription>
                                Total orders: {merchandise.length} | Showing:{" "}
                                {filteredMerchandise.length}
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={exportMerchandise}
                                className="bg-slate-100 hover:bg-yellow transition-colors duration-200 text-black"
                            >
                                <Download className="mr-2 h-4 w-4" /> Export CSV
                            </Button>
                        </div>
                    </div>
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                        <div className="flex gap-2 col-span-2">
                            <Select
                                value={yearFilterOperator}
                                onValueChange={(v: "gt" | "lt") =>
                                    setYearFilterOperator(v)
                                }
                            >
                                <SelectTrigger className="w-[140px] bg-white text-slate-900 border-slate-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-900">
                                    <SelectItem
                                        value="gt"
                                        className="text-slate-900 focus:bg-slate-100 focus:text-slate-900"
                                    >
                                        Greater Than
                                    </SelectItem>
                                    <SelectItem
                                        value="lt"
                                        className="text-slate-900 focus:bg-slate-100 focus:text-slate-900"
                                    >
                                        Less Than
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder="Year (e.g. 2026)"
                                value={yearFilterValue}
                                onChange={(e) =>
                                    setYearFilterValue(e.target.value)
                                }
                                className="flex-1 bg-white text-slate-900 border-slate-200 placeholder:text-slate-400"
                            />
                        </div>

                        <Select
                            value={merchCampusFilter}
                            onValueChange={setMerchCampusFilter}
                        >
                            <SelectTrigger className="bg-white text-slate-900 border-slate-200">
                                <SelectValue placeholder="Filter by Campus" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-900">
                                <SelectItem
                                    value="all"
                                    className="text-slate-900 focus:bg-slate-100 focus:text-slate-900"
                                >
                                    All Campuses
                                </SelectItem>
                                <SelectItem
                                    value="JADAVPUR"
                                    className="text-slate-900 focus:bg-slate-100 focus:text-slate-900"
                                >
                                    Jadavpur
                                </SelectItem>
                                <SelectItem
                                    value="SALT_LAKE"
                                    className="text-slate-900 focus:bg-slate-100 focus:text-slate-900"
                                >
                                    Salt Lake
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={merchColorFilter}
                            onValueChange={setMerchColorFilter}
                        >
                            <SelectTrigger className="bg-white text-slate-900 border-slate-200">
                                <SelectValue placeholder="Filter by Color" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-900">
                                <SelectItem
                                    value="all"
                                    className="text-slate-900 focus:bg-slate-100 focus:text-slate-900"
                                >
                                    All Colors
                                </SelectItem>
                                <SelectItem
                                    value="BLACK"
                                    className="text-slate-900 focus:bg-slate-100 focus:text-slate-900"
                                >
                                    Black
                                </SelectItem>
                                <SelectItem
                                    value="WHITE"
                                    className="text-slate-900 focus:bg-slate-100 focus:text-slate-900"
                                >
                                    White
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingMerch ? (
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    ) : (
                        <div className="rounded-md border border-slate-200 overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Dept / Year</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead>Color</TableHead>
                                        <TableHead>Campus</TableHead>
                                        <TableHead>Custom Text</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMerchandise.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={9}
                                                className="text-center py-8 text-slate-200"
                                            >
                                                No orders found matching
                                                filters.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredMerchandise.map((m) => (
                                            <TableRow key={m.id}>
                                                <TableCell className="font-mono text-xs">
                                                    {m.id.slice(-6)}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {m.user.name}
                                                </TableCell>
                                                <TableCell>
                                                    {m.user.email}
                                                </TableCell>
                                                <TableCell>
                                                    {m.user.phone || "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {m.user.department || "-"} /{" "}
                                                    {m.user.year || "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {m.size || "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {m.color === "BLACK" && (
                                                        <Badge className="bg-black text-white hover:bg-black">
                                                            Black
                                                        </Badge>
                                                    )}
                                                    {m.color === "WHITE" && (
                                                        <Badge className="bg-slate-100 text-slate-900 border border-slate-300 hover:bg-slate-100">
                                                            White
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {m.preferredCampus}
                                                </TableCell>
                                                <TableCell className="italic text-yellow">
                                                    {m.customText || "-"}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
    );
}

export default Merchandise;

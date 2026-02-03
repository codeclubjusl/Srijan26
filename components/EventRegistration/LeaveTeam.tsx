"use client";

import { useConfirmationDialogContext } from "@/hooks/useConfirmationDialog";
import { leaveTeam } from "@/services/EventsService";
import { Team } from "@/types/types";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

function LeaveTeam({ team, id }: { team: Team; id: string }) {
    const modalContext = useConfirmationDialogContext();
    const router = useRouter();

    const handleLeaveTeam = () => {
        modalContext.showDialog("Are you sure you want to leave this team?", () => {
            leaveTeam(team, id)
            .then(res => {
                if(res.ok){
                    toast.success(res.message);
                    router.refresh();
                }else{
                    toast.error(res.message);
                }
            })
        });
    };
    return (
        <div className="p-4 border-t border-t-gray-200/30 w-full grid place-items-center">
            <button
                className="cursor-pointer rounded-sm border border-white/20 bg-black/80 px-2 py-1 text-sm transition-colors duration-200 hover:border-white/40 active:border-white/60"
                onClick={() => handleLeaveTeam()}
            >
                Leave Team
            </button>
        </div>
    );
}

export default LeaveTeam;

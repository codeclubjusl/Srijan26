"use client";

import { useConfirmationDialogContext } from "@/hooks/useConfirmationDialog";
import { deleteTeam, resetJoiningCode } from "@/services/EventsService";
import { Event, Team } from "@/types/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

function TeamControls({ team, event }: { team: Team; event: Event }) {
  const [resettingCode, setResettingCode] = useState(false);
  const modalContext = useConfirmationDialogContext();
  const router = useRouter();

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(team.joiningCode)
      .then(() => toast.success("Copied Joining Code"));
  };

  // TODO: complete this with lock option or add pending state
  /* const handleCompleteRegistration = () => { // add confirmation dialogue before calling the completeRegistration function
    completeRegistration(team, event)
      .then(() => alert("Registration complete!")) // replace with react hot toast, also change status
      .catch((err: Error) => console.error(err));
  }; */

  const handleResetCode = () => {
    setResettingCode(true);
    modalContext.showDialog(
      "Are you sure you want to reset the code? You can only perform this once",
      () => {
        resetJoiningCode(team)
        .then((res) => {
          if (res.ok && res.code) {
            toast.success("Code reset successfully");
            router.refresh();
          } else toast.error("Error occurred while resetting code");
        })
      },
    );
    setResettingCode(false);
  };

  const handleDeleteTeam = () => {
    modalContext.showDialog("Are you sure you want to delete this team?", () => {
      deleteTeam(team)
      .then(res => {
        if(res.ok){
          toast.success(res.message);
          router.refresh();
        }else{
          toast.error(res.message);
        }
      })
    })
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* <button
        className="rounded-xs bg-white px-2 py-1 text-black transition-colors duration-300 hover:bg-white/90 active:bg-white/60"
        onClick={() => handleCompleteRegistration()}
      >
        Confirm Registration
      </button> */}
      <div className="flex flex-col items-center gap-4 border-t border-b border-gray-200/30 p-4">
        <p>Team Joining Code</p>
        <div className="flex w-fit items-center justify-between gap-12 rounded-sm bg-gray-200/10 py-1.5 pr-2 pl-4 text-center">
          <span>{team.joiningCode}</span>
          <button
            className="cursor-pointer rounded-sm border border-white/20 bg-black/80 px-2 py-1 text-sm transition-colors duration-200 hover:border-white/40 active:border-white/60"
            onClick={() => handleCopyCode()}
          >
            Copy
          </button>
        </div>
        {team.allowResetCode && (
          <button
            className="rounded-xs bg-white px-2 py-1 text-sm text-black transition-colors duration-300 hover:bg-white/90 active:bg-white/60"
            onClick={() => handleResetCode()}
            disabled={resettingCode}
          >
            Reset Joining Code
          </button>
        )}
        {team.allowResetCode && (
          <p className="w-2/3 text-center text-sm">
            Shared the code with the wrong person? Get a new one by resetting
            it.
          </p>
        )}
      </div>
      <button className="rounded-xs bg-white px-2 py-1 text-sm text-black transition-colors duration-300 hover:bg-white/90 active:bg-white/60"
      onClick={() => handleDeleteTeam()}>
        Delete Team
      </button>
    </div>
  );
}

export default TeamControls;

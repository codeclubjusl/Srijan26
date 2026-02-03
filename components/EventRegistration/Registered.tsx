import { Event, SessionUser, Team } from "@/types/types";
import React from "react";
import TeamControls from "./TeamControls";
import NotRegistered from "./NotRegistered";
import MemberControls from "./MemberControls";
import LeaveTeam from "./LeaveTeam";

function Registered({
  user,
  event,
  team,
}: {
  user: SessionUser;
  event: Event;
  team: Team | null;
}) {
  if (!team) return <NotRegistered user={user} event={event} />;
  const isTeamLead = team.leader === user.id;

  let status: string;
  if(team.members.length === event.maxMembers) status = "Team full";
  else if(team.members.length >= event.minMembers) status = "Valid";
  else status = "Not enough members";

  return (
    <div className="font-jetbrains-mono flex flex-col items-center gap-8 p-12">
      <h1 className="text-4xl font-semibold">{event.name} Registration</h1>
      <div className="flex w-full justify-around">
        <div className="flex w-2/3 flex-col items-center">
          <h4 className="mb-4 text-lg font-bold">Team: {team?.name}</h4>
          <div className="flex w-3/4 justify-between rounded-t-sm border-b border-gray-300/30 bg-gray-600/30 px-4 py-2 transition-colors duration-300">
            <p>Name</p>
            <p>Email</p>
          </div>
          {team?.members.map((member) => (
            <div
              key={member.id}
              className="grid w-3/4 grid-cols-2 gap-y-2 border-b border-gray-300/30 px-4 py-2 transition-colors duration-300 hover:bg-gray-400/10"
            >
              <p>
                {member.name} {member.id === team.leader && "(Team Lead)"}
              </p>
              <p className="justify-self-end">{member.email}</p>
              {isTeamLead && member.id !== team.leader && <MemberControls memberId={member.id!} team={team} />}
            </div>
          ))}
        </div>
        <div className="flex w-1/3 flex-col items-center gap-3">
          <h3
            className={`rounded-xs border ${status === "Not enough members" ? "border-amber-500 bg-amber-500/30" : "border-green-500 bg-green-500/30"} px-2 py-1`}
          >
            Status: {status}
          </h3>
          <p>
            Allowed Team Size: {event.minMembers} - {event.maxMembers} members
          </p>
          <p>Current Team Size: {team?.members.length}</p>
          {isTeamLead ? <TeamControls team={team} event={event} /> : <LeaveTeam team={team} id={user.id} />}
        </div>
      </div>
    </div>
  );
}

export default Registered;

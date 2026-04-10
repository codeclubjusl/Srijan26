import { Category, EventStatus } from "@/components/events/types/events";

export const CLIP_PATH = "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, calc(100% - 50px) 100%, 30px 100%, 0px 15px)";
export const IMAGE_CLIP_PATH = "polygon(40px 0%, 100% 0%, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0% 100%, 0% 40px)";
export const CARD_OUTLINE_DIMENSIONS = { w: 334.4, h: 418 };
export const CARD_DIMENSIONS = { w: 322.4, h: 403 };

export const CATEGORIES: Category[] = [
  "All",
  "Coding",
  "Circuits and Robotics",
  "Business",
  "Brainstorming",
  "Esports",
  "Misc",
];

export const STATUSES: EventStatus[] = ["All", "Open", "Closed"];
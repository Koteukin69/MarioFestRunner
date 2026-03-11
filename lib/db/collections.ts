import {getCollection} from "@/lib/db/mongodb";

export const usersCollection = getCollection<{
  name: string,
  coins: number,
  gameSession?: { seed: number, createdAt: Date },
}>("users");

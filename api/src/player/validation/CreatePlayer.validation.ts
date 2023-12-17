import { z } from "zod";

export const CreatePlayerValidation = z.object({
  groupId: z.string().uuid().nullable(),
  userId: z.string().uuid().nullable(),
  name: z.string(),
  tank: z.boolean(),
  healer: z.boolean(),
  dps: z.boolean(),
  locked: z.boolean(),
  inTheRoll: z.boolean(),
});

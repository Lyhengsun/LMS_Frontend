import z from "zod";

export const updateProfileSchema = z.object({
  bio: z.string().trim(),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^0\d{8,9}$/, "Invalid Cambodia Phone Number format. Ex: 012345678"),
});

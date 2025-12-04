import z from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(5, "Min 5 chars"),
  description: z.string().optional(),
});


const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(5, "Min 5 chars"),
});

export {RegisterSchema, LoginSchema};
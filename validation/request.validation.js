import { z } from 'zod'

export const signupPostRequestSchema = z.object({
    firstName: z.string(),
    lastName: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})

export const loginPostRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})

export const shortenUrlPostRequestBodySchema = z.object({
    url: z.string().url(),
    code: z.string().optional(),
})
import z from "zod"

export const createInterview = z.object({
    jobRole : z.string().optional(),
    jobDescription : z.string().optional(),
    resume : z.any()
})
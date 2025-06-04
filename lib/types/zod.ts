import z from "zod"

export const createInterview = z.object({
    jobRole : z.string(),
    jobDescription : z.string(),
    resume : z.any()
})
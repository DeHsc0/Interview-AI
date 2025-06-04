import { Role } from "../generated/prisma"

export {}

declare global {

    interface UserUnsafeMetadata {
        role : Role
        companyName ?: string 
        description ?: string
        socialMedia : {
            x ?: string 
            github ?: string 
            linkedin ?: string
        }
    }
}
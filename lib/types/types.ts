export interface LoginData {
    email : string
    password : string   
}

export enum Role {
    hr, 
    candidate
}

export interface SignupData {
    firstName : string
    lastName : string
    email : string
    password : string
    role : "hr" | "candidate"
    companyName ?: string 
    socialMedia ?: {
        x ?: string
        linkedin ?: string
        github ?: string
    }
    description ?: string
}
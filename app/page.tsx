"use client"

import { SignOutButton , SignInButton , SignUpButton } from "@clerk/nextjs"
import { useAuth } from "@clerk/nextjs"


export default function TESTPage() {

    const {isSignedIn} = useAuth()

    return (
        <div className="space-x-12">
            <SignOutButton></SignOutButton>
            <SignInButton></SignInButton>
            <SignUpButton></SignUpButton>
        </div>
    )
}
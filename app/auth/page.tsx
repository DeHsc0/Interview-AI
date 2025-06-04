"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { useSignIn , useSignUp , useClerk , useAuth} from "@clerk/nextjs"
import { LoginData, SignupData } from "@/lib/types/types"
import { Loader2} from "lucide-react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { toast, Toaster } from "sonner"

export default function TESTPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("login")
  const [role, setRole] = useState("candidate")
  const [userData , setUserData] = useState<undefined | LoginData | SignupData>()   
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState('')
  const [ verifyLoading , setVerifyLoading] = useState(false)
  const { signUp , isLoaded , setActive } = useSignUp() 
  const [ authLoading , setAuthLoading] = useState(false)
  const { signIn } = useSignIn()

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "signup") {
      setActiveTab("signup")
    }
  }, [searchParams])

  useEffect(() => {
   
    setUserData({...userData , socialMedia : undefined , companyName : undefined , description : undefined} as SignupData)
    
  } , [role])

  const handleGoogleOauth = () => {
    if(signIn){
        return signIn
          .authenticateWithRedirect({
            strategy : "oauth_google",
            redirectUrl: '/sign-in/sso-callback',
            redirectUrlComplete: '/dashboard',
          })
          .then((res) => {
            console.log(res)
          })
          .catch((err: any) => {
            console.log(err.errors)
            console.error(err, null, 2)
          })
    }
  }
  
  const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        
        if(!userData){
            toast("Missing Feilds", {
                description: "Please fill in the missing feilds"
                })
            return 
        }

        const data : LoginData = userData as LoginData
        setAuthLoading(true)
        try{
            const signInAttempt = await signIn?.create({
                identifier : data.email,
                password : data.password

            })

            if (signInAttempt && signInAttempt.status === 'complete' && setActive) {
                await setActive({ session: signInAttempt.createdSessionId })
                router.push('/')
              } else {
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
            
        } 
        catch(e : any){
            setAuthLoading(false)
            toast(e.errors[0].longMessage)
    }  
    
  }
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isLoaded) return

    setVerifyLoading(true)

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.push('/dashboard')
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2))
      }
    } catch (e: any) {     
        setAuthLoading(false)   
        toast("Missing Feilds" , {
            description : e.errors[0].longMessage
        })
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    if(!userData){
        toast("Missing Feilds", {
            description: "Please fill in the missing feilds"
            })
        return 
    }

    let data : SignupData = userData as SignupData

    if(data.role === "candidate"){                
        data.companyName = undefined        
    } else if (data.role == "hr" && !data.companyName){
        toast("Please provide the Company Name")
    }

    setAuthLoading(true)
    e.preventDefault()
    try{
        await signUp?.create({
            emailAddress : data.email, 
            firstName : data.firstName, 
            password : data.password,
            lastName : data.lastName , 
            unsafeMetadata : { 
                role : role,
                companyName : data.companyName,
                socialMedia : data.socialMedia,
                description : data.description,
            }
        })
        await signUp?.prepareEmailAddressVerification({
            strategy : "email_code"
        })

        setVerifying(true)

    } 
    catch(e : any){
        setAuthLoading(false)
        toast(e.errors[0].longMessage)
}

  }

  return (
    <div className="w-full h-screen  flex justify-center items-center">
        <Toaster theme="dark" />
        {verifying ? <div className=" fixed w-screen h-screen flex justify-center items-center backdrop-blur-lg">
      <Card className="absolute flex  items-center w-[350px]">
        <CardTitle >Verify your Email</CardTitle>                
        <CardDescription >Enter your verification code</CardDescription>
        <CardContent>
        <InputOTP onChange={(e) => setCode( () => e)} value={code} maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <div className="flex w-full justify-between mt-6">
            <Button variant={"secondary"} onClick={() => setCode("")}>
              Cancel
            </Button>
            <Button size={"default"} variant={"default"} onClick={handleVerify}>
              {verifyLoading ? <Loader2 className="animate-spin"></Loader2> : "Submit"}
            </Button>
        </div>
        </CardContent>
      </Card>
    </div> : undefined}
        <div>
            <Card className="w-fit">
                <CardHeader>
                    <CardTitle className="text-center text-lg">{activeTab === "login" ? "Welcome back" : "Create an account"}</CardTitle>
                    <CardDescription className="text-center">{activeTab === "login"
                ? "Enter your credentials to sign in to your account"
                : "Enter your information to create an account"}</CardDescription>
                </CardHeader>
                <CardContent className="">
                    <Tabs defaultValue={activeTab} className="">
                        <TabsList className="w-[350px]">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>
                        <TabsContent className="flex mt-1 justify-center flex-col" value="login">
                            <form>
                                <div className="grid items-center gap-4">
                                    <div className="flex flex-col space-y-3">
                                        <Label htmlFor="email" className="text-md">Email</Label>
                                        <Input id="email" type="email"  onChange={(e) => setUserData({...userData , email : e.currentTarget.value} as LoginData)} className="w-[350px]" placeholder="johncarter@domain.com" />
                                    </div>
                                    <div className="flex flex-col space-y-3">
                                        <Label htmlFor="password" className="text-md">Password</Label>
                                        <Input id="password"  onChange={(e) => setUserData({...userData , password : e.currentTarget.value} as LoginData)} className="w-[350px]" placeholder="johnCarter!32@4" />
                                    </div>
                                    <Button type="submit" className="space-y-3" onClick={handleLogin}>
                                        {authLoading ? <Loader2 className="animate-spin" ></Loader2> : "Create Account"}
                                    </Button>
                                </div>
                            </form>
                            <div className={`w-[350px] flex flex-col ${verifying ? "blur-3xl" : ""}`}>
                                <div className="mt-4 relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <Separator className="w-full" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="px-2 text-muted-foreground">Or continue with</span>
                                    </div>
                                </div>
                                <Button onClick={handleGoogleOauth} variant="secondary" className="mt-3.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                        <path fill="none" d="M1 1h22v22H1z" />
                                    </svg>
                                    Continue with Google
                                </Button>
                                <p className="px-8 text-center text-sm text-muted-foreground w-[350px] mt-3">
                                    By clicking continue, you agree to our{" "}
                                    <Link href="#" className="underline underline-offset-4 hover:text-primary">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="#" className="underline underline-offset-4 hover:text-primary">
                                        Privacy Policy
                                    </Link>
                                    .
                                </p>
                            </div>
                        </TabsContent>
                        <TabsContent className="flex mt-1 justify-center flex-col" value="signup">
                            <form>
                                <div className="grid items-center gap-2.5">
                                    <div className="flex flex-row justify-between">
                                        <div className="flex space-y-3 flex-col">
                                            <Label htmlFor="firstName" className="text-md" >First Name</Label>
                                            <Input placeholder="John" id="firstName" required className="w-[160px]" onChange={(e) => setUserData({...userData , firstName : e.currentTarget.value} as SignupData)}/>
                                        </div>                                    
                                        <div className="flex space-y-3 flex-col">
                                            <Label htmlFor="lastName" className="text-md" >Last Name</Label>
                                            <Input id="lastName" placeholder="Carter" required className="w-[160px]" onChange={(e) => setUserData({...userData , lastName : e.currentTarget.value} as SignupData)}/>
                                        </div>                                    
                                    </div>
                                    <div className="flex flex-col space-y-3">
                                        <Label htmlFor="email" className="text-md">Email</Label>
                                        <Input id="email" type="email" required className="w-[350px]" placeholder="johncarter@domain.com" onChange={(e) => setUserData({...userData , email : e.currentTarget.value} as SignupData)} />
                                    </div>
                                    <div className="flex flex-col space-y-3">
                                        <Label htmlFor="password" className="text-md">Password</Label>
                                        <Input id="password" type="password" required className="w-[350px]" placeholder="johnCarter!32@4" onChange={(e) => setUserData({...userData , password : e.currentTarget.value} as SignupData)}/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-md">You want to sign up as</Label>
                                        <RadioGroup defaultValue="candidate" className="flex flex-row" onValueChange={setRole}>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="candidate" id="candidate" />
                                                <Label htmlFor="candidate">Candidate</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="hr" id="hr" />
                                                <Label htmlFor="hr">HR</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div className={`space-y-2 ${role != "hr" ? "cursor-not-allowed hidden" : ""} `}>
                                            <Label htmlFor="companyName" className={`text-md `}>Company Name</Label>
                                            <Input onChange={(e) => setUserData({...userData , companyName : e.currentTarget.value} as SignupData)} id="companyName"required/>
                                    </div>   
                                    <div className={`space-y-2 ${role != "hr" ? "cursor-not-allowed" : "hidden"} `}>
                                            <Label htmlFor="x" className={`text-md `}>X</Label>
                                            <Input placeholder="https://x.com/your-handle" onChange={(e) => setUserData({...userData , socialMedia : { ...(userData as SignupData).socialMedia, x : e.currentTarget.value}} as SignupData)} id="x"required/>
                                    </div>   
                                    <div className={`space-y-2 ${role != "hr" ? "cursor-not-allowed" : "hidden"} `}>
                                            <Label htmlFor="github" className={`text-md `}>GitHub</Label>
                                            <Input placeholder="https://github.com/your-username" onChange={(e) => setUserData({...userData , socialMedia : { ...(userData as SignupData).socialMedia ,github : e.currentTarget.value}} as SignupData)} id="github"required/>
                                    </div>   
                                    <div className={`space-y-2 ${role != "hr" ? "cursor-not-allowed" : "hidden"} `}>
                                            <Label htmlFor="linkedin" className={`text-md `}>Linkedin</Label>
                                            <Input placeholder="https://www.linkedin.com/in/your-profile" onChange={(e) => setUserData({...userData , socialMedia : {...(userData as SignupData).socialMedia , linkedin : e.currentTarget.value}} as SignupData)} id="linkedin"required/>
                                    </div>   
                                    <div className={`space-y-2 ${role != "hr" ? "cursor-not-allowed" : "hidden"} `}>
                                            <Label htmlFor="description" className={`text-md `}>What best describes you?</Label>
                                            <Input placeholder="e.g., Software Engineer, Frontend Developer" onChange={(e) => setUserData({...userData , description : e.currentTarget.value} as SignupData)} id="description"required/>
                                    </div>   
                                    <div id="clerk-captcha" className="">
                                    </div>                                                            
                                    <Button
                                        type="button" 
                                        onClick={handleSignup}
                                    >
                                        {authLoading ? <Loader2 className="animate-spin" ></Loader2> : "Create Account"}
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
"use client"

import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { z } from "zod"
import { createInterview } from "@/lib/types/zod";
import { Textarea } from "./ui/textarea";
import { FormEventHandler, useEffect, useState } from "react";
import { toast, Toaster } from "sonner"
import axios from "axios";
import { useAuth } from "@clerk/nextjs";


export  function HrDashboard () {

    const { userId } = useAuth()

    useEffect(() => {
        if(!userId)return // TODO: Add a loader
    } , [userId])

    const form = useForm<z.infer<typeof createInterview >>({
        resolver : zodResolver(createInterview),
        defaultValues : {
            jobRole : "",
            jobDescription : "",
            resume : undefined
        }
    })

    const handleSubmit = async (data : z.infer<typeof createInterview>) => { 

        if( !data.jobRole || !data.resume || !userId){ 
            toast("Missing Values")
            return
        }

        const formData = new FormData()

        formData.append("resume" , data.resume)
        formData.append("jobDescription" , data.jobDescription || "")
        formData.append("jobRole" , data.jobRole)
        formData.append("userId" , userId)            

        try{
            const response = await axios.post("/api/interview" , formData)

            if(response.status === 400){
                return toast((response.data as any).message)
            }

        }
        catch(e : any){
            return toast(e.response.data.message)
        }

    } 

    return (
        <>
            <Toaster theme="dark" />
            <div className="mt-3 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-[16px] text-[#A1A1AA]">Manage your Interviews and candidates.</p>
                </div>
                <Dialog>
                            <DialogTrigger asChild>
                                <Button className="items-center flex " size={"lg"}>
                                    <Plus></Plus>
                                    Create Interviews
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="bg-[#111111]">
                                <DialogHeader>
                                    <DialogTitle>Create New Interview</DialogTitle>
                                    <DialogDescription>
                                    Set up an interview for a candidate. You'll get a link to share with them.
                                    </DialogDescription>
                                </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSubmit)}>
                                <FormField  control={form.control}
                                name="jobRole"
                                render={({field}) => {
                                    return (
                                        <FormItem className="mt-3 space-y-2">
                                            <FormLabel className="">
                                                Job Role
                                            </FormLabel>
                                            <FormControl>
                                                <Input required placeholder="Frontend Developer" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )
                                }}>                                 
                                </FormField>
                                <FormField  control={form.control}
                                name="jobDescription"
                                render={({field})  => {
                                    return (
                                        <FormItem className="mt-3 space-y-2">
                                            <FormLabel className="">
                                                Additional Description ( Optional )
                                            </FormLabel>
                                            <FormControl>
                                               <Textarea {...field} placeholder="Add any specific details about the position or interview "/> 
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )
                                }}>                                 
                                </FormField>
                                <FormField  control={form.control}
                                name="resume"
                                render={({field : {onChange , value , ...field}})  => {
                                    return (
                                        <FormItem className="mt-3 space-y-2">
                                            <FormLabel className="">
                                                Upload Candidate CV
                                            </FormLabel>
                                            <FormControl>
                                                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2">
                                                    <Upload className="h-10 w-10 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground">
                                                    Drag & drop your file here or click to browse
                                                    </p>
                                                    <Input
                                                        required
                                                        type="file"
                                                        id="cv-upload"
                                                        className="mt-2"
                                                        accept=".pdf"
                                                        onChange={(e) => {
                                                            onChange(e.target.files?.[0]);
                                                        }}
                                                    />                                                 
                                                </div>
                                                </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )
                                }}>                                 
                                </FormField>
                                <div className="space-x-4 justify-end flex mt-4">
                                <DialogClose asChild>
                                    <Button variant={"secondary"} >Cancel</Button>
                                </DialogClose>
                                    <Button type="submit">Create</Button>
                                </div>
                                </form>
                            </Form>
                            </DialogContent>
                
                </Dialog>
            </div>
        </>
    )


}
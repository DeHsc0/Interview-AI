
import { ai, openai } from "@/lib/ai";
import { interviewCreation } from "@/lib/types/types";
import { NextRequest } from "next/server";
import { extractText, getDocumentProxy } from 'unpdf'
import {zodResponseFormat} from "openai/helpers/zod"
import { z } from "zod";
import prisma from "@/lib/prisma/prisma";

export async function POST (req : NextRequest) {
        
    try {
        
        const formData = await req.formData();
        
        const jobRole = formData.get("jobRole")?.toString();
        const userId = formData.get("userId")?.toString();
        const jobDescription = formData.get("jobDescription")?.toString();
        const resume = formData.get("resume") as File 
        
        
        if (!jobRole || !userId || !resume || resume.type != "application/pdf") {
            return new Response(JSON.stringify(
                { message : "Missing required fields" },                 
            ), {status : 400}
        );
    }
    
    const bytes = await resume.arrayBuffer()
    
    const pdf = await getDocumentProxy(new Uint8Array(bytes))
    
    const {text} = await extractText(pdf , {mergePages : true})

    const response = await openai.chat.completions.create({
        model : "gemini-2.0-flash",
        response_format : zodResponseFormat(
            z.object({
                isResume : z.boolean(),
                summary : z.string(),
                score : z.number()
            }) , "res"
        ), 
        messages : [{
            role : "system",
            content : `Context:
            Here is the text extracted from a PDF that contains the resume of the candidate the user is considering for hiring.

            Input Instructions:
            You will receive the following object:

            {
            "jobRole": "The role for which the user is hiring",
            "jobDescription": "Additional information about the job (can be undefined)",
            "resume": "Text extracted from the resume"
            }
            Your task:
            First, analyze the extracted text and determine whether it is indeed from a resume. If it is, assign a score between 0 and 100 based on how well the resume matches the given job role and description.

            Output Instructions:
            Here is the expected output schema:

            {
            "isResume": boolean, // Indicates whether the text is from a resume
            "score": integer,    // Match score between the resume and the job role/description
            "summary": "A brief summary of the extracted text"
            }`
        } , {
            role : "user",
            content : ` JOB Role : ${jobRole}
                        JOB Description : ${jobDescription}   
                        RESUME : ${text} `
        }]
    })

    if(response.choices[0].message.content){
        const data  : {
            isResume : boolean,
            score : number,
            summary : string
        } = JSON.parse(response.choices[0].message.content)

        if(!data.isResume) return new Response(JSON.stringify({ message : "Uploaded PDF dosent seems to be a pdf" }) , {status : 400})


        const insertedData = await prisma.interview.create({
            data : {
                resumeScore : data.score,
                resumeSummary : data.summary,
                jobRole,
                jobDescription : jobDescription || "",
                hrId : userId,
                Status : "notStarted",
                createdAt : Date.now().toString(),
                updatedAt : Date.now().toString()
            }
        })

        return new Response(JSON.stringify(insertedData) , {status : 201})

    }
    
    return new Response(JSON.stringify({message : "Unable to parse the resume"}) , {status : 500})

    }
    catch(e){
        return new Response(JSON.stringify({ error : e , message : "Something went wrong"}) , {status : 500})
    }
} 




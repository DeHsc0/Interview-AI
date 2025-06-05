
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"




export default function Dashboard () {


    return (
        <div className="bg-[#151515] p-8 flex flex-col justify-between w-full rounded-lg">
            <SidebarTrigger />  
            <div className="mt-6 flex justify-between items-center w-full">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-[16px] text-[#A1A1AA]">Manage your Interviews and candidates.</p>
                </div>
                <Dialog>
                    {/* <Form>
                        <DialogTrigger asChild>
                            <Button className="items-center flex " size={"lg"}>
                                <Plus></Plus>
                                Create Interviews
                            </Button>
                        </DialogTrigger>
                        <FormField>

                        </FormField>
                    </Form> */}
                
                </Dialog>
            </div>
        </div>
    )


}
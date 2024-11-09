"use client"
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/user";
import { acceptMsgSchema } from "@/schemas/acceptMsgSchema";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
export default function Dashboard() {
    const [messages , setMessages] = useState<Message[]>([])
    const [isLoading , setIsLoading] = useState<boolean>(false) // messages fetching
    const [isSwitchLoading , setIsSwitchLoading] = useState<boolean>(false) // state changing of the button
    const {toast} = useToast()
    //optimistic UI approach

    const handleDeleteMessage = (messageId : string) => {
        setMessages(messages.filter(message => message._id !== messageId))
    }
    const {data:session} = useSession()
    const form = useForm({
        resolver: zodResolver(acceptMsgSchema),
    })

    const {register , watch , setValue} = form;
    const acceptMessages = watch("acceptMessages")
    
    const fetchAcceptMessage = useCallback(async() => {
        setIsSwitchLoading(true)
        try {
           const response = await axios.get<ApiResponse>('/api/accepting-messages')
           setValue("acceptMessages" , response.data.isAcceptMessage)

        } catch (error) {
           const axiosError = error as AxiosError<ApiResponse>;
           toast({
            title : "Error",
            description : axiosError.response?.data.message || "Failed to fetch messages",
            variant : "destructive"
           })
        }
        finally{
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async( refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(false)
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            if(refresh){
                toast({
                    title : "Refershed messages",
                    description : "Showing latest messages",
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
           toast({
            title : "Error",
            description : axiosError.response?.data.message || "Failed to fetch messages",
            variant : "destructive"
           })
        }
        finally{
            setIsSwitchLoading(false)
            setIsLoading(false)
        }
    },[setIsLoading , setIsSwitchLoading ])

    useEffect(() => {
        
    })
    return(
        <div>

        </div>
    )
}
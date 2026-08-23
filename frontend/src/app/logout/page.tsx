"use client"
import { useEffect } from "react";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
const Logout=()=>{
    const router=useRouter()
    useEffect(()=>{
        const lout=async()=>{
        try{
            await fetch(`${process.env.NEXT_PUBLIC_BHOST}/logout`,{
            credentials: 'include'
        })
        toast.success("Logged out SuccessFully")
        router.push('/login')
        }
        catch{
            toast.error("Logout Failed")
        }    
    }
        lout();
    },[router])
    return null
}
export default Logout;

import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../api";
import { AppContext } from "./appContextObject";

const AppContextProvider = ({children})=>{
    const backendUrl=API.defaults.baseURL.replace("/api", "")
    const [user,setUser]=useState(null)
    const [cars,setCars]=useState([])
    const [loading,setLoading]=useState(true)
    const [message,setMessage]=useState(null)

    const clearMessage=useCallback(()=>{
        setMessage(null)
    },[])

    const showMessage=useCallback((text,type="success")=>{
        setMessage({text,type})
        window.setTimeout(()=>{
            setMessage(null)
        },3500)
    },[])

    const getUser=useCallback(async()=>{
        try{
            const res=await API.get("/users/me")
            if (res.data.success){
                setUser(res.data.user)
            }
            else{
                setUser(null)
            }
        }
        catch(error){
            console.log(error)
            setUser(null)
        }
        finally{
            setLoading(false)
        }
    },[])

    const getCars=useCallback(async()=>{
        try{
            const res=await API.get("/cars")
            if (res.data.success){
                setCars(res.data.cars)
            }
        }
        catch(error){
            console.error(error)
        }
    },[])

    useEffect(()=>{
        const init=async()=>{
            await getUser()
            await getCars()
        }
        init()
    },[getUser,getCars])

    const value=useMemo(()=>({
        backendUrl,
        user,
        setUser,
        cars,
        setCars,
        getCars,
        getUser,
        loading,
        message,
        showMessage,
        clearMessage
    }),[backendUrl,user,cars,getCars,getUser,loading,message,showMessage,clearMessage])

    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}
export default AppContextProvider

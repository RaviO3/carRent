import { useContext } from "react";
import {Navigate} from "react-router-dom"
import { AppContext } from "../context/appContextObject";

const ProtectedRoute=({children,role})=>{
    const {user,loading} = useContext(AppContext)
    if(loading){
        return <h1>Loading...</h1>
    }
    if(!user){
        return <Navigate to="/login" replace/>
    }
    if(role && user.role !== role){
        return <Navigate to="/" replace/>
    }
    return children
}
export default ProtectedRoute

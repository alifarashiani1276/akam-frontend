import {createContext,useContext} from 'react'
export const AuthContext=createContext(null)
export const useAdminAuth=()=>useContext(AuthContext)

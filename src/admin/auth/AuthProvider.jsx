import {useState} from 'react'
import {AuthContext, useAdminAuth} from './authContext'
export {useAdminAuth}
import {adminClient} from '../api/client'
export function AuthProvider({children}) {
 const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('akam-admin-user'))}catch{return null}})
 const [token,setToken]=useState(()=>localStorage.getItem('akam-admin-token'))
 async function login(email,password){const res=await adminClient.login(email,password);setUser(res.data.user);setToken(res.data.token);localStorage.setItem('akam-admin-user',JSON.stringify(res.data.user));localStorage.setItem('akam-admin-token',res.data.token);return res.data.user}
 async function logout(){try{await adminClient.logout()}finally{setUser(null);setToken(null);localStorage.removeItem('akam-admin-user');localStorage.removeItem('akam-admin-token')}}
 return <AuthContext.Provider value={{user,token,login,logout,isAdmin:user?.role==='admin'}}>{children}</AuthContext.Provider>
}

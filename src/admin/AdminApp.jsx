import './admin.css'
import {Routes,Route,Navigate} from 'react-router-dom'
import {AuthProvider} from './auth/AuthProvider'
import RequireAuth from './auth/RequireAuth'
import AdminLayout from './layout/AdminLayout'
import LoginPage from './features/LoginPage'
import Dashboard from './features/Dashboard'
import ResourcePage from './features/ResourcePage'
export default function AdminApp(){return <AuthProvider><Routes><Route path="login" element={<LoginPage/>}/><Route element={<RequireAuth><AdminLayout/></RequireAuth>}><Route index element={<Dashboard/>}/>{['products','services','projects','subcategories','inquiries','media','pages','settings','users'].map(r=><Route key={r} path={r} element={<ResourcePage resource={r}/>}/>)}</Route><Route path="*" element={<Navigate to="/admin" replace/>}/></Routes></AuthProvider>}

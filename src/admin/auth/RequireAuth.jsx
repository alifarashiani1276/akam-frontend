import {Navigate,useLocation} from 'react-router-dom'
import {useAdminAuth} from './authContext'
export default function RequireAuth({children,adminOnly=false}){const {user}=useAdminAuth();const loc=useLocation();if(!user)return <Navigate to="/admin/login" replace state={{from:loc}}/>;if(adminOnly&&user.role!=='admin')return <Navigate to="/admin" replace/>;return children}

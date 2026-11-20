import { http } from '../../lib/http'
import { USE_MOCK } from '../../lib/apiConfig'
import * as mock from '../mocks/store'
const token=()=>localStorage.getItem('akam-admin-token')
function headers(){return token()?{Authorization:`Bearer ${token()}`}:{ }}
async function guarded(promise){try{return await promise}catch(error){if(error?.status===422){error.fieldErrors=error.errors||{}}if(error?.status===401){localStorage.removeItem('akam-admin-token');localStorage.removeItem('akam-admin-user');if(typeof window!=='undefined'&&!window.location.pathname.endsWith('/admin/login'))window.location.assign('/admin/login')}throw error}}
export const adminClient={
 list:(resource,params)=>USE_MOCK?mock.list(resource,params):guarded(http.get(`v1/admin/${resource}`,{params,headers:headers()})),
 get:(resource,id)=>USE_MOCK?mock.get(resource,id):guarded(http.get(`v1/admin/${resource}/${id}`,{headers:headers()})),
 save:(resource,item)=>{if(USE_MOCK)return mock.save(resource,item);if(resource==='settings')return guarded(http.put('v1/admin/settings',item,{headers:headers()}));if(resource==='media'&&item.file){const body=new FormData();body.append('file',item.file);body.append('name',item.name||item.file.name);body.append('type',item.type||'image');return guarded(http.post('v1/admin/media',body,{headers:headers()}))}return item.id?guarded(http.put(`v1/admin/${resource}/${item.id}`,item,{headers:headers()})):guarded(http.post(`v1/admin/${resource}`,item,{headers:headers()}))},
 remove:(resource,id)=>USE_MOCK?mock.remove(resource,id):guarded(http.delete(`v1/admin/${resource}/${id}`,{headers:headers()})),
 login:(email,password)=>USE_MOCK?mock.login(email,password):http.post('v1/admin/login',{email,password}),
 logout:()=>USE_MOCK?Promise.resolve({data:null}):guarded(http.post('v1/admin/logout',{}, {headers:headers()})),
 me:()=>USE_MOCK?Promise.resolve({data:JSON.parse(localStorage.getItem('akam-admin-user')||'null')}):guarded(http.get('v1/admin/me',{headers:headers()})),
}

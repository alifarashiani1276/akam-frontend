import { HttpError } from '../../lib/http'
const LANGS = ['fa','en','ru','ar']
const sections = [
 {id:'mining', export_only:false, translations:{fa:{title:'ماشین‌آلات معدنی و تجهیزات فرآوری مواد معدنی',text:'طراحی و ساخت تجهیزات خطوط انتقال، خردایش، دانه‌بندی و جداسازی مواد معدنی.'},en:{title:'Mining machinery & mineral processing',text:''},ru:{title:'Горное оборудование',text:''},ar:{title:'معدات التعدين ومعالجة المعادن',text:''}}},
 {id:'industrial', export_only:false, translations:{fa:{title:'ماشین‌آلات، تجهیزات و قطعات صنعتی',text:'ساخت ماشین‌آلات، تجهیزات و قطعات خطوط تولید کارخانه‌ها.'},en:{title:'Industrial machinery, equipment & parts',text:''},ru:{title:'Промышленное оборудование и детали',text:''},ar:{title:'الآلات والمعدات والقطع الصناعية',text:''}}},
 {id:'engineering', export_only:false, translations:{fa:{title:'خدمات مهندسی، طراحی و بازسازی ماشین‌آلات',text:'طراحی مهندسی، ساخت دستگاه‌های خاص، مهندسی معکوس و بازسازی.'},en:{title:'Engineering, design & rebuilding services',text:''},ru:{title:'Инжиниринг, проектирование и восстановление',text:''},ar:{title:'خدمات الهندسة والتصميم وإعادة البناء',text:''}}},
 {id:'agri', export_only:true, translations:{fa:{title:'ماشین‌آلات کشاورزی',text:'ماشین‌آلات تسطیح زمین با سیستم‌های کنترل لیزری و ماهواره‌ای؛ ویژه صادرات.'},en:{title:'Agricultural machinery',text:''},ru:{title:'Сельскохозяйственная техника',text:''},ar:{title:'الآلات الزراعية',text:''}}}
]
const fixtures = import.meta.glob('../../mocks/{fa,en,ru,ar}/{products,services,projects}.json',{eager:true, import:'default'})
function seed(kind) {
 const fa = fixtures[`../../mocks/fa/${kind}.json`] || []
 return fa.map(item => {
  const translations = Object.fromEntries(LANGS.map(lang => {
   const arr = fixtures[`../../mocks/${lang}/${kind}.json`] || []
   const match = arr.find(x=>x.id===item.id) || {}
   const title = match.name || match.title || ''
   return [lang,{title, name:match.name||'', intro:match.intro||'', text:match.text||match.intro||'', slug:match.alternates?.[lang]||match.slug||'', published:lang==='fa', seoTitle:match.meta?.title||'', seoDescription:match.meta?.description||''}]
  }))
  return {...item, translations, status:'draft', visible:true}
 })
}
const KEY='akam-admin-store-v1'
function fresh(){return {sections,subcategories:[
 {id:'crushing',section_id:'mining',title:'تجهیزات خردایش',visible:true,sort:1},
 {id:'screening',section_id:'mining',title:'تجهیزات دانه‌بندی',visible:true,sort:2},
 {id:'gravity',section_id:'mining',title:'تجهیزات جداسازی ثقلی',visible:true,sort:3},
 {id:'conveying',section_id:'mining',title:'تجهیزات انتقال مواد',visible:true,sort:4},
 {id:'molten',section_id:'industrial',title:'تجهیزات حمل مذاب',visible:true,sort:1},
 {id:'handling',section_id:'industrial',title:'حمل و جابه‌جایی مواد',visible:true,sort:2},
 {id:'custom',section_id:'engineering',title:'طراحی و ساخت ماشین‌آلات خاص',visible:true,sort:1},
 {id:'reverse',section_id:'engineering',title:'مهندسی معکوس و بهسازی',visible:true,sort:2},
 {id:'laserLeveler',section_id:'agri',title:'لند لولرهای لیزری',visible:true,sort:1},
 {id:'gnssLeveler',section_id:'agri',title:'لند لولرهای ماهواره‌ای',visible:true,sort:2}],
 products:seed('products'),services:seed('services'),projects:seed('projects'),
 inquiries:[
 {id:'inq-1001',type:'استعلام قیمت محصول',name:'شرکت نمونه شرق',phone:'[نیازمند تأیید]',subject:'استعلام سنگ‌شکن فکی',status:'new',created_at:'۱۴۰۵/۰۸/۲۴',message:'لطفاً مشخصات و قیمت دستگاه را ارسال کنید.',notes:[]},
 {id:'inq-1002',type:'درخواست مشاوره',name:'مخاطب نمونه',phone:'[نیازمند تأیید]',subject:'بازسازی تجهیز صنعتی',status:'review',created_at:'۱۴۰۵/۰۸/۲۳',message:'برای بازسازی نیاز به بررسی داریم.',notes:[]},
 {id:'inq-1003',type:'خرید صادراتی',name:'مشتری خارجی',phone:'[نیازمند تأیید]',subject:'لند لولر لیزری',status:'closed',created_at:'۱۴۰۵/۰۸/۲۰',message:'درخواست اطلاعات صادراتی.',notes:[]}],
 pages:[{id:'about',title:'درباره آکام ماشین',body:'آکام ماشین فعالیت خود را از سال ۱۳۹۸ در شهرک صنعتی شاهرود آغاز کرده است. مجموعه با تکیه بر طراحی سه‌بعدی، ماشین‌کاری، ساخت سازه‌های فلزی، جوشکاری، هیدرولیک، برق صنعتی، مونتاژ و کنترل کیفیت، نیاز مشتری را از تعریف مسئله تا ساخت و تحویل تجهیز پیگیری می‌کند.'},{id:'capabilities',title:'توانمندی‌های تولید',body:'طراحی سه‌بعدی، ماشین‌کاری، ساخت سازه‌های فلزی، جوشکاری، هیدرولیک، برق صنعتی، مونتاژ و کنترل کیفیت. کارگاه حدود ۱۰۰۰ مترمربع؛ ۱۰ نیروی ثابت و حدود ۲۵ نیروی پروژه‌ای. عملیات حرارتی، ماشین‌کاری دروازه‌ای و دنده‌زنی دقیق حسب نیاز به پیمانکار تخصصی واگذار می‌شود.'}],
 settings:{address:'استان سمنان، شاهرود، شهرک صنعتی، فاز یک، بلوار انقلاب، بالاتر از آتش‌نشانی',postal_code:'۳۶۱۴۹۴۹۵۱۵',contacts:[
 {id:'fixed',code:'',title:{fa:'تلفن ثابت',en:'Main phone',ru:'Основной телефон',ar:'الهاتف الرئيسي'},value:'۰۲۳-۳۲۳۳۳۳۲۰',verified:false},
 {id:'sales',code:'',title:{fa:'واحد فروش',en:'Sales',ru:'Продажи',ar:'المبيعات'},value:'۰۹۲۰۰۹۵۳۳۲۰',verified:true},
 {id:'after-sales',code:'۹۶',title:{fa:'خدمات پس از فروش',en:'After-sales',ru:'Послепродажное обслуживание',ar:'خدمة ما بعد البيع'},value:'',verified:false},
 {id:'finance',code:'۹۷',title:{fa:'مالی',en:'Finance',ru:'Финансы',ar:'المالية'},value:'',verified:false},
 {id:'purchase',code:'۹۸',title:{fa:'خرید',en:'Purchasing',ru:'Закупки',ar:'المشتريات'},value:'',verified:false},
 {id:'extra',code:'۹۹',title:{fa:'',en:'',ru:'',ar:''},value:'',verified:false}],social:{instagram:'',linkedin:'',telegram:''},seo:{title:'آکام ماشین',description:''}},
 users:[{id:'user-admin',name:'مدیر سیستم',email:'admin@akam.local',role:'admin',password:'admin123'},{id:'user-editor',name:'کارشناس محتوا',email:'editor@akam.local',role:'editor',password:'editor123'}],
 media:[]}}
let state
function getState(){if(state)return state;try{state=JSON.parse(localStorage.getItem(KEY))||fresh()}catch{state=fresh()}return state}
function persist(){localStorage.setItem(KEY,JSON.stringify(state))}
const wait=()=>new Promise(r=>setTimeout(r,180))
export async function list(resource,params={}){await wait();const raw=getState()[resource]||[];const rows=resource==='settings'?[raw]:raw;let data=[...rows];if(params.search)data=data.filter(x=>JSON.stringify(x).toLowerCase().includes(params.search.toLowerCase()));if(params.status)data=data.filter(x=>x.status===params.status);if(params.section_id)data=data.filter(x=>x.section_ids?.includes(params.section_id)||x.section_id===params.section_id);if(params.lang)data=data.filter(x=>x.translations?.[params.lang]?.title);const page=Number(params.page||1),per=Number(params.per_page||10);return {data:data.slice((page-1)*per,page*per),meta:{current_page:page,per_page:per,total:data.length,last_page:Math.max(1,Math.ceil(data.length/per))}}}
export async function get(resource,id){await wait();const raw=getState()[resource]||[];const item=(resource==='settings'?raw:[...raw]).find(x=>x.id===id);if(!item)throw new HttpError({status:404,message:'یافت نشد'});return {data:item}}
export async function save(resource,item){await wait();const rows=resource==='settings'?[getState()[resource]]:(getState()[resource]||[]);const index=rows.findIndex(x=>x.id===item.id);if(index<0){item={...item,id:item.id||`${resource}-${Date.now()}`};rows.unshift(item)}else rows[index]={...rows[index],...item};state[resource]=resource==='settings'?item:rows;persist();return {data:item}}
export async function remove(resource,id){await wait();state=getState();state[resource]=(state[resource]||[]).filter(x=>x.id!==id);persist();return {data:null}}
export async function reorder(id,sort){state=getState();const item=state.subcategories.find(x=>x.id===id);if(item)item.sort=sort;persist();return {data:item}}
export function reset(){state=fresh();persist()}
export async function login(email,password){await wait();const u=getState().users.find(x=>x.email===email&&x.password===password);if(!u)throw new HttpError({status:422,message:'اطلاعات ورود نادرست است'});return {data:{user:{id:u.id,name:u.name,email:u.email,role:u.role},token:'mock-token-'+u.role}}}

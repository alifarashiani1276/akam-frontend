# AKAM Admin API Contract — v1

این سند قرارداد پیشنهادی برای پیاده‌سازی Laravel است. تمام مسیرها زیر `/api/v1/admin` قرار دارند و درخواست/پاسخ JSON هستند؛ به‌جز آپلود فایل. احراز هویت تمام endpointها به‌جز `POST /login` با `Authorization: Bearer <token>` انجام می‌شود.

## قواعد عمومی

- زبان‌های پشتیبانی‌شده: `fa`, `en`, `ru`, `ar`.
- هر محتوا یک شناسه ثابت دارد و ترجمه‌ها در `translations` نگهداری می‌شوند؛ برای هر زبان `title`, `intro`, `body/text`, `slug`, `status`, `seo` مستقل است.
- وضعیت ترجمه: `draft | published`. انتشار یک زبان نباید وضعیت زبان دیگر را تغییر دهد.
- پاسخ لیست: `{ "data": [], "meta": { "current_page": 1, "per_page": 20, "total": 0, "last_page": 1 } }`.
- پارامترهای عمومی فهرست: `page`, `per_page`, `search`, `sort`, `direction`, `status`, `lang`, `section_id`, `subcategory_id`, `visible`.
- خطای اعتبارسنجی Laravel با HTTP 422: `{ "message": "The given data was invalid.", "errors": { "translations.fa.title": ["عنوان فارسی الزامی است."] } }`.
- خطای عدم احراز: 401؛ عدم مجوز: 403؛ یافت نشدن: 404.
- حذف پیشنهادی soft delete است تا ارتباطات و سوابق درخواست از بین نرود.
- تمام تاریخ‌ها ISO-8601 در UTC باشند.

## احراز هویت

| متد | مسیر | بدنه / توضیح |
|---|---|---|
| POST | `/login` | `{email,password}`؛ پاسخ `{data:{user:{id,name,email,role},token,token_type:"Bearer"}}` |
| POST | `/logout` | ابطال توکن جاری |
| GET | `/me` | اطلاعات کاربر و نقش/مجوزها |

نقش‌ها: `admin` و `editor`. ویرایشگر مجاز به مشاهده/ایجاد/ویرایش محتوا و رسیدگی به درخواست‌ها است، اما مجوز `delete` و `settings.manage` و `users.manage` ندارد. این محدودیت باید در Policyهای Laravel enforce شود.

## منابع محتوایی

ساختار عمومی:
```json
{
  "data": {
    "id": "product-123",
    "status": "draft",
    "section_ids": ["mining", "industrial"],
    "subcategory_ids": ["crushing"],
    "translations": {
      "fa": {
        "title": "سنگ‌شکن فکی",
        "intro": "معرفی کوتاه",
        "body": "متن کامل",
        "slug": "sang-shekan",
        "status": "published",
        "seo": {"title": "عنوان SEO", "description": "توضیحات"}
      },
      "en": {"title": "", "intro": "", "body": "", "slug": "", "status": "draft", "seo": {"title": "", "description": ""}},
      "ru": {"title": "", "intro": "", "body": "", "slug": "", "status": "draft", "seo": {"title": "", "description": ""}},
      "ar": {"title": "", "intro": "", "body": "", "slug": "", "status": "draft", "seo": {"title": "", "description": ""}}
    },
    "created_at": "2026-11-20T10:00:00Z",
    "updated_at": "2026-11-20T10:00:00Z"
  }
}
```

برای هر منبع `products`, `services`, `projects`, `subcategories`, `pages` مسیرهای زیر لازم است:

| متد | مسیر | توضیح |
|---|---|---|
| GET | `/{resource}` | فهرست صفحه‌بندی‌شده با query params عمومی |
| POST | `/{resource}` | ایجاد |
| GET | `/{resource}/{id}` | جزئیات |
| PUT/PATCH | `/{resource}/{id}` | ویرایش |
| DELETE | `/{resource}/{id}` | حذف نرم؛ فقط admin |
| PATCH | `/{resource}/{id}/reorder` | `{sort_order,parent_id}` برای مرتب‌سازی |
| PATCH | `/{resource}/{id}/visibility` | `{visible:boolean}`؛ مخفی‌سازی بدون حذف |

### Sections

`GET /sections` و `PUT /sections/{id}`. دقیقاً چهار رکورد ثابت: `mining`, `industrial`, `engineering`, `agri`. ایجاد و حذف ممنوع است. فیلدهای قابل ویرایش `translations`, `image`, `export_only`. بخش کشاورزی `export_only=true` باقی می‌ماند.

### Products

فیلدهای افزوده: `applications[]`, `industries[]`, `advantages[]`, `specs[]` (هر ردیف `{group,label,value,unit}`), `models[]`, `gallery[]`, `catalog_media_id`, `related_product_ids[]`, `section_ids[]`, `subcategory_ids[]`, `export_only`.

### Services

فیلدهای افزوده: `application_area`, `steps[]`, `capabilities[]`, `project_ids[]`, `before_after[]`, `technical_info`.

### Projects

فیلدهای افزوده: `operations`, `before_after[]`, `technical_info`, `service_ids[]`, `section_ids[]`, `subcategory_ids[]`.

یک محصول یا پروژه می‌تواند به چند بخش و زیرمجموعه متصل باشد؛ این اتصال‌ها نباید باعث ایجاد رکورد یا URL تکراری شوند.

## Inquiries

| متد | مسیر | توضیح |
|---|---|---|
| GET | `/inquiries` | فهرست؛ فیلتر `status,type,from,to,search,page,per_page` |
| GET | `/inquiries/{id}` | جزئیات |
| PATCH | `/inquiries/{id}` | تغییر `status` به `new|review|closed` |
| POST | `/inquiries/{id}/notes` | `{body}`؛ یادداشت داخلی |
| GET | `/inquiries/export` | خروجی CSV با همان فیلترها |

یادداشت داخلی فقط برای کاربران مجاز برگردانده شود و هر تغییر وضعیت در audit log ثبت شود.

## Media Library

| متد | مسیر | توضیح |
|---|---|---|
| GET | `/media` | فهرست رسانه |
| POST | `/media` | multipart/form-data |
| GET | `/media/{id}` | جزئیات |
| DELETE | `/media/{id}` | حذف فقط در صورت عدم استفاده یا با تأیید مدیر |

فیلدهای آپلود: `file` (required), `alt[fa]`, `alt[en]`, `alt[ru]`, `alt[ar]`, `folder`, `type`. پاسخ شامل `{data:{id,type,url,mime,size,alt}}`. برای فایل‌ها محدودیت حجم و MIME سمت سرور اعمال شود. فرانت‌اند نباید URL دائمی را از object URL مرورگر فرض کند.

## Pages و Settings

- `GET /pages`, `PUT /pages/{key}` برای `about`, `capabilities` و محتوای ثابت.
- `GET /settings`, `PUT /settings` فقط admin.
- Settings شامل `address`, `postal_code`, `social`, `seo`, `logo_media_id`, `contacts[]`.
- هر contact: `{id,code,title:{fa,en,ru,ar},value,verified}`.
- الزام انتشار: **فقط** contactهایی که `verified=true` دارند در API عمومی سایت برگردانده شوند. مقادیر تأییدنشده صرفاً در API مدیریت قابل مشاهده‌اند.
- فیلدهای تماس مستقل: تلفن ثابت، فروش، خدمات پس از فروش، مالی، خرید و ردیف عنوان خالی با کد ۹۹. شماره ثابت و نحوه شماره‌گیری کدهای داخلی تا تأیید نهایی منتشر نشوند.

## Users

| متد | مسیر | توضیح |
|---|---|---|
| GET | `/users` | فهرست فقط admin |
| POST | `/users` | ایجاد کاربر |
| PUT/PATCH | `/users/{id}` | ویرایش نقش/اطلاعات |
| DELETE | `/users/{id}` | غیرفعال‌سازی؛ فقط admin |

گذرواژه هرگز در پاسخ API برگردانده نشود.

## نگاشت مدل ترجمه پنل به خروجی عمومی سایت فعلی

سایت فعلی fixture جداگانه برای هر زبان دارد و در رکورد عمومی از `slug` و `alternates` استفاده می‌کند. در خروجی API عمومی برای درخواست زبان `L`:

1. `translations[L].slug` به `slug` تبدیل شود.
2. `translations[*].slug` به `alternates` تبدیل شود؛ کلید زبان، مقدار slug همان زبان.
3. `translations[L].title` به `name` (محصول) یا `title` (خدمت/پروژه) تبدیل شود.
4. `translations[L].intro/body` به `intro` و `text` تبدیل شود.
5. `translations[L].seo` به `meta:{title,description}` تبدیل شود.
6. `section_ids`, `subcategory_ids` و فیلدهای ساختاری بدون تغییر حفظ شوند.
7. محتوای زبان دیگر در `alternates` فقط slug ارائه می‌دهد؛ متن ترجمه آن زبان در درخواست زبان مربوطه برگردانده می‌شود.
8. رکورد فقط زمانی در API عمومی زبان L نمایش داده شود که `translations[L].status=published` و `visible=true` باشد.

نمونه خروجی عمومی:
```json
{
  "id": "product-123",
  "slug": "sang-shekan",
  "name": "سنگ‌شکن فکی",
  "intro": "معرفی کوتاه",
  "text": "متن کامل",
  "alternates": {"fa":"sang-shekan","en":"jaw-crusher","ru":"shchekovaya-drobilka","ar":"كسارة-فكية"},
  "meta": {"title":"سنگ‌شکن فکی","description":"توضیحات"},
  "section_ids": ["mining"],
  "subcategory_ids": ["crushing"]
}
```

## امنیت، انتشار و اعتبارسنجی

- اعتبارسنجی slug باید به‌ازای زبان و یکتا در همان زبان باشد.
- برای متن RTL/LTR، API متن را بدون تغییر جهت ذخیره کند؛ جهت نمایش وظیفه کلاینت است.
- مقادیر تماس `verified=false` نباید در هیچ endpoint عمومی، schema عمومی یا خروجی header/footer منتشر شوند.
- فایل‌ها با نام تصادفی ذخیره و MIME واقعی بررسی شود.
- همه endpointهای مدیریتی rate limit و audit log داشته باشند.

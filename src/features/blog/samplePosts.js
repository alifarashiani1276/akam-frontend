// SAMPLE posts, only until the real blog exists. Delete this file when blogApi.js reads the real source (see README.md).
// Each post: shared fields + `translations` per language ({ category, title, excerpt }). 5 posts on purpose:
// the home page shows only the newest 4 (BLOG.latestCount), so you can see the limit working.
// Images are existing photos from public/images.
export const SAMPLE_POSTS = [
  {
    id: 1,
    slug: "choosing-a-crusher",
    publishedAt: "2026-11-10",
    image: "/images/card-1.webp",
    translations: {
      fa: { category: "معدن", title: "چطور سنگ‌شکن مناسب خط تولید را انتخاب کنیم", excerpt: "معیارهای فنی انتخاب سنگ‌شکن بر اساس جنس مواد، ظرفیت و اندازه خروجی." },
      ar: { category: "التعدين", title: "كيف تختار الكسارة المناسبة لخط الإنتاج", excerpt: "المعايير الفنية لاختيار الكسارة حسب نوع المادة والسعة وحجم المنتج." },
      ru: { category: "Горное дело", title: "Как выбрать дробилку для вашей линии", excerpt: "Технические критерии выбора дробилки: материал, производительность и крупность продукта." },
      en: { category: "Mining", title: "How to choose the right crusher for your line", excerpt: "The technical criteria for picking a crusher by material, capacity and output size." },
    },
  },
  {
    id: 2,
    slug: "welding-standards",
    publishedAt: "2026-10-28",
    image: "/images/card-3.webp",
    translations: {
      fa: { category: "مهندسی", title: "استانداردهای جوشکاری برای سازه‌های سنگین", excerpt: "چه نکاتی در جوشکاری باعث ایمنی و عمر بیشتر سازه می‌شود." },
      ar: { category: "الهندسة", title: "معايير اللحام للهياكل الثقيلة", excerpt: "ما الذي يجعل اللحام آمناً ويطيل عمر الهيكل." },
      ru: { category: "Инжиниринг", title: "Стандарты сварки для тяжёлых конструкций", excerpt: "Что делает сварку безопасной и увеличивает срок службы конструкции." },
      en: { category: "Engineering", title: "Welding standards that keep heavy structures safe", excerpt: "What makes a weld safe and extends the life of a structure." },
    },
  },
  {
    id: 3,
    slug: "laser-vs-gnss-leveling",
    publishedAt: "2026-10-12",
    image: "/images/card-4.webp",
    translations: {
      fa: { category: "کشاورزی", title: "تسطیح لیزری یا GNSS؟ کدام برای زمین شما مناسب است", excerpt: "مقایسه‌ی دقت، هزینه و کاربرد دو روش تسطیح زمین." },
      ar: { category: "الزراعة", title: "التسوية بالليزر أم GNSS؟ أيهما يناسب أرضك", excerpt: "مقارنة الدقة والتكلفة والاستخدام بين طريقتي التسوية." },
      ru: { category: "Сельское хозяйство", title: "Лазерная или GNSS-планировка: что выбрать", excerpt: "Сравнение точности, стоимости и применения двух методов планировки." },
      en: { category: "Agriculture", title: "Laser or GNSS land leveling: which fits your field", excerpt: "Accuracy, cost and use cases of the two leveling methods compared." },
    },
  },
  {
    id: 4,
    slug: "preventive-maintenance",
    publishedAt: "2026-09-25",
    image: "/images/card-2.webp",
    translations: {
      fa: { category: "صنعتی", title: "نگهداری پیشگیرانه؛ کاهش توقف تجهیزات صنعتی", excerpt: "برنامه‌ی ساده‌ای که از خرابی‌های ناگهانی جلوگیری می‌کند." },
      ar: { category: "الصناعة", title: "الصيانة الوقائية لتقليل توقف المعدات", excerpt: "خطة بسيطة تمنع الأعطال المفاجئة." },
      ru: { category: "Промышленность", title: "Профилактика: как сократить простои оборудования", excerpt: "Простой план, который предотвращает внезапные поломки." },
      en: { category: "Industrial", title: "Preventive maintenance that cuts equipment downtime", excerpt: "A simple plan that prevents sudden breakdowns." },
    },
  },
  {
    id: 5,
    slug: "3d-design-simulation",
    publishedAt: "2026-09-02",
    image: "/images/quality.webp",
    translations: {
      fa: { category: "مهندسی", title: "طراحی و شبیه‌سازی سه‌بعدی قبل از ساخت", excerpt: "چرا مدل‌سازی پیش از ماشین‌کاری هزینه‌ی اصلاح را کم می‌کند." },
      ar: { category: "الهندسة", title: "التصميم والمحاكاة ثلاثية الأبعاد قبل التصنيع", excerpt: "لماذا تقلل النمذجة قبل التشغيل تكلفة التعديلات." },
      ru: { category: "Инжиниринг", title: "3D-проектирование и симуляция перед изготовлением", excerpt: "Почему моделирование до обработки снижает затраты на доработки." },
      en: { category: "Engineering", title: "3D design and simulation before building", excerpt: "Why modeling before machining lowers the cost of changes." },
    },
  },
]

import type { StageConfig, StatusConfig, Script, QuickAction, Client } from '@/types'

// ═══════════════════════════════════════════════════════════
// DROPDOWN OPTIONS
// ═══════════════════════════════════════════════════════════

export const SOURCES   = ['إنستقرام','واتساب','إحالة','جوجل','تيك توك','سناب شات','غير معروف']
export const SERVICES  = ['قشور إيماكس','قشور فيلدسباثيك','قشور عامة','تبييض','سحب عصب','تلبيسة','استشارة','تنظيف','أخرى']
export const CONCERNS  = ['مظهر طبيعي','بدون برد','السعر','الخوف من الندم','الخوف من الألم','تصبغات','فجوات','اللون','من خارج الرياض','أخرى']

// ═══════════════════════════════════════════════════════════
// CLOSED REASONS
// ═══════════════════════════════════════════════════════════

export const CLOSED_REASONS: Record<string, { label: string; color: string }> = {
  price:          { label: 'السعر مرتفع',  color: '#C4A0B5' },
  no_reply:       { label: 'لم يرد',        color: '#8B9DC3' },
  outside_riyadh: { label: 'مسافة بعيدة',  color: '#D4C4A0' },
  not_interested: { label: 'غير مهتم',      color: '#8B7355' },
  competitor:     { label: 'ذهب لمنافس',   color: '#C49A8B' },
  timing:         { label: 'التوقيت',       color: '#A8C5A0' },
  financial:      { label: 'ظروف مالية',   color: '#B5C4D4' },
  unknown:        { label: 'غير معروف',     color: '#9A8E82' },
}

// ═══════════════════════════════════════════════════════════
// STAGES & STATUSES
// ═══════════════════════════════════════════════════════════

export const STAGES: Record<string, StageConfig> = {
  curious:    { label: 'فضول',   color: '#8BB8D4', icon: '💭', score: 10 },
  interested: { label: 'اهتمام', color: '#A8C5A0', icon: '🌿', score: 30 },
  ready:      { label: 'قرار',   color: '#C8A97E', icon: '✅', score: 50 },
  hesitant:   { label: 'تردد',   color: '#C4A0B5', icon: '🤍', score: 20 },
}

export const STATUSES: Record<string, StatusConfig> = {
  new:               { label: 'جديد',        color: '#8BB8D4', icon: '🔵', score: 0  },
  interested:        { label: 'مهتم',        color: '#A8C5A0', icon: '🟢', score: 10 },
  follow_up:         { label: 'متابعة',      color: '#D4C4A0', icon: '🟡', score: 5  },
  booked:            { label: 'محجوز',       color: '#C8A97E', icon: '📅', score: 20 },
  visited:           { label: 'زار العيادة', color: '#B5C4D4', icon: '🏥', score: 30 },
  started_treatment: { label: 'بدأ العلاج',  color: '#A8C5A0', icon: '⭐', score: 40 },
  closed:            { label: 'مغلق',        color: '#9A8E82', icon: '⚫', score: 0  },
}

// ═══════════════════════════════════════════════════════════
// PRICES
// ═══════════════════════════════════════════════════════════

export const PRICES_TABLE: Record<string, { current: number | null; original: number | null }> = {
  'قشور إيماكس':      { current: 1800, original: 2500 },
  'قشور فيلدسباثيك': { current: 1700, original: 2500 },
  'قشور عامة':        { current: 1350, original: 2000 },
  'استشارة':          { current: 50,   original: 50   },
  'سحب عصب':         { current: 650,  original: null  },
  'تبييض':            { current: null, original: null  },
}

export const UNIFIED_PRICE_TEXT = `القشور الإيماكس عندنا بـ١٨٠٠ ريال للسن — وهذا سعر العرض الحالي 🌿\nالرقم الدقيق لحالتك يحدده الدكتور بعد الكشف بـ٥٠ ريال\nعشان ما تدفعين أكثر من اللي تحتاجينه 🤍`

// ═══════════════════════════════════════════════════════════
// QUICK ACTIONS
// ═══════════════════════════════════════════════════════════

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'called',   icon: '📞', label: 'تم الاتصال',    text: 'تم الاتصال بالعميل'      },
  { id: 'location', icon: '📍', label: 'أُرسل الموقع',  text: 'تم إرسال موقع العيادة'  },
  { id: 'price',    icon: '💰', label: 'أُرسل السعر',   text: 'تم إرسال السعر'          },
  { id: 'appt',     icon: '📅', label: 'عُرض موعد',     text: 'تم عرض موعد الكشف'      },
]

// ═══════════════════════════════════════════════════════════
// SCRIPTS
// ═══════════════════════════════════════════════════════════

export const SCRIPTS: Script[] = [
  {
    id: 'price', category: 'الأسعار', icon: '💎', color: '#8B6F47',
    title: 'سؤال عن السعر', trigger: 'بكم القشور؟',
    psychology: 'تريد رقماً لكنها تخاف يكون فوق توقعاتها',
    goal: 'تأخير الرقم حتى يكون له سياق',
    reply: 'قبل ما أعطيكِ السعر الدقيق —\nايش اللي تحبين تغيرينه في ابتسامتك؟ 🌿\nعشان أوجهك للخيار الأنسب لك',
    reply2: 'القشور الإيماكس عندنا بـ١٨٠٠ ريال للسن 💎\nالرقم الدقيق يحدده د. محمد بعد الكشف بـ٥٠ ريال\nعشان ما تدفعين أكثر من اللي تحتاجينه 🤍',
    nextStep: 'احجزي لها كشف — الكشف هو الجسر',
  },
  {
    id: 'natural', category: 'المظهر الطبيعي', icon: '🌿', color: '#5A8C6A',
    title: 'تريد مظهر طبيعي', trigger: 'ما أبي تبين مصطنعة',
    psychology: 'تخاف تندم',
    goal: 'بناء الثقة بخبرة الدكتور',
    reply: 'هذا أهم شيء نراعيه 🌿\nد. محمد متخصص في النتائج الطبيعية\nكثير عملاء جاؤوا بنفس قلقك — وكانت النتيجة أحسن من توقعاتهم\n\nبعد الكشف يصمم لك الشكل قبل ما يبدأ — وتوافقين أنتِ أولاً ✨',
    nextStep: 'ركّزي على التخصص والتصميم المسبق',
  },
  {
    id: 'nogrind', category: 'بدون برد', icon: '🦷', color: '#B5808A',
    title: 'خايفة من البرد', trigger: 'بدون برد؟',
    psychology: 'خوف من فقدان الأسنان الطبيعية',
    goal: 'الطمأنة بدون وعود',
    reply: 'هذا سؤال مهم 🦷\n\nالقشور الرفيعة بتحتاج برد خفيف جداً أو بدون برد أحياناً\nبس القرار يعتمد على وضع أسنانك\n\nد. محمد متخصص في هذا النوع\nبعد الكشف يخبرك بالضبط 🌿',
    nextStep: 'لا تضمني بدون برد — الكشف هو الجواب',
  },
  {
    id: 'fear', category: 'الخوف والتردد', icon: '🤍', color: '#9070A8',
    title: 'تردد وخوف', trigger: 'بستخير / بفكر / خايفة أندم',
    psychology: 'الغموض أكبر من الثقة',
    goal: 'تصغير الغموض',
    reply: 'طبيعي تفكري، القرار مهم 🤍\nخذي وقتك\n\nبس خبريني — ايش اللي خلاكِ تترددين؟\nممكن أوضح لك أي شيء 🌿',
    reply2: 'الكشف بـ٥٠ ريال يخليكِ تشوفين الصورة كاملة قبل ما تقرري\nمافي التزام — بس بتخرجين بقرار واضح 🤍\nمتى يناسبك؟',
    nextStep: 'اكتشفي سبب التردد أولاً',
  },
  {
    id: 'outside', category: 'من خارج الرياض', icon: '🗺️', color: '#8B7848',
    title: 'عميل من خارج الرياض', trigger: 'أبعد عنكم ساعات',
    psychology: 'تخاف تضيع الرحلة',
    goal: 'تحويل القلق لخطة واضحة',
    reply: 'ما شاء الله إنك تهتمين بأسنانك لهالدرجة 🌿\n\nعشان رحلتك ما تضيع:\nالكشف نص ساعة فقط\nالتركيب بعد أسبوع من المقاس\n\nرحلتين كافيتين تخلصين كل شيء ✨\nمتى تخططين تكونين في الرياض؟',
    nextStep: 'حددي التواريخ فوراً',
  },
  {
    id: 'booking', category: 'الحجز', icon: '🗓️', color: '#8B6F47',
    title: 'حجز الموعد', trigger: 'أبي أحجز / متى متاح',
    psychology: 'مستعدة — تحتاج تيسير',
    goal: 'إغلاق الحجز بأقل خطوات',
    reply: 'ممتاز! يسعدنا 🌿\nعندنا مواعيد مسائية مع د. محمد\nهذا الأسبوع ولا الأسبوع القادم يناسبك؟',
    reply2: 'تم الحجز ✅\n[الاسم] — [اليوم] الساعة [الوقت]\n\nموقعنا:\nhttps://maps.app.goo.gl/D71M7DKxX5GCwUK68\n\nنشوفك إن شاء الله 🌿',
    nextStep: 'أرسلي الموقع مع التأكيد',
  },
  {
    id: 'consult', category: 'رسوم الاستشارة', icon: '💰', color: '#5A8C6A',
    title: 'الكشف مجاني؟', trigger: 'الكشف مجاني؟',
    psychology: 'تريد معرفة التكلفة الإجمالية',
    goal: 'بيع الكشف كقيمة',
    reply: 'الكشف بـ٥٠ ريال 🌿\nوهو فرصتك تشوفين الصورة كاملة قبل ما تقرري\nالدكتور يعطيكِ خطة علاجية واضحة\n\nمافي التزام — بس بتخرجين بقرار واضح 🤍\nمتى يناسبك؟',
    nextStep: 'الكشف ليس تكلفة — هو استثمار',
  },
  {
    id: 'discount', category: 'طلب الخصم', icon: '⚖️', color: '#8B7848',
    title: 'طلب تخفيض السعر', trigger: 'مستحيل ينزل؟',
    psychology: 'تريد أفضل سعر ممكن',
    goal: 'الحفاظ على السعر',
    reply: 'نفهمك 🤍\nبس السعر الحالي هو فعلاً أفضل عرض نقدر نقدمه\n\nاللي نقدر نعمله —\nنثبت لك السعر الحالي لو حجزتِ هذا الأسبوع 🌿',
    nextStep: 'تثبيت السعر هو القيمة البديلة',
  },
  {
    id: 'followup', category: 'المتابعة', icon: '💬', color: '#4A8C78',
    title: 'متابعة بعد الزيارة', trigger: 'بعد الكشف ساعتين',
    psychology: 'تحتاج تأكيد',
    goal: 'إبقاء الباب مفتوحاً',
    reply: 'كيف حالك؟ 🌿\nحاسة إن الزيارة أفادتك؟\nلو عندك أي سؤال أنا هنا 🤍',
    reply2: 'مرحبا 🌿\nبس بشوف كيف حالك بعد الكشف\nلو قررتِ تكملين — المواعيد متاحة هذا الأسبوع 🗓️',
    nextStep: 'رسالة واحدة بعد يومين فقط',
  },
  {
    id: 'doctor', category: 'أسئلة عن الدكتور', icon: '👨‍⚕️', color: '#6A8BA8',
    title: 'سؤال عن الدكتور', trigger: 'جنسية الدكتور / تخصصه',
    psychology: 'تبحث عن ثقة',
    goal: 'بناء الثقة بالتخصص',
    reply: 'د. محمد أفندي 🌿\nمتخصص في تجميل الأسنان والابتسامة\nخبرة واسعة في القشور والعدسات الجمالية\n\nتحبين تحجزين كشف وتتعرفين عليه مباشرة؟ 🗓️',
    nextStep: 'وجّهي للكشف دائماً',
  },
]

// ═══════════════════════════════════════════════════════════
// INITIAL CLIENTS (demo data)
// ═══════════════════════════════════════════════════════════

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 1, name: 'منال القحطاني', phone: '0506383733',
    source: 'واتساب', service: 'قشور إيماكس', concern: 'السعر',
    stage: 'hesitant', status: 'follow_up',
    lastContact: '2026-05-24', nextAction: 'متابعة بعد العيد',
    nextFollowUpDate: '2026-06-01', priceGiven: '١٨٠٠×٤',
    notes: 'قالت بستخير — السعر أعلى من المتوقع', closedReason: '',
    timeline: [
      { date: '2026-05-21', type: 'created',    text: 'أول تواصل — سألت عن قشور إيماكس' },
      { date: '2026-05-23', type: 'price_sent', text: 'أُرسل السعر: ١٨٠٠ ريال/سن' },
      { date: '2026-05-24', type: 'note',       text: 'جاءت الكشف — قالت بستخير' },
    ],
  },
  {
    id: 2, name: 'Orjwan', phone: '',
    source: 'إنستقرام', service: 'قشور إيماكس', concern: 'السعر',
    stage: 'interested', status: 'new',
    lastContact: '2026-05-23', nextAction: 'تأكيد الموعد',
    nextFollowUpDate: '2026-06-05', priceGiven: '١٨٠٠',
    notes: 'طلبت موعد — لم يُؤكد بعد', closedReason: '',
    timeline: [
      { date: '2026-05-16', type: 'created', text: 'أول تواصل — سألت عن قشور' },
      { date: '2026-05-21', type: 'note',    text: 'طلبت موعد' },
      { date: '2026-05-23', type: 'appt',    text: 'عُرض موعد الساعة ٥' },
    ],
  },
  {
    id: 3, name: 'Fatimah', phone: '',
    source: 'واتساب', service: 'قشور عامة', concern: 'الخوف من الألم',
    stage: 'ready', status: 'booked',
    lastContact: '2026-05-09', nextAction: 'تذكير بالموعد',
    nextFollowUpDate: '2026-06-04', priceGiven: '؟',
    notes: 'حجزت — العرض ينتهي قريباً', closedReason: '',
    timeline: [
      { date: '2026-05-02', type: 'created', text: 'أول تواصل — سألت عن العدسات' },
      { date: '2026-05-03', type: 'booked',  text: 'تم حجز موعد الثلاثاء' },
    ],
  },
  {
    id: 4, name: 'نادية', phone: '',
    source: 'واتساب', service: 'قشور إيماكس', concern: 'من خارج الرياض',
    stage: 'interested', status: 'follow_up',
    lastContact: '2026-05-16', nextAction: 'تحديد تاريخ الزيارة',
    nextFollowUpDate: '2026-05-20', priceGiven: '١٨٠٠',
    notes: 'من خارج الرياض — ٩ ساعات', closedReason: '',
    timeline: [
      { date: '2026-05-14', type: 'created',    text: 'أول تواصل — حالة معقدة' },
      { date: '2026-05-16', type: 'price_sent', text: 'أُرسل السعر + شُرحت الخطة' },
    ],
  },
]

export const EMPTY_CLIENT: Omit<Client, 'id'> = {
  name: '', phone: '', source: 'واتساب', service: 'قشور إيماكس',
  concern: 'السعر', stage: 'curious', status: 'new',
  lastContact: '', nextAction: '', nextFollowUpDate: '',
  priceGiven: '', notes: '', closedReason: '', timeline: [],
}

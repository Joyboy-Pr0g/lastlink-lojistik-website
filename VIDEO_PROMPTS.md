# LastLink — برومبتات فيديوهات 3D لـ Google Flow (Veo)

هذا الملف يحتوي على البرومبتات الجاهزة لإنشاء فيديوهات الموقع بصيغة **3D CGI render**
(وليس تصوير حقيقي، ولا رسوم كرتونية).

---

## ملخّص سريع

| # | الملف النهائي | المدة | النسبة | يُستخدم في |
|---|---|---|---|---|
| 1 | `public/vid/pickup.mp4` | 8s | 16:9 | قسم "How It Works" — الخطوة الأولى |
| 2 | `public/vid/dropoff.mp4` | 8s | 16:9 | قسم "How It Works" — الخطوة الأخيرة |
| 3 | `public/vid/hero.mp4` | 8s | 16:9 | خلفية الـ Hero + الخطوة 2 (العبور) |
| 4 | `public/vid/logo.mp4` | 4s | 16:9 → يُقتص 1:1 | أنيميشن اللوغو (شاحنة تسلّم اللوغو) |
| 5 | `public/vid/splash.mp4` | 4s | 16:9 | شاشة البداية ملء الشاشة (مرة لكل جلسة) |

بالإضافة إلى صورة غلاف لكل فيديو (frame واحد مُصدّر كـ JPG):

```
public/vid/pickup.jpg
public/vid/dropoff.jpg
public/vid/hero.jpg
```

> الموقع يشتغل بدون الفيديوهات — يظهر بدلها Canvas ثلاثي الأبعاد احتياطي.
> بمجرد ما تضع الملفات في `public/vid/` تشتغل تلقائياً بدون أي تعديل كود.

---

## هوية بصرية موحّدة (مهم جداً)

كل الفيديوهات لازم تبدو وكأنها من نفس المشهد ونفس الاستوديو. الثوابت:

| العنصر | القيمة |
|---|---|
| لون الخلفية / البيئة | Deep navy `#031E3B` |
| لون الإضاءة المميّزة (rim / accent) | Lime green `#65AF02` |
| الستايل | Stylized 3D CGI, physically based rendering, soft global illumination |
| الإضاءة | Low-key / dark studio, volumetric fog, green rim light |
| الكاميرا | Cinematic, shallow depth of field, بطيئة وناعمة |
| ممنوع | Cartoon, anime, toy look, flat 2D, live-action footage, نصوص، شعارات، وجوه واضحة |

---

## 1️⃣ الفيديو الأول — استلام الشحنة (Pickup)

**الملف:** `public/vid/pickup.mp4`

### البرومبت (انسخه كما هو إلى Google Flow)

```
A stylized 3D CGI animation, physically based rendering, cinematic product-visualization style.

SCENE: The interior of a modern logistics depot at night. A delivery courier in a dark navy
uniform stands beside an open van cargo door and receives a matte cardboard parcel, lifting it
with both hands and turning it slightly to scan a glowing label. Behind them, rows of stacked
parcels and a metal loading dock fade into darkness.

CAMERA: Slow cinematic dolly-in from a low three-quarter angle, drifting from left to right.
Shallow depth of field, 35mm lens, subtle handheld micro-movement. The parcel stays in focus,
the background falls into soft bokeh.

LIGHTING: Low-key dark studio lighting. Deep navy blue (#031E3B) ambient environment.
A single lime green (#65AF02) rim light traces the edge of the courier and the parcel.
Cool volumetric fog fills the depth of the room. Soft green light spills from the scanner.

MATERIALS: Matte recycled cardboard, brushed dark metal, soft fabric uniform,
subtle micro-scratches and dust particles floating in the light beams.

MOTION: Smooth, weighted, realistic. The parcel has real mass. No sudden cuts.
The shot must start and end on a similar framing so it can loop seamlessly.

MOOD: Premium, precise, quiet, high-tech, trustworthy.
```

### Negative prompt

```
cartoon, anime, comic, cel shading, flat 2d, illustration, toy, plastic look, clay render,
live action, real photography, stock footage, text, letters, words, watermark, logo, brand name,
close-up human face, distorted hands, extra fingers, bright daylight, white background,
orange, red, yellow color scheme, jump cut, fast motion, shaky camera
```

### الإعدادات في Flow

- **Model:** Veo 3.1 (أو الأحدث المتاح)
- **Aspect ratio:** 16:9
- **Resolution:** 1080p
- **Duration:** 8 ثوانٍ
- **Audio:** أطفئه (الموقع يشغّل الفيديو صامتاً — `muted`)

---

## 2️⃣ الفيديو الثاني — المشي والتسليم (Drop-off)

**الملف:** `public/vid/dropoff.mp4`

### البرومبت (انسخه كما هو إلى Google Flow)

```
A stylized 3D CGI animation, physically based rendering, cinematic product-visualization style.
Direct continuation of the same scene and same character.

SCENE: A quiet Canadian suburban street at blue hour, light snow on the ground. The same
delivery courier in a dark navy uniform walks along a concrete path carrying a matte cardboard
parcel, approaches a modern house porch, kneels, and places the parcel gently on the doorstep.
The courier then stands, steps back, and the camera holds on the parcel resting at the door.

CAMERA: Starts as a low tracking shot following the courier's legs and the path, then rises and
pushes forward into a slow medium shot of the parcel being placed down. Shallow depth of field,
35mm lens, smooth gimbal-like movement.

LIGHTING: Low-key blue hour. Deep navy blue (#031E3B) sky and ambient shadows.
A warm porch light and a lime green (#65AF02) rim light separate the courier from the background.
Volumetric fog and falling snow particles catch the light. Wet reflective concrete.

MATERIALS: Matte recycled cardboard, damp concrete, soft snow, dark fabric uniform,
frosted glass door panel, brushed metal house number plate (no readable text).

MOTION: Smooth, weighted, realistic walking cycle. The parcel is placed carefully, not thrown.
No sudden cuts. Camera movement is slow and continuous throughout.

MOOD: Calm, safe, reliable, the quiet satisfying end of a long journey.
```

### Negative prompt

```
cartoon, anime, comic, cel shading, flat 2d, illustration, toy, plastic look, clay render,
live action, real photography, stock footage, text, letters, words, watermark, logo, brand name,
house numbers, street signs, close-up human face, distorted hands, extra fingers,
throwing, dropping roughly, bright daylight, white background, orange, red, yellow color scheme,
jump cut, fast motion, shaky camera
```

### الإعدادات في Flow

نفس إعدادات الفيديو الأول تماماً (16:9 / 1080p / 8s / بدون صوت).

---

## 3️⃣ خلفية الـ Hero والعبور

**الملف:** `public/vid/hero.mp4`

> الموقع أصلاً فيه مشهد 3D تفاعلي في الـ Hero يتحرك مع الماوس.
> هذا الفيديو **بديل اختياري** إذا أردت خلفية فيديو بدلاً من المشهد التفاعلي.

```
A stylized 3D CGI animation, physically based rendering, abstract technical visualization.

SCENE: A dark topographic wireframe map of Canada floating in empty space, rendered as a fine
glowing grid. Thin lime green light trails travel along curved routes between five glowing
nodes across the map, leaving soft fading tails. A small low-poly delivery truck silhouette
moves slowly along one of the routes. Data particles drift upward.

CAMERA: Very slow orbital drift around the floating map, slight parallax, almost static.
Wide lens, deep perspective.

LIGHTING: Pure dark navy (#031E3B) void background. Lime green (#65AF02) emissive lines and
nodes are the only light source. Soft bloom, volumetric haze, subtle chromatic aberration.

MOTION: Continuous, hypnotic, seamless loop. No cuts. Extremely smooth.

MOOD: High-tech, controlled, infinite network, premium infrastructure.
```

### Negative prompt

```
cartoon, anime, flat 2d, illustration, live action, real photography, text, letters, words,
country labels, city names, watermark, logo, bright colors, white background, orange, red,
fast motion, jump cut
```

---

## 4️⃣ أنيميشن اللوغو — الشاحنة تسلّم اللوغو 🚚

**الملف:** `public/vid/logo.mp4` — ولّده **16:9** بمدة **4 ثوانٍ**، ثم اقتصّه مربعاً.

> **Google Flow لا يدعم 1:1 ولا 3 ثوانٍ.** أقصر مدة متاحة 4 ثوانٍ، والنِسَب المتاحة 16:9 أو 9:16.
> **الجواب: اختر 16:9 و 4 ثوانٍ.** البرومبت تحت يُجبر النموذج على وضع اللوغو داخل مربع
> في منتصف الكادر مع هوامش فارغة، فيصير الاقتصاص إلى 1:1 نظيفاً بلا قصّ للوغو.

> بمجرد ما تضع الملف، يظهر تلقائياً مكان اللوغو في الهيدر والفوتر.
> لو الملف غير موجود، يرجع تلقائياً للوغو الثابت — ما في شيء يتكسّر.

**الفكرة:** شاحنة شحن صغيرة ثلاثية الأبعاد تدخل الكادر، تُفتح أبوابها الخلفية،
ويخرج منها اللوغو ويستقر في المنتصف. قصة كاملة في 3 ثوانٍ — تربط اللوغو بمجال الشحن مباشرة.

---

### ⚠️ اقرأ هذا أولاً — مشكلة لازم البرومبت يحلّها

اللوغو فيه لونان:

| الجزء | اللون | المشكلة |
|---|---|---|
| حرفا C و L | Navy `#031E3B` | **داكن جداً** — يختفي تماماً على خلفية سوداء/داكنة |
| السهم | Green `#65AF02` | واضح على أي خلفية |

البرومبت الذي أعطاك إياه Gemini (خلفية *dark charcoal and obsidian*) **سيبتلع حرفي C و L بالكامل**.
لذلك كل برومبت تحت يعالج هذه النقطة صراحةً.

---

### 🅰️ الخيار الأول (موصى به) — خلفية فاتحة

الأنسب، لأن اللوغو الأصلي مصمم على أبيض: النيفي يظهر حاداً والأخضر يبقى قوياً.

```
A premium 3D animated logo reveal for a logistics and shipping company, using the uploaded
logo. Perfect 4-second seamless loop. 16:9 landscape format.

FRAMING — CRITICAL: All action must stay inside a CENTRED SQUARE SAFE AREA in the middle of the
16:9 frame. The left and right thirds of the frame must remain empty background, because this
video will be cropped to a square afterwards. The logo must never extend outside that central
square, and must stay perfectly centred horizontally and vertically.

STORY (4 seconds):
0.0–1.2s — A small, clean, modern cargo delivery van drives in from the left and stops dead
centre of the frame, settling on its suspension.
1.2–2.4s — Its rear cargo doors swing open, releasing a soft burst of light. The uploaded
logo's deep navy blue bracket shape and inner 'L' shape float out of the cargo bay and rotate
smoothly into their final position in mid-air above the van.
2.4–3.4s — The vibrant lime green (#65AF02) arrow shoots out of the van last, sweeps upward
through the bracket opening leaving a glowing green light trail, and locks into place,
completing the logo. The van fades softly away.
3.4–4.0s — The finished logo holds perfectly still and centred, then settles back to the
opening state so the clip loops with no visible cut.

BACKGROUND — CRITICAL: A bright, clean studio environment: soft platinum white and light cool
grey gradient with a gentle radial falloff and a subtle glossy floor reflection. The background
must stay LIGHT at all times, so the logo's DEEP NAVY BLUE (#031E3B) shapes read as strong dark
silhouettes against it. Never darken the background.

VAN DESIGN: A simple, stylised, modern electric cargo van with smooth rounded surfaces,
matte deep navy blue paint, and lime green accent trim. Completely blank panels — absolutely no
text, no writing, no numbers, no licence plate, no badges anywhere on the vehicle.

MATERIALS: The logo shapes are smooth matte-to-satin plastic with clean rounded bevels and soft
specular highlights. The green arrow is slightly emissive with a soft bloom.

LIGHTING: Bright, even, high-key three-point studio lighting. Soft contact shadow under the van
and the logo. Crisp premium product-render look.

CAMERA: Locked off, eye level, very slight slow push-in. The logo never leaves the frame.

MOTION: Smooth, precise, weighted, physically believable. The first and last frames match
exactly so the 4 seconds loop seamlessly with no visible cut.

MOOD: Premium, corporate, trustworthy, high-end tech.
```

**Negative prompt:**

```
dark background, black background, obsidian, charcoal, navy background, low key lighting,
dark scene, silhouette, logo blending into background, invisible logo, low contrast,
text, letters, words, company name, brand name, typography, signage, licence plate, number plate,
writing on the van, watermark, extra logos, duplicate logo, distorted logo, changed logo colors,
recoloured logo, red, orange, purple, cartoon, anime, flat 2d, hand drawn, toy, clay,
live action, real photography, fast motion, jump cut, camera shake, motion blur
```

---

### 🅱️ الخيار الثاني — خلفية داكنة (يطابق ألوان الموقع)

لو تريد الخلفية الداكنة، **لازم** إضاءة حافّة فضية قوية حول الحروف النيفي وإلا ستختفي.
هذا البرومبت يفرض ذلك صراحةً:

```
A premium 3D animated logo reveal for a logistics and shipping company, using the uploaded
logo. Perfect 4-second seamless loop. 16:9 landscape format.

FRAMING — CRITICAL: All action must stay inside a CENTRED SQUARE SAFE AREA in the middle of the
16:9 frame. The left and right thirds of the frame must remain empty background, because this
video will be cropped to a square afterwards. The logo must never extend outside that central
square, and must stay perfectly centred horizontally and vertically.

STORY (4 seconds):
0.0–1.2s — A small, clean, modern cargo delivery van drives in from the left through soft
volumetric haze and stops dead centre of the frame, headlights glowing.
1.2–2.4s — Its rear cargo doors swing open, spilling bright light into the fog. The uploaded
logo's deep navy blue bracket shape and inner 'L' shape float out of the cargo bay and rotate
smoothly into their final position in mid-air above the van.
2.4–3.4s — The vibrant lime green (#65AF02) arrow shoots out last, sweeps upward through the
bracket opening leaving a glowing green light trail with strong bloom, and locks into place,
completing the logo. The van dissolves into light particles.
3.4–4.0s — The finished logo holds perfectly still and centred, then settles back to the
opening state so the clip loops with no visible cut.

BACKGROUND: Deep charcoal and obsidian gradient with soft volumetric haze and slow drifting
light particles.

CRITICAL SEPARATION REQUIREMENT: The logo's shapes are DEEP NAVY BLUE (#031E3B) and would
otherwise disappear into this dark background. The navy shapes MUST therefore be rendered as
polished dark metal with a BRIGHT SILVER-WHITE RIM LIGHT tracing every edge, strong specular
highlights sliding across their bevelled faces, and a soft light-grey ambient reflection filling
their front surfaces. Their silhouette and inner cut-outs must stay clearly readable against the
background in every single frame. High edge contrast is mandatory.

VAN DESIGN: A simple, stylised, modern electric cargo van, smooth rounded surfaces, matte deep
navy paint with lime green accent trim and a silver rim light along its edges. Completely blank
panels — absolutely no text, no writing, no numbers, no licence plate, no badges.

LIGHTING: Cinematic low-key. A bright key light, a strong silver rim light on the navy shapes,
a green accent bounce from the arrow, and warm spill from the open cargo doors.

CAMERA: Locked off, eye level, very slight slow push-in. The logo never leaves the frame.

MOTION: Smooth, precise, weighted. First and last frames match exactly for a seamless 4-second loop.

MOOD: Premium, futuristic, high-end tech corporate.
```

**Negative prompt:**

```
flat lighting, navy shapes blending into background, invisible logo, low contrast,
unlit dark shapes, silhouette only, muddy shadows,
text, letters, words, company name, brand name, typography, signage, licence plate, number plate,
writing on the van, watermark, extra logos, duplicate logo, distorted logo, changed logo colors,
recoloured logo, red, orange, purple, cartoon, anime, flat 2d, toy, clay,
live action, real photography, fast motion, jump cut, camera shake
```

---

### إعدادات Flow لأنيميشن اللوغو

- **ارفع ملف اللوغو** (`public/logo.svg` أو PNG منه) في خانة **Ingredients / Reference image** —
  هذا يمنع Gemini من اختراع لوغو مختلف. هذه أهم خطوة.
- **Aspect ratio:** **16:9** (1:1 غير مدعوم — سنقتصّه بأنفسنا بعد التصدير)
- **Duration:** **4 ثوانٍ** (أقصر مدة متاحة)
- **Audio:** مطفأ

### نصائح خاصة بهذا الفيديو

1. **لو الشاحنة طلعت كرتونية** — أضف في البداية: `photorealistic 3D product render, Unreal Engine 5, ray traced reflections`.
2. **لو ظهرت كتابة على الشاحنة** — أعد التوليد، وشدّد في الـ negative على `writing on the van, text on vehicle`.
3. **لو اللوغو تغيّر شكله** — تأكد أن صورة اللوغو مرفوعة كـ reference، وأضف: `exact uploaded logo, do not redesign the logo`.
4. **لو اللوغو خرج عن المربع الأوسط** — أعد التوليد وشدّد على: `centred square safe area, empty left and right thirds, logo never leaves the central square`.

### الضغط بعد التصدير

الفيديو سيخرج 16:9، فنقتصّ المربع من منتصفه ثم نصغّره:

```bash
ffmpeg -i logo_raw.mp4 -vf "crop=ih:ih,scale=256:256" -c:v libx264 -crf 30 -preset slow -an -movflags +faststart logo.mp4
```

> `crop=ih:ih` يقتصّ مربعاً من وسط الكادر تلقائياً (بارتفاع الفيديو نفسه).

> 256×256 تكفي تماماً — اللوغو يُعرض بحجم 40×40 بكسل في الهيدر.
> الهدف: **أقل من 300 KB**.

---

## 5️⃣ شاشة البداية (Splash / Loading)

**الملف:** `public/vid/splash.mp4` — **16:9**، **4 ثوانٍ**، بدون loop.

> تظهر ملء الشاشة **مرة واحدة فقط لكل جلسة** عند فتح الموقع، ثم تختفي تلقائياً.
> تُغلق أيضاً بالنقر، أو بزر Escape، أو بعد 4.2 ثانية كحد أقصى.
> لو الملف غير موجود، تُلغى الشاشة فوراً ولا يراها أحد.

### الفرق عن فيديو اللوغو (`logo.mp4`)

| | `logo.mp4` | `splash.mp4` |
|---|---|---|
| الحجم على الشاشة | 40×40 بكسل في الهيدر | ملء الشاشة |
| التأطير | اللوغو يملأ الكادر | اللوغو صغير في الوسط مع فراغ واسع حوله |
| الخلفية | فاتحة أو داكنة | **داكنة إلزامياً** — يجب أن تذوب في خلفية الموقع `#01090F` |
| النهاية | loop مستمر | تنتهي على لقطة ساكنة نظيفة |

### البرومبت

```
A premium cinematic 3D splash screen animation for a logistics and shipping company, using the
uploaded logo. 16:9 landscape, 4 seconds, ends on a still hold. Full-screen title-card framing.

STORY (4 seconds):
0.0–1.3s — Out of deep darkness and drifting volumetric fog, a small stylised 3D cargo delivery
van drives in from the left, its headlights cutting through the haze, and stops dead centre.
1.3–2.6s — The van's rear cargo doors swing open and spill light into the fog. The uploaded
logo's deep navy blue bracket shape and inner 'L' shape float out of the cargo bay and rotate
smoothly into their final position in mid-air above the van.
2.6–3.5s — The vibrant lime green (#65AF02) arrow launches out of the van last, sweeps upward
through the bracket opening leaving a long glowing green light trail with strong bloom, and locks
into place, completing the logo. A soft ring of green light pulses outward across the floor.
3.5–4.0s — The van dissolves into drifting light particles. The completed logo holds perfectly
still, centred and small in the frame, as the fog settles.

BACKGROUND — CRITICAL: A near-black, very dark navy void (#01090F) with soft volumetric fog, a
faint reflective dark floor, and slow drifting dust particles. The background must stay extremely
dark and empty at the edges of the frame, so this clip blends seamlessly into a dark website.
No bright backdrop, no studio walls, no horizon line.

CRITICAL SEPARATION REQUIREMENT: The logo's shapes are DEEP NAVY BLUE (#031E3B) and would
otherwise disappear into this near-black background. The navy shapes MUST therefore be rendered
as polished dark metal with a BRIGHT SILVER-WHITE RIM LIGHT tracing every single edge, strong
specular highlights sliding across their bevelled faces, and a soft cool ambient reflection
filling their front surfaces. Their silhouette and inner cut-outs must stay clearly readable
against the darkness in every frame. High edge contrast is mandatory.

FRAMING — CRITICAL: This is a title card. The logo and van occupy only the CENTRAL THIRD of the
frame, small, with wide empty dark space on all sides. Nothing important may sit near the edges
of the frame.

VAN DESIGN: A simple, stylised, modern electric cargo van, smooth rounded surfaces, matte deep
navy paint with lime green accent trim and a silver rim light along its edges. Completely blank
panels — absolutely no text, no writing, no numbers, no licence plate, no badges.

LIGHTING: Cinematic low-key. One bright key light, a strong silver rim light on the navy shapes,
a green accent bounce from the arrow, and warm spill from the open cargo doors. Deep shadows.

CAMERA: Locked off, eye level, an almost imperceptible slow push-in. No orbiting, no shake.

MOTION: Smooth, weighted, confident. Everything comes to a complete, perfectly still rest on the
final frame — the clip ends, it does not loop.

MOOD: Premium, cinematic, futuristic, high-end tech corporate. The opening title of a brand film.
```

### Negative prompt

```
bright background, white background, light grey background, studio backdrop, daylight,
flat lighting, navy shapes blending into background, invisible logo, low contrast,
unlit dark shapes, silhouette only, logo filling the frame, logo touching frame edges,
text, letters, words, company name, brand name, tagline, typography, signage, licence plate,
number plate, writing on the van, loading bar, percentage, spinner, UI elements,
watermark, extra logos, duplicate logo, distorted logo, changed logo colors, recoloured logo,
red, orange, purple, cartoon, anime, flat 2d, toy, clay, live action, real photography,
fast motion, jump cut, camera shake, orbiting camera
```

### إعدادات Flow

- **ارفع ملف اللوغو** في خانة **Ingredients / Reference image** — أهم خطوة.
- **Aspect ratio:** 16:9
- **Duration:** 4 ثوانٍ
- **Audio:** مطفأ

### الضغط بعد التصدير

شاشة البداية تُعرض ملء الشاشة، فتحتاج دقة أعلى من فيديو اللوغو — لكنها أول ما يُحمّل،
فلازم تبقى خفيفة جداً:

```bash
ffmpeg -i splash_raw.mp4 -vf "scale=1280:-2" -c:v libx264 -crf 32 -preset slow -an -movflags +faststart splash.mp4
```

> الهدف: **أقل من 1.5 MB**. لو تجاوزها، ارفع `-crf` إلى 34.
> الفيديو يُعرض فوق خلفية داكنة موحّدة، فالضغط العالي لا يكاد يُلاحَظ.

### ملاحظة مهمة

لا تضع أي شريط تحميل أو نسبة مئوية داخل الفيديو — الموقع يرسم شريط التقدّم واسم
**LastLink** بنفسه فوق الفيديو، وأي نص داخل الفيديو سيتعارض معه.

---

## بعد التصدير — خطوات إلزامية

### 1. غيّر أسماء الملفات

```
pickup.mp4
dropoff.mp4
hero.mp4      (اختياري)
```

### 2. اضغط الفيديو (مهم للأداء)

فيديو Veo الخام ممكن يكون 30-60 MB. الهدف: **أقل من 3 MB لكل فيديو**.

```bash
ffmpeg -i pickup_raw.mp4 -vf "scale=1280:-2" -c:v libx264 -crf 30 -preset slow -an -movflags +faststart pickup.mp4
ffmpeg -i dropoff_raw.mp4 -vf "scale=1280:-2" -c:v libx264 -crf 30 -preset slow -an -movflags +faststart dropoff.mp4
```

> `-an` يحذف الصوت (الموقع يشغّله صامتاً أصلاً، فالصوت وزن زائد).
> `-movflags +faststart` يخلّي الفيديو يبدأ التشغيل قبل ما يكمل التحميل.

### 3. استخرج صورة الغلاف (Poster)

```bash
ffmpeg -i pickup.mp4 -ss 00:00:03 -vframes 1 -q:v 3 pickup.jpg
ffmpeg -i dropoff.mp4 -ss 00:00:05 -vframes 1 -q:v 3 dropoff.jpg
```

### 4. ضع الملفات هنا

```
public/
└── vid/
    ├── pickup.mp4
    ├── pickup.jpg
    ├── dropoff.mp4
    ├── dropoff.jpg
    ├── hero.mp4      (اختياري)
    └── hero.jpg      (اختياري)
```

خلاص. أعد تشغيل `npm run dev` والفيديوهات تشتغل تلقائياً.

---

## نصائح لتحسين النتيجة في Flow

1. **ولّد 3-4 نسخ من كل برومبت** واختر الأفضل — Veo نتائجه تختلف كل مرة.
2. **لو ظهر نص أو شعار في الفيديو** — أعد التوليد، لا تحاول تعديله.
3. **لو طلع كرتوني** — أضف في بداية البرومبت: `photorealistic 3D render, Octane render, Unreal Engine 5 cinematic`.
4. **لو الألوان طلعت فاتحة** — أضف: `extremely dark scene, low exposure, deep shadows, night`.
5. **للحفاظ على نفس الشخصية بين الفيديوين** — استخدم خاصية *Ingredients / reference frame* في Flow، وارفع آخر frame من الفيديو الأول كمرجع للفيديو الثاني.
6. **الحركة البطيئة أهم من التفاصيل** — الفيديو خلفية، لو الحركة سريعة راح تشتّت عن النص.

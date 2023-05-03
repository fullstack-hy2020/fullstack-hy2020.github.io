---
mainImage: ../../../images/part-0.svg
part: 0
letter: b
lang: ar
---

<div class="content">

قبل البدأ في البرمجة, سنتعرف على بعض مبادئ تطوير تطبيقات الانترنت بالاطلاع على مثال تطبيقي هنا: <https://studies.cs.helsinki.fi/exampleapp>.

تم تطوير هذا المثال لشرح بعض المبادئ, وليس بإي اعتبار مثال <i>لكيفية</i> تطوير التطبيقات الحديثة. على العكس يمكن التعرف على بعض التقنيات القديمة المستخدمة في تطوير تطبيقات الانترنت, والتي يمكن اعتبارها من <i>الممارسات السيئة</i> لبناء التطبيقات.

سيتم اتباع افضل الممارسات لبناء التطبيقات بداية من [الجزء 1](/en/part1) لآخر الدورة.

قم بالاطلاع على [المثال التطبيقي](https://studies.cs.helsinki.fi/exampleapp) باستخدام المتصفح, قد يستغرق بعض الوقت في بعض الأحيان.

تم تطبيق المادة العلمية للدورة باستخدام متصفح Chrome.

**القاعدة الأولى في تطوير تطبيقات الانترنت**: دائماً اجعل نافذة التطوير (Developer Console) مفتوحة. لأجهزة الماك, لفتح نافذة التطوير إضغط _fn_-_F12_ or _option-cmd-i_ في نفس الوقت. في ويندوز أو لينكس يمكنك فتح نافذة التطوير بالضغط على _Fn_-_F12_ or _ctrl-shift-i_ في نفس الوقت. يمكن أيضاً فتح النافذة من [القائمة المنسدلة](https://en.wikipedia.org/wiki/Menu_key).

تذكر <i>دائماً</i> ان تجعل نافذة التطوير مفتوحة أثناة تطوير التطبيقات.

نافذة التطوير تبدو كالتالي:

![شكل نافذة التطوير في المتصفح](../../images/0/1e.png)

تأكد ان واجهة <i>(Network) الشبكة</i> مفتوحة, وقم بالضغط على <i>(Disable cache) ايقاف تفعيل الذاكرة المؤقتة</i>. <i>(Preserve log) الاحتفاظ بالتفاصيل</i> مفيد جداً: تفعيل هذا الخيار يحفظ التفاصيل في حالة القيام باعادة تحميل الصفحة.

**ملحوظة:** اهم جزء من شاشة التطوير هو ال <i>(Console) الكونسول</i>. لكن في هذا الجزء سنتعرض فقط لواجهة <i>(Network) الشبكة</i>.

### HTTP GET وسيلة الاتصال

الخادم (server) والمتصفح كل منهما يقوم بالتواصل مع الآخر باستخدام نظام [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP). واجهة <i>(Network) الشبكة</i> تعرض تفاصيل التواصل بين المتصفح والخادم.

عند اعادة تحميل الصفحة تعرض شاشة الكونسول تفاصيل الأحداث التى تمت. (لإعادة تحميل الصفحة في نظام تشغيل ويندوز قم بالضغط على _Fn_-_F5_ keys. لنظام ماك, اضغط _command_-_R_. أو قم بالضغط على هذا الرمز في متصفحك &#8635;, ستعرض شاشة الكونسول حدثين تم حدوثمها في تلك العملية.

- The browser has fetched the contents of the page <i>studies.cs.helsinki.fi/exampleapp</i> from the server
- And has downloaded the image <i>kuva.png</i>

- قام المتصفح بتحميل محتويات الصفحة التالية <i>studies.cs.helsinki.fi/exampleapp</i> من الخادم.
- قام المتصفح بتحميل صورة <i>kuva.png</i>

![تبدو تلك الأحداث بهذا الشكل](../../images/0/2e.png)

اذا كنت تستخدم شاشة صغيرة, يمكنك تغيير حجم شاشة الكونسول لترى تلك الأحداث بشكل أفضل.

الضغط على الحدث الأول يظهر مزيد من التفاصيل عن الحدث:

![تفاصيل الحدث الأول](../../images/0/3e.png)

في الجزء العلوي, <i>(General) عام</i>, يظهر أن المتصفح قام بطلب الصفحة التالية <i><https://studies.cs.helsinki.fi/exampleapp></i> استخدام وسيلة الطلب [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET), يمكن التأكد أن الطلب تم بنجاح لاحتواء محتوى الرد من الخادم على كود الحاله [Status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) 200.

تحتوى معلومات الطلب والرد من الخادم على العديد من ال [headers](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields):

![شكل ال Headers المصاحبة للرد من الخادم](../../images/0/4e.png)

<i>مجموعة ال Headers المصاحبة لرد الخادم</i> بالأعلى تخبرنا كمثال, حجم الرد المرسل من الخادم بوحدة البايت وكذلك الوقت المستغرق للحصول على الرد. من اهم ال Headers المصاحبة للرد هو [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) تخبرنا قيمة هذا ال Header ان المحتوى نصي من نوع [utf-8](https://en.wikipedia.org/wiki/UTF-8) وتم تهيئتة لصيغة HTML. بهذه الطريقة يعرف المتصفح ان محتوى الرد هو من نوع [HTML](https://en.wikipedia.org/wiki/HTML) ويقوم بالتعامل معه كصفحة انترنت برسم محتوياته في الصفحة.

الجزء الخاص بال <i>(Response) الرد من الخادم</i> يوضح ان نوع بيانات محتوى الرد هو, صفحة HTML عادية. وكذلك قيمة ال <i>المحتوى</i> يوضح شكل وتكوين الصفحة المرسلة من الخادم.

![صورة قسم الرد من الخادم](../../images/0/5e.png)

تحتوى الصفحة على [div](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div) عنصر من نوع, والذي يحتوى على عنوان, ورابط لصفحة الملاحظات <i>notes</i>, وكذلك صورة [img](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img), ويظهر أيضاً عدد الملاحظات التى تم انشاءها.

Because of the img tag, the browser does a second <i>HTTP request</i> to fetch the image <i>kuva.png</i> from the server. The details of the request are as follows:

لوجود عنصر من نوع (img) صورة, يقوم المتصفح بارسال طلب آخر الى الخادم <i>HTTP request</i> لطلب بيانات الصورة <i>kuva.png</i> وتظهر تفاصيل الطلب كالتالى:

![تفاصيل الطلب الثاني](../../images/0/6e.png)

تم ارسال الطلب الى العنوان التالي: <https://studies.cs.helsinki.fi/exampleapp/kuva.png> باستخدام الوسيله HTTP GET. ويمكن معرفة حجم البيانات المرسله من ال Headers ويقدر ب 89350 bytes, وكذلك نوع البيانات [Content-type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) <i>(image/png) صورة بهيئة png</i>, يستخدم المتصفح تلك المعلومات ليقوم بالتعامل مع البيانات بصورة صحيحه وعرض الصورة على الشاشة.

يوضح الشكل التالي تسلسل الأحداث عند زيارة الرابط التالي <https://studies.cs.helsinki.fi/exampleapp> لتالي [(sequence diagram) الرسم التسلسلي](https://www.geeksforgeeks.org/unified-modeling-language-uml-sequence-diagrams/):

![الرسم التسلسلي للأحداث بالأعلى](../../images/0/7m.png)

الرسم التسلسلى يوضح التواصل بين المتصفح والخادم عبر الزمن مرتبه من الأعلى للأسفل, يظهر الطلب الأول المرسل للخادم, ثم الرد من الخادم على هذا الطلب.

أولاُ, يقوم المتصفح بارسال طلب للخادم باستخدام الوسيلة HTTP GET لاحضار ال HTML الخاص بالصفحة. وجود العنصر <i>img</i> يوجه المتصفح لطلب بيانات الصورة <i>kuva.png</i>. ويقوم المتصفح بعرض الصورة في الصفحة الحالية.

بالرغم من صعوبة ملاحظة تتابع معالجة الصفحة من قبل المتصفح. الا أن المتصفح يقوم بعرض محتوى الصفحة HTML قبل رسم الصورة المستلمة من الخادم.

### تطبيقات الانترنت المعتاده

الصفحة الرئيسية للتطبيق المذكور تم تطويرها باستخدام <i>الطريقة المعتادة لتطوير التطبيقات</i>. عند زيارة الصفحة, يقوم المتصفح بطلب محتوى HTML الذي يوضح تفاصيل بناء محتوى الصفحة وكذلك المحتوى النصي المراد عرضه.

يقوم الخادم بتكوين هذه الصفحة بطريقة ما. قد تكون صفحة <i>ثابتة</i> المحتوى تم حفظها في الخادم. وقد تكون صفحه <i>تفاعلية</i> طبقاً لتطبيق الخادم المستخدم, كمثال استخدام محتوى موجود في قاعدة بيانات لكل طلب.

يحتوى الكود المرسل من الخادم للصفحة المذكورة على أجزاء تفاعليه يتم تغيير محتواها مثال عدد الملاحظات التى تم انشاءها.

يظهر الكود المسلتم من الخادم بصيغة HTML كالتالي:

```js
const getFrontPageHtml = noteCount => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <div class='container'>
          <h1>Full stack example app</h1>
          <p>number of notes created ${noteCount}</p>
          <a href='/notes'>notes</a>
          <img src='kuva.png' width='200' />
        </div>
      </body>
    </html>
`
}

app.get('/', (req, res) => {
  const page = getFrontPageHtml(notes.length)
  res.send(page)
})
```

ليس مطلوب منك أن تفهم هذا الجزء بعد. سنتعرض لذلك لاحقاً.

محتوى الصفحة بصيغة HTML تم حفظه كقالب نصي (template string) أو قيمة نصية يمكن معالجتهاو كمثال يحتوى على متغيرات, مثل <em>noteCount</em>, هذا الجزء التفاعلي من الصفحة يمكن تغييره عند كل طلب فيتم تغييره بعدد الملاحظات<em>noteCount</em>.

كتابة الكود بصيغة HTML لا يتطلب ذكاءاً, ولكن يستطيع مبرمجي لغة PHP كتابة هذا الكود بسهولة.

In traditional web applications, the browser is "dumb". It only fetches HTML data from the server, and all application logic is on the server. A server can be created using [Java Spring](https://spring.io/projects/spring-framework) , [Python Flask](https://flask.palletsprojects.com/en/2.2.x/) or [Ruby on Rails](http://rubyonrails.org/) to name just a few examples.

في حال استخدام النمط الاعتيادي في تطوير تطبيقات الانترنت. لا يقوم المتصفح بمعالجة ذكية للمحتوى. فقط يرسل المتصفح الطلبات للخادم لجلب المحتوى ويقوم الخادم بتجهيز وارسال المحتوى المطلوب طبقاً لبرمجة تطبيق الخادم والشروط المنطقية المتبعة في معالجة الطلبات المستلمة. ويمكن تطوير تطبيقات الخوادم باستخدام عدد من لغات البرمجة واطارات العمل الملحقة بها مثل [Java Spring](https://spring.io/projects/spring-framework) , [Python Flask](https://flask.palletsprojects.com/en/2.2.x/) or [Ruby on Rails](http://rubyonrails.org/) وغيرها.

المثال المذكور للخادم تم تطويرة باستخادم مكتبة [Express](https://expressjs.com/) ولغة Node.js. سيتم استخدام تلك المكتبة مع لغة نود لبرمجة تطبيقات الخوادم.

### تشغيل التطبيق في المتصفح

قم بإبقاء واجهة الكونسول مفتوحة. وقم بمسح التفاصيل السابقة بالضغط على 🚫, أو بكتابة الأمر clear() في واجهة الكونسول.

Now when you go to the [notes](https://studies.cs.helsinki.fi/exampleapp/notes) page, the browser does 4 HTTP requests:

قم بزيارة صفحة الملاحظات [notes](https://studies.cs.helsinki.fi/exampleapp/notes), نلاحظ قيام المتصفح بإرسال 4 طلبات للخادم:

![صورة توضح الطلبات المرسلة](../../images/0/8e.png)

كل الطلبات المرسلة تحتوى على <i>أنواع متعددة</i>. نوع الطلب الأول هو <i>(document) مستند</i>. تحتوى على محتوى الصفحة والذي يظهر كالتالي:

![تفاصيل الطلب الأول](../../images/0/9e.png)

عند مقارنة الصفحة المعروضة على المتصفح والكود البرمجي بصيغة HTML المرسل من الخادم, نلاحظ هذا المحتوى لا يحتوى على قائمة الملاحظات.

The [head](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head) section of the HTML contains a [script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) tag, which causes the browser to fetch a JavaScript file called <i>main.js</i>.

قسم ال [head](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head) من صفحة ال HTML تحتوى على عنصر [script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script), والذي يوجه المتصفح لطلب ملف برمجي باسم <i>main.js</i>.


يظهر الكود البرمجي بلغة JavaScript جافاسكريبت يظهر كالتالي:

```js
var xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    console.log(data)

    var ul = document.createElement('ul')
    ul.setAttribute('class', 'notes')

    data.forEach(function(note) {
      var li = document.createElement('li')

      ul.appendChild(li)
      li.appendChild(document.createTextNode(note.content))
    })

    document.getElementsByClassName('notes').appendChild(ul)
  }
}

xhttp.open('GET', '/data.json', true)
xhttp.send()
```

ليس من المهم فهم تفاصيل الكود البرمجي المذكور الآن, ولكن كنظرة عامة الكود المذكور يستخدم لتنسيق الصور والنصوص. سنبدأ بكتابة الكود البرمجي من [الجزء الأول](/en/part1). الكود البرمجي المذكور كمثال لا يعتبر بأي شكل مثال يمكن اتباعه في تعلم تقنيات البرمجة لهذا الكورس.

> قد يتسائل البعض لم تم استخدام تقنية xhttp-object بدلاً من استخدام التقنيات الحديثة مثل fetch. والسبب في ذلك هو تخطي التعرف على تقنية ال promises حالياً, وتم استخدام هذا الكود البرمجي لهدف آخر لهذا الجزء. سنقوم باستعراض الطرق الحديثة لارسال الطلبات من المتصفح للخادم في [الجزء 2](/en/part2).

فور استلام الكود البرمجي لعنصر <i>script</i>, يبدأ المتصفح في تنفيذ ذلك الكود.

آخر سطرين من الكود توجه المتصفح لارسال طلب للخادم باستخدام وسيلة HTTP GET لعنوان الخادم المذكور<i>/data.json</i>:

```js
xhttp.open('GET', '/data.json', true)
xhttp.send()
```

هذا الطلب يظهر آخراً في واجهة الشبكة (Network).

يمكن زيارة الرابط مباشرة من المتصفح <https://studies.cs.helsinki.fi/exampleapp/data.json> للاطلاع على محتوى الملف المطلوب.

![بيانات بصيغة JSON](../../images/0/10e.png)

ويمكننا عرض الملاحظات بصيغة [JSON](https://en.wikipedia.org/wiki/JSON) "الصيغة الخام للبيانات". افترضياً المتصفحات من نوع Chromium تقوم بعرض المعلومات بصيغة JSON بطريقة ليست مثالية. لكن يمكن استخدام ملحقات المتصفح لعمل تنسيق البيانات بصورة أفضل. يمكن تثبيت الملحق [JSONVue](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) بعد التثبيت قم باعادة تحميل الصفحة وستلاحظ ان البيانات تظهر بتنسيق أفضل.

![تنسيق الملف بصيغة JSON](../../images/0/11e.png)

بذلك, يعمل الكود البرمجي بلغة جافاسكريبت بتحميل الملاحظات بصيغة JSON. ثم يقوم بإنشاء قائمة من الملاحظات من المحتوى المستلم.

الجزء التالي من الكود البرمجي يوضح تلك العملية:

```js
const data = JSON.parse(this.responseText)
console.log(data)

var ul = document.createElement('ul')
ul.setAttribute('class', 'notes')

data.forEach(function(note) {
  var li = document.createElement('li')

  ul.appendChild(li)
  li.appendChild(document.createTextNode(note.content))
})

document.getElementById('notes').appendChild(ul)
```

الكود البرمجي المذكور يقوم بإنشاء قائمة عشوائية من نوع [ul](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul)...

```js
var ul = document.createElement('ul')
ul.setAttribute('class', 'notes')
```

... ثم يقم بانشاء واضافة عنصر للقائمة من نوع [li](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li) لكل ملاحظة. ويكون <i>محتوى</i> ذلك العنصر هو محتوى الملاحظة الحالية. بيانات ال timestamps الموجودة في البيانات المستلمة غير مستخدمة حالياً.

```js
data.forEach(function(note) {
  var li = document.createElement('li')

  ul.appendChild(li)
  li.appendChild(document.createTextNode(note.content))
})
```

قم بفتح واجهة <i>الكونسول</i> في نافذة التطوير:

![صورة واجهة الكونسول](../../images/0/12e.png)

بالضغط على المثلث في بداية السطر يمكن عرض تفاصيل ذلك العنصر.

![صورة لتفاصيل احدى العناصر](../../images/0/13e.png)

مخرجات الكونسول تم انشائها باستخدام السطر البرمجي <em>console.log</em>:


```js
const data = JSON.parse(this.responseText)
console.log(data)
```

لذلك, عند استقبال البيانات من الخادم, يقوم الكونسول بطباعته في واجهة الكونسول.

واجهة الكونسول <i>Console</i> والسطر البرمجي <em>console.log</em> سيتم استخدامهم بكثرة خلال الدورة.

### معالجة الأحداث ووظائف المعالجة اللاحقة (Callback Functions)

الكود البرمجي التالي قد يكون غير واضح قليلاً:

```js
var xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
  // code that takes care of the server response
}

xhttp.open('GET', '/data.json', true)
xhttp.send()
```

يتم ارسال الطلب للخادم في السطر الأخير من الكود البرمجي, ويرجى ملاحظة أن الكود البرمجي الخاص بمعالجة الرد المستلم من الخادم تم ذكرها قبل ذلك السطر. لماذا تم تنظيم الكود بهذا الترتيب ؟

```js
xhttp.onreadystatechange = function () {
```

في هذا السطر, نلاحظ <i>معالج الحدث</i> الخاص بحدث <i>onreadystatechange</i> تم تعريفه لعنصر <em>xhttp</em> الخاص بذلك الطلب. عند تغير حالة الطلب [readyState](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState)للحالة ذات القيمة 4 والتي توضح <i>اكتمال العملية</i> وكذلك كود الرد المرسل من الخادم بالقيمة 200 والذي يوضح نجاح الرد من طرف الخادم.

```js
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    // code that takes care of the server response
  }
}
```

ميكانيكية تفعيل معالجات الأحداث (event handlers) هي من الأنماط الشائعة الاستخدام في لغة جافاسكريبت. تلك المعالجات يطلق عليها وظائف المعالجة الأحداث اللاحقة [callback functions](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function). لا يقوم الكود البرمجي بتفعيل تلك الوظائف ولكن يقوم بذلك بيئة التشغيل الخاصة بالمتصفح. بحيث يقوم بتنفيذ الوظيفة في الوقت المناسب عند تلقى نتيجة <i>الحدث</i>.

### نموذج عناصر المستند وما يعرف ب Document Object Model (DOM)

يمكن اعتبار صفحة الانترنت بصيغة HTML كتفصيل ضمني لتكوين مماثل للتكوين الشجري التالي.

<pre>
html
  head
    link
    script
  body
    div
      h1
      div
        ul
          li
          li
          li
      form
        input
        input
</pre>

ذلك التكوين المشابه للتكوين الشجري يمكن الاطلاع عليه من نافذة الكونسول بالضغط على قسم <i>Elements</i>.

![صورة توضح نافذة عناصر الصفحة](../../images/0/14e.png)

وظائف المتصفح تعتمد على تصور عناصر صفحة HTML كتكوين شجري.

نموذج عناصر الصفحة أو ما يعرف ب [DOM](https://en.wikipedia.org/wiki/Document_Object_Model), يعرف بواجهة التطبيق (<i>API</i>) والتى تمكن المطور من تعديل <i>شجرة العناصر</i> المطابقة لصفحة الانترنت.

في الكود الرمجي المذكور سابقاً بلغة جافاسكريبت يستخدم تلك الواجهه DOM-API لإضافة العناصر التى تحتوى على ملاحظات للصفحة.

الكود البرمجي التالي يقوم بإنشاء عنصر من نوع <em>ul</em> ويتم تعيين ذلك العنصر للمتغير صاحب المعرف ul, وكذلك يتم اضافة عناصر تابعة لذلك العنصر أسفل ذلك العنصر في التكوين الشجري.

```js
var ul = document.createElement('ul')

data.forEach(function(note) {
  var li = document.createElement('li')

  ul.appendChild(li)
  li.appendChild(document.createTextNode(note.content))
})
```

نهائياً, فرع التكوين الشجري للصفحة من النوع <em>ul</em> يتم اضافتة بمحتويات الصفحة في المكان المناسب.


```js
document.getElementsByClassName('notes').appendChild(ul)
```

### التعديل في نموذج عناصر الصفحة من واجهة الكونسول

أعلى التكوين الشجري من المستند بصيغة HTML يعرف بإسم <em>document</em>. يمكن إجراء عمليات مختلفة على الصفحة باستخدام DOM-API. يمكن الوصول لعنصر <em>document</em> بكتابة <em>document</em> في واجهة الكونسول:

![عنصر document في نافذة التطوير](../../images/0/15e.png)

يمكن اضافة ملاحظة جديدة للصفحة الحالية من الكونسول مباشرة.

أولاً, نقوم باحضار قائمة الملاحظات من الصفحة. الكود البرمجي يوضح احضار أول قائمة موجودة في الصفحة:

```js
list = document.getElementsByTagName('ul')[0]
```

ثم قم بإنشاء عنصر من نوع li وقم بتعيين المحتوى لهذا العنصر كالتالي:

```js
newElement = document.createElement('li')
newElement.textContent = 'Page manipulation from console is easy'
```

ثم قم بإضافة العنصر لقائمة العناصر: 

```js
list.appendChild(newElement)
```

![صورة توضح العنصر الجديد المضاف حديثاً للصفحة](../../images/0/16e.png)

بالرغم من تغيير المحتوى الحالي للصفحة. إلا أنه ذلك التغيير مؤقت. عند اعادة تحميل الصفحة ستختفى تلك الملاحظة الجديدة. والسبب أن تلك الملاحظة لم يتم إرسالها للخادم. الكود البرمجي الذي يقوم المتصفح بطلبه من الخادم سيقوم دائماً بإنشاء عناصر القائمة بناءاً على ملف البيانات المطلوب من الخادم بصيغة JSON والذي يتم طلبه باستخدام الرابط التالي <https://studies.cs.helsinki.fi/exampleapp/data.json>

### (CSS) لغة تنسيق المستندات

يحتوي عنصر <i>head</i> الموجود في صفحة HTML لصفحة الملاحظات على عنصر من نوع [link](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link), والذي يوجه المتصفح لطلب ملف التنسيق من نوع [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) باستخدام العنوان التالي [main.css](https://studies.cs.helsinki.fi/exampleapp/main.css).

Cascading Style Sheets (CSS), هي لغة تنسيق المستندات المستخدمة في تحديد المظهر الخارجي لصفحات الانترنت.


ملف التنسيق بصيغة CSS يكون كالتالي:

```css
.container {
  padding: 10px;
  border: 1px solid;
}

.notes {
  color: blue;
}
```

يوضح الملف أعلاه اثنين من محددات الفئة [class selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors). وتستخدم هذه المحددات في تحديد أجزاء معينه من الصفحة لتعريف الشكل الخارجي لتلك الأجزاء باستخدام قواعد التنسيق الخاصة بلغة CSS.

محددات الفئة (class selector) تبدأ دائماً بالنقطه ويحتوى اسم تعريف الفئة.

الفئات هي [(attributes) صفات](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class), يمكن اضافتها لعناصر HTML.

صفات CSS الملحقة بعناصر HTML يمكن الاطلاع عليها من واجهة <i>(elements) العناصر</i> في نافذة الكونسول.

![صورة لواجهة العناصر في الكونسول](../../images/0/17e.png)

الجزء الخارجي من النوع <i>div</i> يحتوى على صفة من الفئة <i>container</i>. ويحتوى عنصر <i>ul</i> الذي يحتوى على عناصر الملاحظات على صفة من الفئة <i>notes</i>.

تحدد قواعد التنسيق الخاصة بلغة CSS للعناصر التى من الفئة <i>container</i> شكل تلك العناصر بأن تحتوى على إطار خارجي بعرض 1 بكسل, للتفاصيل قم بزيارة الرابط [border](https://developer.mozilla.org/en-US/docs/Web/CSS/border). كذلك قيمة المسافة الداخلية ب 10 بكسل, للمزيد راجع الرابط [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding). هذه القاعدة تضيف مسافة داخلية فارغة بين محتوى العنصر والإطار الخارجي لذلك العنصر.

القاعدة الثانية بلغة CSS تستخدم لتعين لون نص <i>الملاحظة</i> باللون الأزرق.

يمكن لعناصر HTML أن تحتوى على صفات أخرى (attributes) غير الفئات (classes). فالعنصر من النوع <i>div</i> الذي يحتوى على الملاحظات على صفة (attribute) [id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id). يمكن استخدام ذلك المعرف (id) لإيجاد عنصر محدد بإستخدام لغة جافاسكريبت.

واجهة <i>(Elements) العناصر</i> من الكونسول يمكن استخدامها لتعديل تنسيق العناصر.

![واجهة العناصر في لوحة التطوير](../../images/0/18e.png)

التعديلات المضافة من خلالة واجهة الكونسول هى تعديلات مؤقتة, لجعل تلك التعديلات ثابتة يجب حفظها وإرسالها للخادم.

### تحميل صحفة تحتوى على جافاسكريبت - مراجعة

لنراجع ماذا يحدث عند فتح صفحة <https://studies.cs.helsinki.fi/exampleapp/notes> في المتصفح.

![رسم توضيحي لتسلسل الأحداث بين المتصفح والخادم](../../images/0/19m.png)

- يقوم المتصفح بطلب كود HTML الذي يوضح تكوين الصفحة وكذلك المحتوى لتلك الصفحة من الخادم باستخدام وسيلة HTTP GET.
- العناصر من نوع link توجه المتصفح لطلب ملف التنسيق بلغة CSS <i>main.css</i>...
- ...وكذلك يتم طلب الملف البرمجي بلغة جافاسكريبت <i>main.js</i>
- يقوم المتصفح بتنفيذ كود جافاسكريبت. والذي بدوره يقوم بإرسال طلب للخادم باستخدام وسيلة HTTP GET للرابط التالي <https://studies.cs.helsinki.fi/exampleapp/data.json>, ويقوم الخادم بالرد بالبيانات المطلوبة بصيغة JSON.
- عند استلام البيانات, يقوم المتصفح باستدعاء معالج الحدث <i>event handler</i>, والذي بدوره يقوم بعرض الملاحظات على الصفحة باستخدام DOM-API.

### الاستمارات ووسيلة HTTP POST

بعد ذلك, لنتعرف على كيفية اضافة ملاحظة.

تحتوى الصفحة على عنصر من نوع [form element](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form).

![صورة توضح عنصر من نوع form](../../images/0/20e.png)

عند الضغط على الزر الملحق بعنصر ال form, يقوم المتصفح بإرسال مدخلات المستخدم للخادم. عند استعراض واجهة الشبكة <i>Network</i> يمكن استعراض بيانات الاستمارة المرسلة كالتالي:

![صورة توضح البيانات المرسلة للخادم من عنصر form](../../images/0/21e.png)

من العجيب, أن ارسال بيانات الاستمارة (form) يتبعه ارسال <i>خمسة</i> طلبات للخادم.
الطلب الأول ينتمي لحدث إرسال بيانات الاستمارة (form). يمكن التكبير لايضاح التفاصيل:

![تفاصيل الطلب الأول](../../images/0/22e.png)

يوضح القيام بإرسال طلب باستخدام الوسيلة [HTTP POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) للخادم على الرابط المعرف ب <i>new\_note</i>. يقوم الخادم بالرد على الطلب بالكود 302. والذي يوضح توجيه المتصفح باعادة التوجيه [URL redirect](https://en.wikipedia.org/wiki/URL\_redirection), وبذلك يطلب الخادم من المتصفح بتنفيذ طلب آخر باستخدام الوسيلة HTTP GET للقيمة الخاصة بال Header <i>Location</i> وهو عنوان صفحة الملاحظات <i>notes</i>.

وبذلك, يقوم المتصفح باعادة تحميل صفحة الملاحظات. وتبعاً لذلك يحدث 3 طلبات أخرى: طلب ملف التنسيق (main.css), وكذلك الكود البرمجي بلغة جافاسكريبت (main.js), وكذلك بيانات الملاحظات (data.json)

وتوضح أيضاً واجهة الشبكة (network) البيانات المرسلة من الاستمارة (form):

ملاحظة: في النسخ الأحدث من المتصفح كروم Chrome, يمكن الاطلاع على البيانات المرسلة من الاستمارة تحت قسم Payload, بجانب قسم ال Headers.

![يوضح الشكل التالي بيانات الاستمارة المرسلة](../../images/0/23e.png)

العناصر من النوع form يمكن اضافة صفة (attribute) <i>action</i> وكذلك <i>method</i>, وتلك الصفات توجة المتصفح لاستخدام الوسيلة HTTP POST لارسال طلب للرابط <i>new_note</i>.

![صورة توضح الصفات المذكورة attributes](../../images/0/24e.png)

الكود البرمجي التالي الموجود على الخادم مسؤل عن معالجة الطلبات من النوع POST وهو كود بسيط (ملاحظة: هذا الكود البرمجي موجود على الخادم فقط ولا يتم ارسالة للمتصفح):

```js
app.post('/new_note', (req, res) => {
  notes.push({
    content: req.body.note,
    date: new Date(),
  })

  return res.redirect('/notes')
})
```

بتم ارسال البيانات للخادم ملحقة بقسم [body](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) الخاص بالطلب من النوع POST.

ويمكن للخادم الحصول على تلك البيانات عن طريق الخاصية body الملحقة بتفاصيل الطلب <em>req.body</em>.

ويقوم الخادم بإنشاء ملحوظة جديدة ويقوم بإضافتها للقائمة (array) المسماه <em>notes</em>.

```js
notes.push({
  content: req.body.note,
  date: new Date(),
})
```

تحتوى الملاحظة على عنصرين: <i>content</i> والتي تحتوى على محتوى الملاحظة و كذلك <i>date</i> والتي توضح التاريخ والوقت الذي تم إنشاء الملاحظة فيه.

لا يقوم الخادم بحفظ الملاحظة في قاعدة البيانات, لذا اعادة تشغيل الخادم يفقده تلك الملاحظات التى تم انشاءها.

### AJAX تقنية

صفحة ملاحظات التطبيق تتبع طريقة كانت تستخدم في بداية التسعينات لتطوير تطبيقات الانترنت وهي تقنية "Ajax".

[AJAX](<https://en.wikipedia.org/wiki/Ajax_(programming)>) (Asynchronous JavaScript and XML) هو تعبير تم تقديمة في فبراير 2005 كوسيلة لتحسين تقنيات المتصفح وهي تقنية ثورية لطلب محتوى صفحات الانترنت باستخدام لغة جافاسكريبت المضمنه في ملفات HTML, دون الحاجه لعرض صفحات الانترنت اولاً.

قبل تقنية AJAX, كانت صفحات الانترنت تعمل ب [التقنيات التقليدية](/en/part0/fundamentals_of_web_apps#traditional-web-applications) والتى تعرضنا اليها في هذا الجزء.

كل البيانات المعروضة على صفحة التطبيق تم طلبها من الخادة بصيغة HTML.

ويتم طلب بيانات الملاحظات بواسطة تقنية AJAX. وعملية ارسال مدخلات الاستمارة (form) تتم بالطريقة التقليدية.

روابط التطبيق URLs توضح الطريقة القديمة من الأيام الخوالي. ويتم طلب بيانات بصيغة JSON من الرابط <https://studies.cs.helsinki.fi/exampleapp/data.json> ويتم ارسال المدخلات للرابط التالي <https://studies.cs.helsinki.fi/exampleapp/new_note>.

في أيامنا الحالية, النمط المستخدم في الروابط يعتبر غير مقبول, لأنها لا تتبع النمط المتعارف عليه والذي يعرف ب [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services), وسيتم التعرف عليه بالتفصيل في [الفصل 3](/en/part3).

الاستخدام المفرط لتقنية AJAX حالياً جعل منها تقنية الزامية لدرجة ان اسم التقنية لم يعد متداولاً بين الأجيال الحديثة من المتطورين وأصبحت جزءاً مهماً من تطوير تطبيقات الانترنت.

### تطبيقات الصفحة الواحدة (SPA)

في التطبيق المذكور أعلاه, تعمل الصفحة الرئيسية بالطريقة التقليدية: يقوم الخادم بكل العمليات المنطقية وانشاء صفحات HTML وارسالها للمتصفح والذي بدوره يقوم فقط بعرض تلك الصفحات.

صفحة الملاحظات تعطى بعض المسؤلية في انشاء الكود البرمجي بصيغة HTML للملاحظات الحالية للمتصفح. ويقوم المتصفح بتنفيذ الكود البرمجي بلغة جافاسكريبت المستلم من الخادم. وبدورة يقوم بارسال طلب للخادم للحصول على بيانات الملاحظات ثم يتم اضافة عناصر HTML لتلك الملاحظات لعرضها على الصفحة باستخدام [DOM-API](/en/part0/fundamentals_of_web_apps#document-object-model-or-dom).

في السنوات القليلة السابقة, تقنية [Single-page application](https://en.wikipedia.org/wiki/Single-page_application) (SPA) ظهرت بوضوح للساحة التقنية. فالتطبيقات التى تتبع تقنية الصفحة الواحدة (SPA) لا تقوم بطلب كل صفحة من صفحات الموقع بصورة منفصلة كما هو الحال في التطبيق المذكور سابقاً ولكن يتم طلب صفحة واحدة بصيغة HTML من الخادم, ويتم التحكم في محتويات تلك الصفحة باستخدام لغة جافاسكريبت التي يمكن تنفيذها بواسطة المتصفح.

أما صفحة الملاحظات من التطبيق فتتبع نمط مشابه لتقنية SPA ولكن ليست مشابهه تماماً لها. وبالرغم من أن العمليات المنطقية المصاحبة لعرض الملاحظات في الصفحة بتم تنفيذها في المتصفح, سيتم اتباع الطريقة التقليدية لإضافة ملاحظات جديدة ويتم ارسال مدخلات الاستمارة (form) عند الضغط على زر الاسال المحلق بها, ويقوم الخادم بعد هذه العملية بتوجية المتصفح لإجراء عملية اعادة تحميل للصفحة فيما يعرف بال <i>redirect</i>.

يمكنك الاطلاع على نفس التطبيق بتقنية SPA من هنا <https://studies.cs.helsinki.fi/exampleapp/spa>.

لوهلة يبدو التطبيق مماثل تماماً للتطبيق السابق.

الكود البرمجي بصيغة HTML مماثل تماماً, ولكن الكود البرمجي الملحق والمكتوب بلغة جافاسكريبت مختلف تمامً (<i>spa.js</i>) وستلاحظ اختلاف طفيف في كيفية تعريف عنصر ال form:

![تم حذف ال method و action من صفات ال form](../../images/0/25e.png)

لا يحتوى عنصر ال form على صفة (attribute) <i>action</i> ولا <i>method</i> والتى تستخدم في تعيين وجهة وطريقة ارسال مدخلات الاستمارة form:

قم بفتح واجهة الشبكة <i>Network</i> وقم بمسح محتوياتها. عند انشاء ملاحظة جديدة, ستلاحظ أن المتصفح يقوم بإرسال طلب واحد فقط للخادم.

![واجهة الشبكة](../../images/0/26e.png)

الطلب من نوع POST للعنوان التالي <i>new\_note\_spa</i> يحتوي على تفاصيل الملاحظة التى تم انشائها بصيغة JSON وتحتوى على محتوى النصي للملاحظة (<i>content</i>) وكذلك تاريخ الإنشاء (<i>date</i>):

```js
{
  content: "single page app does not reload the whole page",
  date: "2019-05-25T15:15:59.905Z"
}
```

نوع المحتوى <i>Content-Type header</i> يوجة الخادم أنا البيانات المرسلة تم ارسالها بالصيغة JSON.

![نوع المحتوى في نافذة التطوير Content Type Header](../../images/0/27e.png)

بدون استخدام ذلك ال Header, لن يستطيع الخادم معالجة البيانات بصورة صحيحة.

يقوم الخادم بالرد على الطلب بكود الحالة 201 / تم الانشاء [201 created](https://httpstatuses.com/201). هذه المرة لا يوجه الخادم المتصفح بالتحويل, يظل المتصفح في نفس الصفحة ويمكنه إرسال طلبات أخرى بدون اعادة تحميل للصفحة.

في نسخة SPA من التطبيق لا يتم ارسال المدخلات بصيغة form data, ولكن يتم استخدام لغة جافاسكريبت لإرسال الطلب للخادم.

سنتعرض للكود المستخدم في تلك العملية بعد قليل, لكن لا يتطلب فهم كل التفاصيل المتعلقة بذلك الكود البرمجي بعد.

```js
var form = document.getElementById('notes_form')
form.onsubmit = function(e) {
  e.preventDefault()

  var note = {
    content: e.target.elements[0].value,
    date: new Date(),
  }

  notes.push(note)
  e.target.elements[0].value = ''
  redrawNotes()
  sendToServer(note)
}
```

الأمر <em>document.getElementById('notes_form')</em> يوجة المتصفح للبحث عن العنصر المميز بالمعرف (id) notes_form وهو من النوع form. ويتم تعيين معالج لحدث  الارسال <i>event handler</i> لذلك العنصر, والذي يتم استدعاؤه فور حدوث ذلك الحدث. ونلاحظ أيضاً السطر البرمجي الأول للوظيفة المستخدمة في معالجة الحدث <i>e.preventDefault</i> والذي يستخدم لمنع المتصفح من تفعيل الإجراء التقليدي عند إرسال الاستمارة form حيث يقوم ذلك الإجراء بإرسال البينات بالطريقة التقليدية.

بعد ذلك نلاحظ أمر إنشاء الملاحظة واضافتها لقائمة الملاحظات بإستخدام الأمر <em>notes.push(note)</em> حيت يتم عرض تلك الملاحظة في الصفحة ثم إرسالها للخادم لحفظها.

الجزء المتعلق بإرسال الملاحظة للخادم يبدو كالتالي:

```js
var sendToServer = function(note) {
  var xhttpForPost = new XMLHttpRequest()
  // ...

  xhttpForPost.open('POST', '/new_note_spa', true)
  xhttpForPost.setRequestHeader('Content-type', 'application/json')
  xhttpForPost.send(JSON.stringify(note))
}
```

يوضح الكود السابق أن عملية الإرسال تتم باستخدام الوسيلة POST وأن البيانات المرسلة بصيغة JSON. ويتم ذلك عن طريق استخدام <i>Content-type</i> header. ثم يتم إرسال تفاصيل الملاحظة نصياً بصيغة JSON.

يمكن الاطلاع على الكود البرمجي للتطبيق من هذا الرابط <https://github.com/mluukkai/example_app>.

من المهم أيضا تذكر أن هذا التطبيق هو تطبيق توضيحي فقط لأغراض الدورة. الكود البرمجي لذلك التطبيق ليس جيداً على الاطلاق ولا ينصح بإستخدام ذلك النمط في تطبيقاتك وكذلك نمط انشاء الروابط, مثال الرابط <i>new\_note\_spa</i> لا يتبع الطريقة المثلى لتسمية الروابط. 

### مكتبات جافاسكريبت

تم إنشاء التطبيق التوضيحي بطريقة [vanilla JavaScript](https://www.freecodecamp.org/news/is-vanilla-javascript-worth-learning-absolutely-c2c67140ac34/), مما يعني أنه تم استخدام DOM-API وجافاسكريبت فقط لمعالجة وتعديل مكونات الصفحة.

بدلاً من استخدام جافاسكريبت وال DOM-API, يمكن استخدام مكتبات جاهزة تحتوى على أدوات يمكنها تبسيط عملية تعديل المحتوى فضلاً عن استخدام DOM-API منفردة. ومن هذه الأدوات المكتبة المشهورة [jQuery](https://jquery.com/).

تم تطوير مكتبة JQuery قديماً عندما كانت تطبيقات الانترنت تتبع الاسلوب التقليدي في انشاء الصفحات, وأحدثت تحسين لعملية تطوير التطبيقات في المتصفح باستخدام لغة جافاسكريبت و مكتبة JQuery. من أهم أسباب نجاح تلك المكتبة هو ما يعرف التوافقية بين المتصفحات (cross-browser compatibility). فقد كانت تقدم نفس الوظائف بغض النظر عن الاختلافات بين المتصفحات فأنهت الحاجة لحلول مخصوصة لكل متصفح. في هذه الأيام استخدام تلك المكتبة لا يعد تطويراً لعملية انشاء التطبيقات لظهور حلول أفضل, ولأن معظم المتصفحات المشهورة تدعم تلك الوظائف بصورة متسقة وجيده.

تلى ظهور تطبيقات الصفحة الواحدة SPA العديد من التقنيات الحديثة لتطوير تطبيقات الانترنت غير JQuery. وكان من أوائل تلك التطورات مكتبة [BackboneJS](http://backbonejs.org/). وبعد ظهورها [launch](https://github.com/angular/angular.js/blob/master/CHANGELOG.md#100-temporal-domination-2012-06-13) في 2012, مكتبة أنجولار الخاصة بشركة جوجل [AngularJS](https://angularjs.org/) أصبحت شائعة جداً للاستخدام بين مطوري تطبيقات الانترنت.

ولكن, انتهى استخدام تلك المكتبة في اكتوبر 2014 عندما [أعلن فريق مطوري انجولار انهاء دعم الإصدار الأول](https://web.archive.org/web/20151208002550/https://jaxenter.com/angular-2-0-announcement-backfires-112127.html), وأن الاصدار الثاني لن يدعم الاصدارات السابقة. وقد أزعج هذا القرار المفاجئ بعض مستخدمي الاصدار الأول.

حالياً الأداة الأكثر شيوعاً في تطوير تطبيقات الانترنت المعتمدة على المعالجة في بيئة المتصفح هي مكتبة ريأكت المطورة بواسطة شركة فيسبوك [React](https://reactjs.org/).

خلال هذه الدورة سنتطرق للتعرف على مكتبة ريأكت ومكتبة ريداكس [Redux](https://github.com/reactjs/redux) والمكتبتان يستخدمان في تطوير تطبيقات الانترنت.

قد تكون مكتبة React قوية جداً وشائعة الاستخدام ولكن عالم الجافاسكريبت يتغير باستمرار. كمثال لذلك ظهور مكتبات جديدة لحل نفس المشكله مثل مكتبة [VueJS](https://vuejs.org/) - والتي حظيت ببعض الاهتمام من مجتمع المطورين.

### تطوير تطبيقات الانترنت الشاملة

ما معنى اسم الدورة - تطوير تطبيقات الانترنت الشاملة أو بالانجليزية <i>Full stack web development</i> ? (Full stack) هي كلمة سحرية يتحدث عنها الكثير, لكن لا أحد يعرف معناها الحقيقي. أو بتعبير آخر لا يوجد اتفاق مشترك لتعريف تلك الكلمة.

عملياً كل تطبيقات الانترنت تقسم إلى طبقتين: المتصفح وهي الطبقة الأقرب للمستخدم, وهي الطبقة الأعلى, والخادم بالاسفل. وقد يوجد طبقة وسيطة وهي قاعدة البيانات أسفل الخادم. وبهذا الوصف يمكن النظر الى معمارية التطبيقات <i>web application architecture</i> كطبقات واحدة تعلو الأخرى <i>stack</i> of layers.

عادة, نتحدث عن مصطلحي الفرونت اند والباك اند [frontend and the backend](https://en.wikipedia.org/wiki/Front_and_back_ends). المتصفح هو اطار عمل الفرونت اند, والكود البرمجي الذي يتم تنفيذه داخل المتصفح يسمي كود الفرونت اند. أم السيرفر ومتلعقاته يعرف بمصطلح باك اند

في سياق هذه الدورة, تطوير تطبيقات الانترنت الشاملة توضح أننا سنركز على كل الأجزاء المتعلقة ببناء التطبيق: الفرونت اند (frontend) وكذلك الباك اند (backend), وقاعدة البيانات (database). في بعض الأحيان يعتبر الخادم ونظام التشغيل الخاص به من مكونات ال stack ولكن لن نتطرق لذلك الجزء.

سنقوم ببرمجة الباك اند (backend) بلغة مشتقة من لغة جافاسكريبت وهي لغة نود [Node.js](https://nodejs.org/en/) وبيئة العمل الخاصة بها. استخدام نفس اللغة في الطبقات المختلقة للتطبيق تساعد في عملية التطوير. ولكن لا ينبغي تطوير كل التطبيقات باستخدام نفس اللغة للطبقات المختلفة فقد يكون من الأفضل استخدام لغات مختلفة متوافقة مع اغراض بناء التطبيق.

من الشائع قيام المطور بالتخصص في طبقة واحدة من معمارية التطبيق. كمثال التقنيات المستخدمة في frontend تحتلف عن تلك المستخدمه في backend. بشيوع تطوير التطبيقات الشامل full-stack development, يقوم المطور باحتراف كل تلك الطبقات بما فيها قواعد البيانات. وفي أحيان كثيره يحتاج المطور للتعرف على تقنيات ضبط وادارة التطبيقات وبيئة عملها كمثال البرمجة السحابية Cloud.

### اجهاد الجافاسكريبت

يعد تطوير تطبيقات الانترنت الشاملة تحدي من أكثر من جهة. العديد من الأشياء تتغير حالتها في أكثر من ماكن وفي وقت واحد, وكذلك فحص النظام أصعب من فحص أنظمة التطبيقات المكتبية. لغة جافاسكريبت لا تعمل دائماً كما هو متوقع مقارنة بلغات برمجة أخرى, وكذلك طبيقة بيئة التشغيل التزامنية يصاحبها العديد من أنواع التحديات للمطورين. والتواصل عبر الانترنت يحتاج الى معرفة بروتوكول HTTP. وكذلك تحتاج الى معرفة بقواعد البيانات وادارة الخادم وعمليات الضبط. وتحتاج أيضا معرفة كافية بلغة CSS لتستطيع بناء تطبيقات مقبولة الشكل نوعاً ما.


عالم جافاسكريبت يتطور بصورة سريعة, مما يستدعي العديد من التحديات. فالأدوات والمكتبات واللغة نفسها قيد التطوير بصورة مستمرة, بعض المطورين أصابهم الاجهاد من التغيير المستمر, وظهر بذلك مصطلح اجهاد الجافاسكريبت <em>JavaScript fatigue</em>. قم بالاطلاع على للمزيد [How to Manage JavaScript Fatigue on auth0](https://auth0.com/blog/how-to-manage-javascript-fatigue/) أو [JavaScript fatigue on Medium](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4).

قد تعاني من ذلك الاجهاد أنت ايضاً خلال هذه الدورة. ولكن هناك بعض الوسائل لتسهيل عملية التعلم, فسنبدأ أولا بكتابة الكود البرمجي بدلاً من التعرف على الضبط. لا يمكن استبعاد عمليات الضبط كلياً, ولكن يمكن تأخيرها الى الأسابيع القادمة لتسهيل عملية التعلم.

</div>

<div class="tasks">
  <h3>تمرين 0.1.-0.6.</h3>

يتم تسليم التمرينات عبر منصة Github, وبتعيين علامة على التمرين المنتهي على نظام التسليم [submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

يمكنك تسليم كل التمارين بنفس المخزن (repository), ويمكن تقسيمها الى أكثر من مخزن. اذا قمت بتسليم التمارين باستخدام مخزن واحد, يرجى تسمية الأجزاء بأسماء واضحة ومتسقة. واذا كان المخزن خاص يرجى اضافة _mluukkai_ كمشارك في المخزن.

من الوسائل الجيدة في تسمية مجلدات التمرينات, التسمية التالية:

```text
part0
part1
  courseinfo
  unicafe
  anecdotes
part2
  courseinfo
  phonebook
  countries
```

فلكل جزء المجلد الخاص به والذي يحتوى على مجلد لكل مجموعة من التمرينات (مثل تمرينات unicafe في الجزء الأول).

يتم تسليم التمارين **جزء واحد في المرة الواحدة** عند تسليم تمرينات جزء معين لا يمكن اعادة تسليم أي تمرينات لذلك الجزء.

  <h4>0.1: HTML لغة</h4>

قم بمراجعة أساسيات لغة HTML بقراء المقال التالي من موقع Mozilla: [HTML tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics).

<i>لا يتم تسليم هذا التمرين عبر منصة Github, يكفى فقط قرائتك للمقال</i>

  <h4>0.2: CSS لغة</h4>

قم بمراجعة أساسيات لغة CSS بقراء المقال التالي من موقع Mozilla: [CSS tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics).

<i>لا يتم تسليم هذا التمرين عبر منصة Github, يكفى فقط قرائتك للمقال</i>

  <h4>0.3: HTML forms</h4>

قم بمراجعة أساسيات لغة HTML Forms بقراء المقال التالي من موقع Mozilla: [Your first form](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form).

<i>لا يتم تسليم هذا التمرين عبر منصة Github, يكفى فقط قرائتك للمقال</i>

  <h4>0.4: رسم بياني لإنشاء ملاحظة جديدة</h4>

في هذا القسم من الدورة [مراجعة - تحميل صفحة تجتوى على كود جافاسكريبت](/en/part0/fundamentals_of_web_apps#loading-a-page-containing-java-script-review), تسلسل الأحداث التى تحدث بزيارة الصفحة التالية <https://studies.cs.helsinki.fi/exampleapp/notes> يمكن تمثيله بالرسم التوضيحي التتابعي [sequence diagram](https://www.geeksforgeeks.org/unified-modeling-language-uml-sequence-diagrams/)

The diagram was made as a GitHub Markdown-file using the [Mermaid](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams)-syntax, as follows:
الرسم التوضيحي يمكن انشاؤه باستخدام لغة Markdown الخاصة بمنصة Github باستخدام تقنية[Mermaid](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams) التالي:

```text
sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes
```

**قم بتصميم رسم توضيحي مماثل** يوضح حالة انشاء ملحوظة جديدة على الصفحة <https://studies.cs.helsinki.fi/exampleapp/notes> عند كتابة نص الملاحظة في حقل الملاحظة النصي والضغط على زر  <i>submit</i> .

لو تطلب الأمر, يمكنك كتابة بعض التعليقات التي توضح موقع الأحداث الخاصة بالمتصفح أو الخادم على الرسم التوضيحي.

لا يتطلب ان يكون الرسم التوضيحي تسلسلي. يمكن استخدام أي طريقة واضحة لعرض تلك الأحداث.

يمكن الاطلاع على المعلومات الخاصة بذلك التمرين واثنين من التمارين التالية [هنا](/en/part0/fundamentals_of_web_apps#forms-and-http-post).

فكرة تلك التمارين هي القراءة الكاملة للمادة العلمية أكثر من مرة لفهم حركة الأحداث في التطبيق. وقراءة الكود البرمجي الخاص بالتطبيق ليس مهماً ولكن يمكن الاطلاع عليه من هنا [code](https://github.com/mluukkai/example_app).

يمكن انشاء الرسم التوضيحي بأي تطبيق ولكن أفضل وأسهل طريقة هي استخدام ذلك التطبيق [Mermaid](https://github.com/mermaid-js/mermaid#sequence-diagram-docs---live-editor) حيث أن الكود البرمجي الخاص به مدعوم في منصة Github [GitHub](https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid/).

  <h4>0.5: الرسم التوضيحي لتطبيقات الصفحة الواحدة</h4>

قم بإنشاء رسم توضيحي لحالة التطبيق عندما يقوم المستخدم بزيارة ذلك الرابط [single-page app](/en/part0/fundamentals_of_web_apps#single-page-app) المطور بتقنية الصفحة الواحدة من هنا <https://studies.cs.helsinki.fi/exampleapp/spa>.

  <h4>0.6: رسم توضحي لانشاء ملحوظة جديدة في تطبيق الصفحة الواحدة</h4>

قم بإنشاء رسم توضيحي لعملية انشاء ملحوظة جديدة باستخدام تطبيقات الصفحة الواحدة (SPA).

هذا يعد آخر تمرين لهذا الجزء, يمكن الآن ارسال الكود الخاص بتلك التمارين الى منصة Github وتعيين انتهاء تلك التمارين على نظام التسليم [submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>

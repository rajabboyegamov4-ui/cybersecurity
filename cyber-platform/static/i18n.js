// Cyber Toolkit — tarjimalar (uz / ru / en)
// Backend matn emas, kalit qaytaradi (masalan "no_upper"); bu yerda kalit tanlangan tilga o'giriladi.
const I18N = {
  uz: {
  hub_title: "Kiberxavfsizlik platformasi", hub_sub: "O'rganish, mashq va vositalar — bitta joyda. Uch tilda, Supabase bilan.",
  hub_darslik_h: "Kiber Darslik", hub_darslik_p: "10 interaktiv dars, terminal/subnet/git lablari, CTF, shaxsiy seyf, daraja tizimi.",
  hub_toolkit_h: "Cyber Toolkit", hub_toolkit_p: "6 xavfsizlik vositasi (parol, hash, kodlash, phishing URL, port scanner, HTTP headers) + tarix.",
  hub_tahlil_h: "Karyera va Tahlil", hub_tahlil_p: "Kiberxavfsizlik darajalari, sertifikat yo'l xaritasi va maksimal foyda rejasi.",
  hub_foot: "Ochiq manba portfolio loyihasi. Faqat ta'lim va o'z tizimlaringizni himoyalash uchun.",
  auth_open: "Kirish", auth_close: "Yopish", auth_logout: "Chiqish",
  auth_email: "Email", auth_password: "Parol (kamida 6 belgi)", auth_login: "Kirish", auth_signup: "Ro'yxatdan o'tish",
  auth_note: "Akkaunt ochsangiz, tekshiruvlar tarixini bulutda saqlaysiz. Parollaringizning O'ZI saqlanmaydi — faqat natija xulosasi.",
  auth_min6: "Parol kamida 6 belgi bo'lsin.", auth_check_email: "Emailingizni tasdiqlang (agar tasdiq yoqilgan bo'lsa) yoki kiring.",
  tab_history: "Tarix", hist_h: "Tekshiruvlar tarixi", hist_hint: "Saqlangan natijalaringiz (faqat sizga ko'rinadi).",
  hist_login: "Tarixni ko'rish uchun kiring.", hist_empty: "Hali saqlangan natija yo'q. Vosita natijasida 'Saqlash' tugmasini bosing.",
  hist_tool: "Vosita", hist_title: "Nomi", hist_result: "Natija", hist_when: "Vaqt",
  save_btn: "Tarixga saqlash", saved: "Saqlandi ✓", save_err: "Xato", del: "O'chirish",
    to_tahlil: "Tahlil", to_tahlil_title: "Karyera va chuqur tahlil (yangi oynada)",
    title_sub: "Xavfsizlik vositalari to'plami · o'quv loyihasi",
    to_darslik: "Kiber Darslik", to_darslik_title: "Darslar va shaxsiy seyf (yangi oynada)",
    tab_password: "Parol", tab_hash: "Hash", tab_encode: "Kodlash", tab_url: "Phishing URL", tab_scan: "Port scanner", tab_headers: "HTTP headers",
    footer: "Faqat ta'lim va o'z tizimlaringizni himoyalash uchun.",
    pw_h: "Parol kuchini tekshirish", pw_hint: "Parol serverda saqlanmaydi. Baribir haqiqiy parolingizni kiritmang, o'xshashini sinang.", pw_ph: "Parol kiriting...",
    show: "Ko'rsatish", hide: "Yashirish",
    hash_gen_h: "Hash yaratish", hash_ph: "Matn kiriting...", btn_generate: "Yaratish", hash_id_h: "Hash turini aniqlash", btn_identify: "Aniqlash",
    enc_h: "Kodlash / Dekodlash", enc_hint: "CTF masalalarida eng ko'p uchraydigan formatlar. Eslatma: kodlash shifrlash emas!", enc_ph: "Matn...", enc_out_ph: "Natija...", btn_encode: "Kodlash →", btn_decode: "← Dekodlash",
    url_h: "Phishing URL tahlili", url_hint: "Saytga kirilmaydi, faqat havolaning tuzilishi tahlil qilinadi.", btn_analyze: "Tahlil",
    scan_h: "Port scanner", scan_hint: "Faqat ruxsat berilgan manzillar. Begona serverni egasining ruxsatisiz skanerlash qonunbuzarlik.", btn_scan: "Skanerlash",
    hdr_h: "HTTP xavfsizlik sarlavhalari", hdr_hint: "Sayt himoya sarlavhalarini qo'yganmi, tekshiradi (Blue team uchun).", btn_check: "Tekshirish",
    demo_banner: "DEMO rejim: bu namuna brauzerning o'zida ishlaydi. Parol, Hash, Kodlash va URL tahlili haqiqiy natija beradi. Port scanner va HTTP headers namuna ko'rsatadi, haqiqiy natija uchun Flask versiyasini ishga tushiring (python app.py).",
    sample_badge: "NAMUNA NATIJA",
    labels: ["Juda zaif", "Zaif", "O'rtacha", "Yaxshi", "Kuchli"],
    len: "Uzunlik", chars: "belgi", entropy: "Entropiya", crack_time: "Buzish vaqti", crack_note: "(10 mlrd urinish/soniya)", no_issues: "Kamchilik topilmadi ✓",
    t_instant: "bir zumda", t_forever: "millionlab yil", t_units: ["yil", "kun", "soat", "daqiqa", "soniya"],
    i_empty: "Parol kiritilmagan", i_short8: "8 belgidan qisqa", i_short12: "12 belgi va undan uzun bo'lgani ma'qul", i_no_upper: "Katta harf yo'q", i_no_lower: "Kichik harf yo'q",
    i_no_digit: "Raqam yo'q", i_no_symbol: "Maxsus belgi (!@#...) yo'q", i_repeat: "Bir belgi ketma-ket takrorlangan (aaa, 111)", i_common: "Eng ko'p ishlatiladigan parollar ro'yxatida bor!",
    i_keyboard: "Klaviatura naqshi: '{pat}'", i_year: "Yil ko'rinishidagi raqam (tug'ilgan yil bo'lishi mumkin)",
    candidates: "Ehtimoliy turlar:",
    n_weak: "Bu algoritm parol saqlash uchun eskirgan va tez buziladi. bcrypt yoki Argon2 ishlating.", n_slow: "Parol saqlash uchun zamonaviy, sekin (xavfsiz) algoritm.",
    n_integrity: "Fayl butunligini tekshirish uchun yaxshi. Parol uchun esa tuzli (salt) sekin algoritm kerak.", n_unknown: "Tanib bo'lmadi. Hex yoki ma'lum formatdagi hash kiriting.",
    risk: "Xavf", lv_low: "Past", lv_mid: "O'rta", lv_high: "Yuqori", lv_unknown: "Noma'lum", domain: "Domen", protocol: "Protokol", th_sign: "Belgi", th_weight: "Og'irlik",
    no_findings: "Shubhali belgi topilmadi. Lekin bu 100% xavfsiz degani emas.",
    f_no_host: "URL'dan domen topilmadi", f_ip: "Domen o'rniga IP manzil ishlatilgan", f_no_https: "HTTPS emas: ma'lumotlar shifrlanmagan",
    f_at: "URL ichida '@' bor: haqiqiy manzil '@' dan keyin yashiringan bo'lishi mumkin", f_punycode: "Punycode (xn--): o'xshash harflar bilan brendni soxtalashtirish ehtimoli",
    f_long: "URL juda uzun ({n} belgi)", f_subdomains: "Juda ko'p subdomen", f_hyphens: "Domenda ko'p chiziqcha (-)", f_tld: "Shubhali domen zonasi: .{tld}",
    f_shortener: "Qisqartirilgan havola: asl manzil yashirin", f_port: "Nostandart port: {port}", f_lookalike: "'{brand}' brendiga o'xshatilgan soxta domen (0↔o, 1↔l, rn↔m)",
    f_bait: "Aldov so'zlari: {words}", f_brand: "'{brand}' brendi nomi begona domenda ishlatilgan ({domain})",
    scanning: "Skanerlanmoqda... (10–20 soniya)", host: "Host", scanned: "Tekshirildi", ports_word: "port", th_port: "Port", th_service: "Xizmat", th_note: "Izoh", no_open: "Ochiq port topilmadi.",
    r_telnet: "Telnet parollarni ochiq matnda yuboradi", r_ftp: "FTP ko'pincha shifrlanmagan", r_smb: "SMB: WannaCry kabi hujumlar nishoni", r_rdp: "RDP: brute-force hujumlari ko'p",
    r_redis: "Redis parolsiz qoldirilsa xavfli", r_mongodb: "MongoDB parolsiz qoldirilsa ma'lumot sizadi", r_vnc: "VNC: masofadan boshqaruv",
    grade: "Baho", address: "Manzil", yes: "✓ ha", no: "✗ yo'q", status_err: "sayt xato qaytardi, natija noto'g'ri bo'lishi mumkin",
    th_header: "Sarlavha", th_state: "Holat", th_why: "Nima uchun", leaks: "Server haqida ma'lumot sizmoqda:",
    "w_Strict-Transport-Security": "Brauzerni faqat HTTPS ishlatishga majbur qiladi (HSTS)", "w_Content-Security-Policy": "XSS hujumlaridan himoya: qaysi skriptlar yuklanishini cheklaydi",
    "w_X-Frame-Options": "Clickjacking'dan himoya: saytni iframe ichiga olishni taqiqlaydi", "w_X-Content-Type-Options": "Brauzer fayl turini taxmin qilmasligi uchun (nosniff)",
    "w_Referrer-Policy": "Boshqa saytlarga qancha ma'lumot yuborilishini cheklaydi", "w_Permissions-Policy": "Kamera, mikrofon, joylashuv kabi API'larni cheklaydi",
    e_rate_limited: "Juda ko'p so'rov. Bir daqiqadan keyin urinib ko'ring.", e_not_string: "'{field}' matn bo'lishi kerak", e_too_long: "'{field}' juda uzun (maks {max} belgi)",
    e_bad_format: "Kiritilgan matn to'g'ri {mode} formatida emas", e_unknown_mode: "Noma'lum rejim", e_scan_forbidden: "Bu manzilni skanerlashga ruxsat yo'q. Faqat: {hosts}",
    e_dns_failed: "Domen topilmadi", e_ssrf_blocked: "Ichki tarmoq manzillarini tekshirish o'chirilgan (SSRF himoyasi)", e_bad_url: "URL noto'g'ri", e_too_many_redirects: "Juda ko'p redirect",
    e_connect_failed: "Saytga ulanib bo'lmadi", e_bad_response: "Server javobi noto'g'ri", e_http: "Xato {status}",
  },
  ru: {
  hub_title: "Платформа кибербезопасности", hub_sub: "Обучение, практика и инструменты — в одном месте. На трёх языках, с Supabase.",
  hub_darslik_h: "Кибер-курс", hub_darslik_p: "10 интерактивных уроков, лаборатории terminal/subnet/git, CTF, личный сейф, система уровней.",
  hub_toolkit_h: "Cyber Toolkit", hub_toolkit_p: "6 инструментов безопасности (пароль, хеш, кодирование, фишинг URL, сканер портов, HTTP-заголовки) + история.",
  hub_tahlil_h: "Карьера и анализ", hub_tahlil_p: "Уровни в кибербезопасности, карта сертификатов и план максимальной пользы.",
  hub_foot: "Open-source портфолио-проект. Только для обучения и защиты своих систем.",
  auth_open: "Войти", auth_close: "Закрыть", auth_logout: "Выйти",
  auth_email: "Email", auth_password: "Пароль (мин. 6 символов)", auth_login: "Войти", auth_signup: "Регистрация",
  auth_note: "С аккаунтом история проверок хранится в облаке. САМИ пароли не сохраняются — только сводка результата.",
  auth_min6: "Пароль не короче 6 символов.", auth_check_email: "Подтвердите email (если включено) или войдите.",
  tab_history: "История", hist_h: "История проверок", hist_hint: "Ваши сохранённые результаты (видны только вам).",
  hist_login: "Войдите, чтобы увидеть историю.", hist_empty: "Пока нет сохранённых результатов. Нажмите 'Сохранить' под результатом.",
  hist_tool: "Инструмент", hist_title: "Название", hist_result: "Результат", hist_when: "Время",
  save_btn: "Сохранить в историю", saved: "Сохранено ✓", save_err: "Ошибка", del: "Удалить",
    to_tahlil: "Анализ", to_tahlil_title: "Карьера и глубокий анализ (в новой вкладке)",
    title_sub: "Набор инструментов безопасности · учебный проект",
    to_darslik: "Kiber Darslik", to_darslik_title: "Уроки и личный сейф (в новой вкладке)",
    tab_password: "Пароль", tab_hash: "Хеш", tab_encode: "Кодирование", tab_url: "Фишинг URL", tab_scan: "Сканер портов", tab_headers: "HTTP-заголовки",
    footer: "Только для обучения и защиты собственных систем.",
    pw_h: "Проверка надёжности пароля", pw_hint: "Пароль не сохраняется на сервере. Но всё равно не вводите настоящий пароль, проверяйте похожий.", pw_ph: "Введите пароль...",
    show: "Показать", hide: "Скрыть",
    hash_gen_h: "Создать хеш", hash_ph: "Введите текст...", btn_generate: "Создать", hash_id_h: "Определить тип хеша", btn_identify: "Определить",
    enc_h: "Кодирование / Декодирование", enc_hint: "Самые частые форматы в CTF-задачах. Помните: кодирование — это не шифрование!", enc_ph: "Текст...", enc_out_ph: "Результат...", btn_encode: "Кодировать →", btn_decode: "← Декодировать",
    url_h: "Анализ фишинговых URL", url_hint: "Сайт не открывается, анализируется только структура ссылки.", btn_analyze: "Анализ",
    scan_h: "Сканер портов", scan_hint: "Только разрешённые адреса. Сканировать чужой сервер без разрешения владельца — нарушение закона.", btn_scan: "Сканировать",
    hdr_h: "HTTP-заголовки безопасности", hdr_hint: "Проверяет, выставил ли сайт защитные заголовки (для Blue team).", btn_check: "Проверить",
    demo_banner: "ДЕМО-режим: этот пример работает прямо в браузере. Пароль, Хеш, Кодирование и анализ URL дают настоящий результат. Сканер портов и HTTP-заголовки показывают пример; для настоящих результатов запустите Flask-версию (python app.py).",
    sample_badge: "ПРИМЕР РЕЗУЛЬТАТА",
    labels: ["Очень слабый", "Слабый", "Средний", "Хороший", "Надёжный"],
    len: "Длина", chars: "симв.", entropy: "Энтропия", crack_time: "Время взлома", crack_note: "(10 млрд попыток/сек)", no_issues: "Недостатков не найдено ✓",
    t_instant: "мгновенно", t_forever: "миллионы лет", t_units: ["лет", "дн.", "ч", "мин", "сек"],
    i_empty: "Пароль не введён", i_short8: "Короче 8 символов", i_short12: "Лучше 12 символов и длиннее", i_no_upper: "Нет заглавных букв", i_no_lower: "Нет строчных букв",
    i_no_digit: "Нет цифр", i_no_symbol: "Нет спецсимволов (!@#...)", i_repeat: "Символ повторяется подряд (aaa, 111)", i_common: "Есть в списке самых популярных паролей!",
    i_keyboard: "Клавиатурный шаблон: '{pat}'", i_year: "Число похоже на год (возможно, год рождения)",
    candidates: "Возможные типы:",
    n_weak: "Этот алгоритм устарел для хранения паролей и быстро взламывается. Используйте bcrypt или Argon2.", n_slow: "Современный медленный (безопасный) алгоритм для хранения паролей.",
    n_integrity: "Хорош для проверки целостности файлов. Для паролей нужен медленный алгоритм с солью.", n_unknown: "Не удалось распознать. Введите хеш в hex или известном формате.",
    risk: "Риск", lv_low: "Низкий", lv_mid: "Средний", lv_high: "Высокий", lv_unknown: "Неизвестно", domain: "Домен", protocol: "Протокол", th_sign: "Признак", th_weight: "Вес",
    no_findings: "Подозрительных признаков нет. Но это не значит, что ссылка безопасна на 100%.",
    f_no_host: "В URL не найден домен", f_ip: "Вместо домена используется IP-адрес", f_no_https: "Не HTTPS: данные не шифруются",
    f_at: "В URL есть '@': настоящий адрес может скрываться после '@'", f_punycode: "Punycode (xn--): возможна подделка бренда похожими буквами",
    f_long: "Слишком длинный URL ({n} симв.)", f_subdomains: "Слишком много поддоменов", f_hyphens: "Много дефисов (-) в домене", f_tld: "Подозрительная доменная зона: .{tld}",
    f_shortener: "Сокращённая ссылка: настоящий адрес скрыт", f_port: "Нестандартный порт: {port}", f_lookalike: "Поддельный домен, похожий на бренд '{brand}' (0↔o, 1↔l, rn↔m)",
    f_bait: "Слова-приманки: {words}", f_brand: "Название бренда '{brand}' на чужом домене ({domain})",
    scanning: "Сканирование... (10–20 секунд)", host: "Хост", scanned: "Проверено", ports_word: "портов", th_port: "Порт", th_service: "Сервис", th_note: "Примечание", no_open: "Открытых портов не найдено.",
    r_telnet: "Telnet передаёт пароли открытым текстом", r_ftp: "FTP часто не шифруется", r_smb: "SMB: цель атак вроде WannaCry", r_rdp: "RDP: частые brute-force атаки",
    r_redis: "Redis без пароля опасен", r_mongodb: "MongoDB без пароля — утечка данных", r_vnc: "VNC: удалённое управление",
    grade: "Оценка", address: "Адрес", yes: "✓ да", no: "✗ нет", status_err: "сайт вернул ошибку, результат может быть неточным",
    th_header: "Заголовок", th_state: "Статус", th_why: "Зачем нужен", leaks: "Утекает информация о сервере:",
    "w_Strict-Transport-Security": "Заставляет браузер использовать только HTTPS (HSTS)", "w_Content-Security-Policy": "Защита от XSS: ограничивает, какие скрипты загружаются",
    "w_X-Frame-Options": "Защита от clickjacking: запрещает встраивать сайт в iframe", "w_X-Content-Type-Options": "Браузер не угадывает тип файла (nosniff)",
    "w_Referrer-Policy": "Ограничивает, сколько данных уходит другим сайтам", "w_Permissions-Policy": "Ограничивает API: камера, микрофон, геолокация",
    e_rate_limited: "Слишком много запросов. Попробуйте через минуту.", e_not_string: "'{field}' должно быть текстом", e_too_long: "'{field}' слишком длинное (макс. {max} симв.)",
    e_bad_format: "Текст не в формате {mode}", e_unknown_mode: "Неизвестный режим", e_scan_forbidden: "Сканировать этот адрес запрещено. Разрешены только: {hosts}",
    e_dns_failed: "Домен не найден", e_ssrf_blocked: "Проверка адресов внутренней сети отключена (защита от SSRF)", e_bad_url: "Неверный URL", e_too_many_redirects: "Слишком много редиректов",
    e_connect_failed: "Не удалось подключиться к сайту", e_bad_response: "Некорректный ответ сервера", e_http: "Ошибка {status}",
  },
  en: {
  hub_title: "Cybersecurity platform", hub_sub: "Learning, practice and tools — in one place. In three languages, with Supabase.",
  hub_darslik_h: "Cyber Course", hub_darslik_p: "10 interactive lessons, terminal/subnet/git labs, CTF, personal vault, a level system.",
  hub_toolkit_h: "Cyber Toolkit", hub_toolkit_p: "6 security tools (password, hash, encoding, phishing URL, port scanner, HTTP headers) + history.",
  hub_tahlil_h: "Career & Analysis", hub_tahlil_p: "Cybersecurity levels, a certification roadmap and a maximum-value plan.",
  hub_foot: "Open-source portfolio project. For learning and protecting your own systems only.",
  auth_open: "Sign in", auth_close: "Close", auth_logout: "Sign out",
  auth_email: "Email", auth_password: "Password (min 6 chars)", auth_login: "Sign in", auth_signup: "Sign up",
  auth_note: "With an account your check history is saved in the cloud. Passwords THEMSELVES are never stored — only a result summary.",
  auth_min6: "Password must be at least 6 characters.", auth_check_email: "Confirm your email (if enabled) or sign in.",
  tab_history: "History", hist_h: "Check history", hist_hint: "Your saved results (visible only to you).",
  hist_login: "Sign in to see your history.", hist_empty: "No saved results yet. Click 'Save' under a tool result.",
  hist_tool: "Tool", hist_title: "Name", hist_result: "Result", hist_when: "When",
  save_btn: "Save to history", saved: "Saved ✓", save_err: "Error", del: "Delete",
    to_tahlil: "Analysis", to_tahlil_title: "Career and deep analysis (opens in a new tab)",
    title_sub: "Security toolkit · learning project",
    to_darslik: "Kiber Darslik", to_darslik_title: "Lessons and personal vault (opens in a new tab)",
    tab_password: "Password", tab_hash: "Hash", tab_encode: "Encoding", tab_url: "Phishing URL", tab_scan: "Port scanner", tab_headers: "HTTP headers",
    footer: "For learning and protecting your own systems only.",
    pw_h: "Password strength check", pw_hint: "The password is not stored on the server. Still, don't type your real password; test a similar one.", pw_ph: "Enter a password...",
    show: "Show", hide: "Hide",
    hash_gen_h: "Generate hashes", hash_ph: "Enter text...", btn_generate: "Generate", hash_id_h: "Identify hash type", btn_identify: "Identify",
    enc_h: "Encode / Decode", enc_hint: "The formats you meet most in CTF challenges. Remember: encoding is not encryption!", enc_ph: "Text...", enc_out_ph: "Result...", btn_encode: "Encode →", btn_decode: "← Decode",
    url_h: "Phishing URL analysis", url_hint: "The site is never opened; only the link's structure is analyzed.", btn_analyze: "Analyze",
    scan_h: "Port scanner", scan_hint: "Allowed hosts only. Scanning someone else's server without the owner's permission is illegal.", btn_scan: "Scan",
    hdr_h: "HTTP security headers", hdr_hint: "Checks whether a site sets protective headers (Blue team).", btn_check: "Check",
    demo_banner: "DEMO mode: this sample runs entirely in your browser. Password, Hash, Encoding and URL analysis give real results. Port scanner and HTTP headers show a sample; run the Flask version for real results (python app.py).",
    sample_badge: "SAMPLE RESULT",
    labels: ["Very weak", "Weak", "Fair", "Good", "Strong"],
    len: "Length", chars: "chars", entropy: "Entropy", crack_time: "Time to crack", crack_note: "(10 billion guesses/sec)", no_issues: "No weaknesses found ✓",
    t_instant: "instantly", t_forever: "millions of years", t_units: ["years", "days", "hours", "minutes", "seconds"],
    i_empty: "No password entered", i_short8: "Shorter than 8 characters", i_short12: "12 characters or more is better", i_no_upper: "No uppercase letters", i_no_lower: "No lowercase letters",
    i_no_digit: "No digits", i_no_symbol: "No symbols (!@#...)", i_repeat: "A character repeats in a row (aaa, 111)", i_common: "It's on the list of most common passwords!",
    i_keyboard: "Keyboard pattern: '{pat}'", i_year: "Looks like a year (maybe a birth year)",
    candidates: "Possible types:",
    n_weak: "This algorithm is outdated for storing passwords and cracks fast. Use bcrypt or Argon2.", n_slow: "A modern, slow (safe) algorithm for storing passwords.",
    n_integrity: "Good for file integrity checks. Passwords need a slow, salted algorithm.", n_unknown: "Not recognized. Enter a hex hash or a known format.",
    risk: "Risk", lv_low: "Low", lv_mid: "Medium", lv_high: "High", lv_unknown: "Unknown", domain: "Domain", protocol: "Protocol", th_sign: "Signal", th_weight: "Weight",
    no_findings: "No suspicious signals found. That doesn't mean it's 100% safe.",
    f_no_host: "No domain found in the URL", f_ip: "An IP address is used instead of a domain", f_no_https: "Not HTTPS: data is not encrypted",
    f_at: "The URL contains '@': the real address may be hidden after it", f_punycode: "Punycode (xn--): possible brand spoofing with look-alike letters",
    f_long: "Very long URL ({n} chars)", f_subdomains: "Too many subdomains", f_hyphens: "Many hyphens (-) in the domain", f_tld: "Suspicious top-level domain: .{tld}",
    f_shortener: "Shortened link: the real address is hidden", f_port: "Non-standard port: {port}", f_lookalike: "Fake domain imitating '{brand}' (0↔o, 1↔l, rn↔m)",
    f_bait: "Bait words: {words}", f_brand: "Brand name '{brand}' used on someone else's domain ({domain})",
    scanning: "Scanning... (10–20 seconds)", host: "Host", scanned: "Checked", ports_word: "ports", th_port: "Port", th_service: "Service", th_note: "Note", no_open: "No open ports found.",
    r_telnet: "Telnet sends passwords in plain text", r_ftp: "FTP is often unencrypted", r_smb: "SMB: target of attacks like WannaCry", r_rdp: "RDP: frequent brute-force attacks",
    r_redis: "Redis without a password is dangerous", r_mongodb: "MongoDB without a password leaks data", r_vnc: "VNC: remote control",
    grade: "Grade", address: "Address", yes: "✓ yes", no: "✗ no", status_err: "the site returned an error, the result may be wrong",
    th_header: "Header", th_state: "Status", th_why: "Why it matters", leaks: "Server information is leaking:",
    "w_Strict-Transport-Security": "Forces the browser to use HTTPS only (HSTS)", "w_Content-Security-Policy": "XSS protection: limits which scripts can load",
    "w_X-Frame-Options": "Clickjacking protection: blocks embedding the site in an iframe", "w_X-Content-Type-Options": "Stops the browser from guessing file types (nosniff)",
    "w_Referrer-Policy": "Limits how much data is sent to other sites", "w_Permissions-Policy": "Restricts APIs like camera, microphone, location",
    e_rate_limited: "Too many requests. Try again in a minute.", e_not_string: "'{field}' must be text", e_too_long: "'{field}' is too long (max {max} chars)",
    e_bad_format: "The input is not valid {mode}", e_unknown_mode: "Unknown mode", e_scan_forbidden: "Scanning this host is not allowed. Allowed: {hosts}",
    e_dns_failed: "Domain not found", e_ssrf_blocked: "Checking internal network addresses is disabled (SSRF protection)", e_bad_url: "Invalid URL", e_too_many_redirects: "Too many redirects",
    e_connect_failed: "Could not connect to the site", e_bad_response: "Invalid server response", e_http: "Error {status}",
  },
};

let LANG = (() => {
  try { const s = localStorage.getItem("ct-lang"); if (s && I18N[s]) return s; } catch {}
  return "uz";
})();

function t(key, params = {}) {
  const v = I18N[LANG][key] ?? I18N.uz[key] ?? key;
  return typeof v === "string" ? v.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? "") : v;
}

function fmtTime(s) {
  if (s < 1) return t("t_instant");
  const secs = [31536000, 86400, 3600, 60, 1], names = t("t_units");
  for (let i = 0; i < secs.length; i++) {
    if (s >= secs[i]) {
      const v = s / secs[i];
      if (i === 0 && v > 1e6) return t("t_forever");
      return `~${Math.round(v).toLocaleString("ru").replace(/,/g, " ")} ${names[i]}`;
    }
  }
  return t("t_instant");
}

// Statik matnlar: data-i18n (matn), data-i18n-ph (placeholder), data-i18n-title (title)
function applyStatic() {
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => { el.title = t(el.dataset.i18nTitle); });
  document.querySelectorAll(".lang button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === LANG));
}

const langListeners = [];
function setLang(l) {
  if (!I18N[l]) return;
  LANG = l;
  try { localStorage.setItem("ct-lang", l); } catch {}
  applyStatic();
  langListeners.forEach((fn) => fn());
}

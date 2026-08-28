const contactLinks = [
  {
    label: "اتصال",
    value: "0944886083",
    href: "tel:+963944886083",
    icon: "📞",
  },
  {
    label: "واتساب",
    value: "0982673401",
    href: "https://wa.me/963982673401",
    icon: "💬",
  },
  {
    label: "الموقع على الخريطة",
    value: "درعا - الصنمين",
    href: "https://maps.app.goo.gl/9QJpwKundpcr2aNT6",
    icon: "📍",
  },
  {
    label: "انستغرام",
    value: "muhammad._300",
    href: "https://www.instagram.com/muhammad._300",
    icon: "📷",
  },
  {
    label: "فيسبوك",
    value: "صفحتنا على فيسبوك",
    href: "https://www.facebook.com/share/1F5uGs1yry/",
    icon: "👍",
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="bg-cream-deep px-4 py-16 dark:bg-charcoal-soft">
      <div className="mx-auto max-w-4xl text-center">
        <span className="font-display text-brand-red">تواصل معنا</span>
        <h2 className="mt-2 font-display text-3xl text-charcoal dark:text-cream">
          نسعد بخدمتكم
        </h2>
        <p className="mt-3 text-stone dark:text-stone-light">
          ساعات العمل: من 8 صباحاً حتى 4 فجراً · مناطق التوصيل: قرى وبلدات ريف درعا
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contactLinks.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-stone-light/40 bg-white p-4 text-right transition hover:-translate-y-1 hover:border-brand-red hover:shadow-md dark:border-stone/20 dark:bg-charcoal"
            >
              <span className="text-2xl">{c.icon}</span>
              <span>
                <span className="block text-sm text-stone dark:text-stone-light">
                  {c.label}
                </span>
                <span className="block font-bold text-charcoal dark:text-cream" dir="ltr">
                  {c.value}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

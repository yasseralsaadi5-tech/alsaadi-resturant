import Image from "next/image";

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-charcoal text-cream">
      <div className="absolute inset-0">
        <Image
          src="/front-photo.jpg"
          alt="واجهة مطعم و مطبخ السعدي"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-charcoal/40" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-24 text-center sm:py-32">
        <span className="font-display text-sm tracking-widest text-amber-soft">
          اللقمة اللذيذة
        </span>

        <h1 className="font-display text-4xl leading-tight sm:text-6xl">
          مطعم و مطبخ السعدي
        </h1>

        <p className="max-w-xl text-lg text-cream/90">
          شاورما ووجبات عربية وغربية طازجة، في درعا - الصنمين. اطلب الآن واستلمها
          عند الباب أو عبر التوصيل لقرى وبلدات ريف درعا.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="#menu"
            className="rounded-full bg-brand-red px-8 py-3 font-bold text-white transition hover:bg-brand-red-dark"
          >
            تصفح المنيو
          </a>
          <a
            href="#menu"
            className="rounded-full border-2 border-cream px-8 py-3 font-bold text-cream transition hover:bg-cream hover:text-charcoal"
          >
            اطلب الآن
          </a>
        </div>
      </div>

      <div className="slice-divider-reverse relative h-10 bg-cream dark:bg-charcoal-soft" />
    </section>
  );
}

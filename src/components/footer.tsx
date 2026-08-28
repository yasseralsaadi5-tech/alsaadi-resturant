export function Footer() {
  return (
    <footer className="border-t border-stone-light/40 bg-charcoal px-4 py-8 text-cream dark:border-stone/20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center">
        <span className="font-display text-2xl text-brand-red-light">
          مطعم و مطبخ السعدي
        </span>
        <p className="text-sm text-cream/70">درعا - الصنمين · اللقمة اللذيذة</p>
        <p className="text-sm text-cream/70" dir="ltr">
          +963 944 886 083 · +963 982 673 401
        </p>
        <p className="mt-2 text-xs text-cream/50">
          © {new Date().getFullYear()} مطعم و مطبخ السعدي. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}

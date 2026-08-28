// Shown whenever a menu item has no real image yet (image_url IS NULL).
// Deliberately NOT a food illustration or generated image — a calm,
// branded placeholder that never pretends to depict the actual dish.
export function MissingImageState() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-cream-deep to-stone-light/40 dark:from-charcoal-soft dark:to-charcoal">
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        className="text-brand-red/60 dark:text-brand-red-light/60"
        aria-hidden="true"
      >
        <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 22c1.5-3 3.5-4.5 6-4.5s4.5 1.5 6 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="14.5" cy="14" r="1.4" fill="currentColor" />
        <circle cx="21.5" cy="14" r="1.4" fill="currentColor" />
      </svg>
      <span className="text-xs font-medium text-stone dark:text-stone-light">
        الصورة قيد الإضافة
      </span>
    </div>
  );
}

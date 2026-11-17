export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <span className={className ? `brand-logo ${className}` : "brand-logo"}>
      <span className="brand-mark" aria-hidden>
        M
      </span>
      <span className="brand-name">Meu Orçamento</span>
    </span>
  );
}

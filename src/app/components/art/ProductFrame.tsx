/** Frame for product imagery: clean white surface, fine border, soft shadow. The image itself stays untouched. */
export default function ProductFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div data-art-module="product-frame" className={`relative overflow-hidden rounded-panel border border-hb-stone bg-white shadow-soft ${className}`}>
      {children}
    </div>
  );
}

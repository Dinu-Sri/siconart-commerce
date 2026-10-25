const marks = [
  { src: "/payments/visa.svg", label: "Visa" },
  { src: "/payments/mastercard.svg", label: "Mastercard" },
  { src: "/payments/american-express.svg", label: "American Express" },
  { src: "/payments/discover.svg", label: "Discover" },
  { src: "/payments/unionpay.svg", label: "UnionPay" }
];

export function PaymentMarks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {marks.map((mark) => (
        <img key={mark.label} src={mark.src} alt={mark.label} className="h-8 w-auto rounded-[0.2rem] shadow-sm" />
      ))}
      <a className="sr-only" href="https://github.com/datatrans/payment-logos">
        Card marks by datatrans, CC BY-SA 4.0
      </a>
    </div>
  );
}

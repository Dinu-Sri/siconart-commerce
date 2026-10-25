import type { ReactNode } from "react";

export function PaymentMarks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <Mark label="Visa">
        <text x="8" y="18" fill="#1a1f71" fontFamily="Georgia, serif" fontSize="13" fontStyle="italic" fontWeight="700">
          VISA
        </text>
      </Mark>
      <Mark label="Mastercard">
        <circle cx="16" cy="14" r="7" fill="#eb001b" />
        <circle cx="24" cy="14" r="7" fill="#f79e1b" fillOpacity="0.95" />
      </Mark>
      <Mark label="American Express">
        <rect x="4" y="6" width="36" height="16" rx="2" fill="#2e77bc" />
        <text x="22" y="17" textAnchor="middle" fill="#ffffff" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="700">
          AMEX
        </text>
      </Mark>
      <Mark label="Discover">
        <circle cx="30" cy="14" r="7" fill="#f76b1c" />
        <text x="6" y="17" fill="#231f20" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="700">
          DISC
        </text>
      </Mark>
      <Mark label="UnionPay">
        <rect x="6" y="6" width="8" height="16" rx="1" fill="#e21836" />
        <rect x="16" y="6" width="8" height="16" rx="1" fill="#00447c" />
        <rect x="26" y="6" width="8" height="16" rx="1" fill="#007b84" />
      </Mark>
    </div>
  );
}

function Mark({ label, children }: { label: string; children: ReactNode }) {
  return (
    <svg role="img" aria-label={label} viewBox="0 0 44 28" className="h-7 w-11 rounded-[0.3rem] bg-white shadow-sm">
      <title>{label}</title>
      {children}
    </svg>
  );
}

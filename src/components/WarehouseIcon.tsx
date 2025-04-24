import * as React from "react";

// Lager/warehouse icon (simple box)
export const WarehouseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
    {...props}
  >
    <rect x="3" y="10" width="18" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 10l9-6 9 6" stroke="currentColor" strokeWidth="1.5" />
    <rect x="9" y="14" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

import type { SVGProps } from "react";

export function NorthbeamLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="16"
        fontWeight="600"
        fontFamily="var(--font-sans, 'Inter', 'system-ui', sans-serif)"
        fill="currentColor"
      >
        Northbeam
      </text>
    </svg>
  );
}

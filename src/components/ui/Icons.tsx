import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const InstagramIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon = (p: IconProps) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M14 8V6.5c0-.8.4-1.2 1.3-1.2H17V2h-2.6C11.6 2 10 3.7 10 6.2V8H7.5v3.3H10V22h4V11.3h2.8L17.3 8H14z" />
  </svg>
);

export const PinterestIcon = (p: IconProps) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M12.2 2C7 2 4.5 5.5 4.5 8.6c0 1.8.7 3.4 2.2 4 .2.1.5 0 .5-.3l.2-.9c.1-.3 0-.4-.1-.7-.4-.5-.7-1.100-.7-2 0-2.600 1.900-4.900 5.100-4.900 2.800 0 4.300 1.700 4.300 4 0 3-1.300 5.500-3.300 5.500-1.100 0-1.900-.9-1.600-2 .3-1.300.9-2.700.9-3.600 0-.8-.4-1.500-1.300-1.500-1 0-1.900 1.100-1.900 2.500 0 .9.3 1.500.3 1.500l-1.200 5.100c-.4 1.500-.1 3.400 0 3.600 0 .1.200.1.300 0 .1-.2 1.500-1.900 2-3.600l.7-2.700c.4.700 1.400 1.300 2.500 1.300 3.300 0 5.500-3 5.500-7C19.100 4.700 16.500 2 12.200 2z" />
  </svg>
);

export const YoutubeIcon = (p: IconProps) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M21.600 7.200a2.500 2.500 0 0 0-1.800-1.800C18.200 5 12 5 12 5s-6.200 0-7.800.4A2.500 2.500 0 0 0 2.400 7.200C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800zM10 15V9l5.200 3L10 15z" />
  </svg>
);

export const WhatsappIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 21l1.65-4.8A9 9 0 1 1 8 19.400L3 21z" />
    <path
      d="M9 8.500c0 3.500 3 6.500 6.500 6.500l1-1.400-2-1-.8.800a4.500 4.500 0 0 1-2-2l.8-.8-1-2L9 8.500z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

export const MailIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

export const PinIcon = (p: IconProps) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M12 2a7 7 0 0 0-7 7c0 5.200 7 13 7 13s7-7.800 7-13a7 7 0 0 0-7-7zm0 9.500A2.500 2.500 0 1 1 12 6.500a2.500 2.500 0 0 1 0 5z" />
  </svg>
);

export const ClockIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const LockIcon = (p: IconProps) => (
  <svg
    {...base}
    width={11}
    height={11}
    fill="currentColor"
    stroke="none"
    {...p}
  >
    <path d="M17 8V7a5 5 0 0 0-10 0v1H5v13h14V8h-2zm-8 0V7a3 3 0 0 1 6 0v1H9z" />
  </svg>
);

export const SendIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

export const ArrowUpIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const PlayIcon = (p: IconProps) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const HeartIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

export const CrownIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
    <path d="M5 21h14" />
  </svg>
);

export const GraduationIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
    <path d="M22 10v6" />
    <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
  </svg>
);

export const ChatIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export const HomeIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </svg>
);

export const UserIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

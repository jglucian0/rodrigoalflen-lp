import type { CSSProperties, ReactNode } from "react";
import { ArrowRightIcon } from "../ui/Icons";

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  primary?: boolean;
  /** posição na página: define o atraso da animação de entrada */
  index?: number;
}

export default function LinkButton({
  href,
  children,
  icon,
  primary,
  index = 0,
}: LinkButtonProps) {
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      className={`lk-btn lk-rise ${primary ? "lk-btn--primary" : ""}`}
      style={{ "--i": index } as CSSProperties}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {icon && (
        <span className="lk-btn__ico" aria-hidden>
          {icon}
        </span>
      )}
      <span className="lk-btn__label">{children}</span>
      <ArrowRightIcon className="lk-btn__arrow" />
    </a>
  );
}

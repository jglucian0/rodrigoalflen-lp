interface PlaceholderProps {
  alt: string;
  ratio?: "portrait" | "landscape" | "square" | "wide";
  tone?: number;
  className?: string;
}

/** Substitui as fotos: mantém o layout idêntico sem carregar imagens. */
export default function Placeholder({
  alt,
  ratio = "portrait",
  tone = 0,
  className = "",
}: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`ph ph--${ratio} ph--tone-${tone % 4} ${className}`.trim()}
    />
  );
}

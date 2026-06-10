import { asset } from "@/lib/base";
import { cn } from "@/lib/cn";

/**
 * Base-path-aware, lazy, object-cover image for real photos in /public/img.
 * Static export → plain <img> (no next/image optimizer). Wrap it in a framed
 * container for aspect ratio.
 */
export function Photo({
  src,
  alt,
  className,
  style,
  priority = false,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset(src)}
      alt={alt}
      sizes={sizes}
      style={style}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

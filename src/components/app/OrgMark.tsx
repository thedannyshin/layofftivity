import { cn } from "@/lib/utils";

const covers: Record<string, string> = {
  harvest: "/orgs/harvest.jpg",
  creek: "/orgs/creek.jpg",
  books: "/orgs/books.jpg",
  garden: "/orgs/garden.jpg",
  paws: "/orgs/paws.jpg",
  keys: "/orgs/keys.jpg",
};

export const coverSrc = (cover: string) => covers[cover] ?? covers.harvest;

/** Small square photo thumbnail for an organization. */
export function OrgMark({
  cover,
  size = 48,
  alt = "",
  className,
}: {
  cover: string;
  size?: number;
  alt?: string;
  className?: string;
}) {
  return (
    <img
      src={coverSrc(cover)}
      alt={alt}
      loading="lazy"
      style={{ width: size, height: size }}
      className={cn("shrink-0 rounded-xl bg-card object-cover", className)}
    />
  );
}

/** Wide photo banner used at the top of carousel cards. */
export function CoverPhoto({
  cover,
  alt,
  className,
}: {
  cover: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={coverSrc(cover)}
      alt={alt}
      loading="lazy"
      className={cn("h-32 w-full bg-card object-cover", className)}
    />
  );
}
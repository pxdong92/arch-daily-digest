import { useState } from "react"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DesignCase } from "@/lib/mock-data"
import { SourceTag } from "./SourceTag"

interface CaseCardProps {
  item: DesignCase;
  index: number;
}

export function CaseCard({ item, index }: CaseCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <a
      href={item.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block break-inside-avoid mb-4 group animate-fade-in"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
    >
      <article className="bg-card rounded-lg overflow-hidden shadow-card transition-all duration-250 ease-smooth hover:shadow-card-hover hover:-translate-y-1">
        {/* Image */}
        <div className="relative overflow-hidden">
          <div
            className={cn(
              "w-full bg-muted transition-opacity duration-500",
              imageLoaded ? "opacity-0 absolute inset-0" : "opacity-100"
            )}
            style={{ aspectRatio: item.aspectRatio }}
          />
          <img
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={cn(
              "w-full h-auto transition-all duration-500 ease-smooth",
              "group-hover:scale-[1.03]",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
          {/* Source tag */}
          <div className="absolute top-3 left-3">
            <SourceTag source={item.source} />
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-250 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-250">
              <ExternalLink className="h-5 w-5 text-background drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-medium text-card-foreground leading-snug line-clamp-2 text-[0.9375rem]">
            {item.title}
          </h3>
          {item.architect && (
            <p className="mt-1.5 text-sm text-muted-foreground truncate">
              {item.architect}
            </p>
          )}
          {item.category && (
            <span className="inline-block mt-2 text-xs text-muted-foreground/60 border border-border rounded px-1.5 py-0.5">
              {item.category}
            </span>
          )}
        </div>
      </article>
    </a>
  );
}

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddToQuoteButton } from "@/components/quote/add-to-quote-button";
import type { Tables } from "@/types/database";

type ProductCardProps = {
  product: Tables<"products">;
  brandName?: string | null;
};

export function ProductCard({ product, brandName }: ProductCardProps) {
  const imageUrl = product.images?.[0] ?? null;

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="relative aspect-square bg-muted">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Sin imagen
            </div>
          )}
        </div>
      </Link>
      <CardHeader className="space-y-1 pb-2">
        {brandName ? (
          <Badge variant="secondary" className="w-fit text-xs">
            {brandName}
          </Badge>
        ) : null}
        <CardTitle className="line-clamp-2 text-base leading-snug">
          <Link
            href={`/producto/${product.slug}`}
            className="hover:text-primary"
          >
            {product.name}
          </Link>
        </CardTitle>
        {product.part_number ? (
          <p className="text-xs text-muted-foreground">
            No. parte: {product.part_number}
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <p className="text-lg font-semibold">
          {formatMx(product.price)}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-0 sm:flex-row">
        <Link
          href={`/producto/${product.slug}`}
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full flex-1 text-center"
          )}
        >
          Ver detalle
        </Link>
        <AddToQuoteButton
          productId={product.id}
          slug={product.slug}
          name={product.name}
          price={product.price}
          imageUrl={imageUrl}
          variant="outline"
          className="w-full flex-1"
        />
      </CardFooter>
    </Card>
  );
}

function formatMx(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

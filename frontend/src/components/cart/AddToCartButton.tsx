"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { CartIcon, CheckIcon } from "@/components/ui/Icons";

/**
 * "Add to inquiry" button used on product cards and on the detail page.
 * Updates the header cart badge immediately via CartContext.
 *
 * A product marked out of stock in the admin panel renders a disabled button
 * instead - visitors can still reach it through the WhatsApp CTA beside it.
 */
export function AddToCartButton({
  product,
  quantity = 1,
  variant = "primary",
  size = "md",
  fullWidth = false,
  label = "Add to Cart",
  openDrawer = false,
}: {
  product: Product;
  quantity?: number;
  variant?: "primary" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  label?: string;
  openDrawer?: boolean;
}) {
  const { addItem, isInCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  if (!product.inStock) {
    return (
      <Button
        variant="outline"
        size={size}
        fullWidth={fullWidth}
        disabled
        aria-label={`${product.name} is out of stock`}
      >
        Out of Stock
      </Button>
    );
  }

  function handleClick() {
    addItem(product, quantity, openDrawer);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  }

  const alreadyInCart = isInCart(product.slug);

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={handleClick}
      aria-label={`Add ${product.name} to your inquiry list`}
    >
      {justAdded ? (
        <>
          <CheckIcon className="text-[1.1em]" />
          Added
        </>
      ) : (
        <>
          <CartIcon className="text-[1.1em]" />
          {alreadyInCart ? "Add another" : label}
        </>
      )}
    </Button>
  );
}

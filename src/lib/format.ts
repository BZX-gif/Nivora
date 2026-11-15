/** Format an INR amount the way Indian buyers read it: ₹85 Lakh, ₹1.2 Cr. */
export function formatINR(amount: number): string {
  if (amount >= 10_000_000) {
    const cr = amount / 10_000_000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2).replace(/0$/, "")} Cr`;
  }
  if (amount >= 100_000) {
    const lakh = amount / 100_000;
    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)} Lakh`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatPrice(amount: number, listingType: "buy" | "rent"): string {
  return listingType === "rent" ? `${formatINR(amount)}/mo` : formatINR(amount);
}

export function formatArea(sqft: number): string {
  if (sqft >= 10000) return `${(sqft / 10000).toFixed(1).replace(/\.0$/, "")}k sq.ft.`;
  return `${sqft.toLocaleString("en-IN")} sq.ft.`;
}

export function timeAgo(days: number): string {
  if (days <= 0) return "Listed today";
  if (days === 1) return "Listed yesterday";
  if (days < 30) return `Listed ${days} days ago`;
  const months = Math.round(days / 30);
  return `Listed ${months} month${months > 1 ? "s" : ""} ago`;
}

export function pricePerSqft(price: number, areaSqft: number): string {
  return formatINR(Math.round(price / areaSqft));
}

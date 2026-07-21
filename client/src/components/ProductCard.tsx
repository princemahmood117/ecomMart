import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/products/${product.id}`} className="block rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      <div className="relative w-full h-48">
        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
      </div>
      <div className="p-4 space-y-1">
        <p className="font-medium">{product.name}</p>
        <p className="text-sm text-gray-500">{product.brand}</p>
        <div className="flex justify-between items-center pt-1">
          <span className="font-semibold">${product.price.toFixed(2)}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </Link>
  );
}
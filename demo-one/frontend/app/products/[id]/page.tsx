import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProduct(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function ProductPage({
  params,
}: PageProps) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold">
            Product Not Found
          </h1>

          <Link
            href="/shop"
            className="mt-8 inline-block bg-white text-black px-8 py-4 rounded-full"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
        {/* Product Image */}
        <div>
          <img
            src={product.images[0]}
            alt={product.name}
            className="rounded-3xl w-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div>
          <p className="text-zinc-400 uppercase tracking-[0.3em]">
            Fashion Fit
          </p>

          <h1 className="text-6xl font-bold mt-4">
            {product.name}
          </h1>

          <p className="text-3xl mt-8 font-light">
            R{product.price}
          </p>

          <p className="text-zinc-300 mt-10 leading-8">
            {product.description}
          </p>

          {/* Colours */}
          <div className="mt-12">
            <h3 className="text-xl mb-4">
              Colours
            </h3>

            <div className="flex gap-3 flex-wrap">
              {product.colors.map((color: string) => (
                <span
                  key={color}
                  className="px-5 py-2 rounded-full bg-white/10 border border-white/10"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mt-10">
            <h3 className="text-xl mb-4">
              Sizes
            </h3>

            <div className="flex gap-3 flex-wrap">
              {product.sizes.map((size: string) => (
                <button
                  key={size}
                  className="w-14 h-14 rounded-full border border-white/20 hover:bg-white hover:text-black transition"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-14">
            <button
              className="
                flex-1
                bg-white
                text-black
                py-5
                rounded-full
                font-semibold
                hover:scale-105
                transition
              "
            >
              Add to Cart
            </button>

            <button
              className="
                flex-1
                border
                border-white/20
                py-5
                rounded-full
                hover:bg-white/10
                transition
              "
            >
              Buy Now
            </button>
          </div>

          {/* Stock */}
          <p className="mt-8 text-zinc-400">
            Stock Available: {product.stock}
          </p>
        </div>
      </div>
    </main>
  );
}
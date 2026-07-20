import ProductView from "@/components/products/ProductView";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  return <ProductView productId={id} />;
}

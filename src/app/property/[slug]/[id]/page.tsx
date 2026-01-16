import { notFound } from "next/navigation";
import { PropertyListing } from "@/data/property-listing";
import PropertyDetail from "@/components/property-detail";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = PropertyListing.projects.find(p => p.id === parseInt(id));
  
  if (!property) {
    return {
      title: "Property Not Found",
      description: "The requested property could not be found.",
    };
  }
  
  return {
    title: `${property.name} | PrimeProperties`,
    description: `${property.type} in ${property.micromarket}, ${property.city}. ${property.typologies.join(", ")} from ${Math.round(property.minPrice / 10000000)}Cr.`,
    openGraph: {
      title: `${property.name} | PrimeProperties`,
      description: `Premium ${property.type} in ${property.micromarket}, ${property.city}`,
      images: [property.image],
    },
  };
}

export default async function PropertyPage({ params }: PageProps) {
  const { id } = await params;
  const property = PropertyListing.projects.find(p => p.id === parseInt(id));
  
  if (!property) {
    notFound();
  }
  
  // Get similar properties
  const similarProperties = PropertyListing.projects
    .filter(p => 
      p.id !== property.id && 
      (p.micromarket === property.micromarket || p.type === property.type)
    )
    .slice(0, 4);
  
  return <PropertyDetail property={property} similarProperties={similarProperties} />;
}
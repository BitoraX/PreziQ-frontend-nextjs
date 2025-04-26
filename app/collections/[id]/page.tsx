import { MOCK_COLLECTIONS } from "./components/mock-data";
import CollectionDetailPage from "./detail-collection-page";


// This function defines the static paths that will be pre-rendered at build time
export async function generateStaticParams() {
  // Return collection IDs
  return MOCK_COLLECTIONS.map((collection) => ({
    id: collection.id.toString(),
  }));
}

export default function Page({ params }: { params: { id: string } }) {
  return <CollectionDetailPage params={params} />;
}
import { MOCK_COLLECTIONS } from "../components/mock-data";
import EditActivitiesPage from "./edit-collection-page";



// This function is required for static export
export async function generateStaticParams() {
  return MOCK_COLLECTIONS.map((collection) => ({
    id: collection.id.toString(),
  }));
}

export default function Page({ params }: { params: { id: string } }) {
  return <EditActivitiesPage params={params} />;
}
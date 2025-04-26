import LobbyPageClient from "./lobby-page";


// Mock data for session IDs
const MOCK_SESSION_IDS = ["123456", "789012", "345678"];

// This function generates static pages at build time
export async function generateStaticParams() {
    // In a real app, you would fetch this data from your API or database
    return MOCK_SESSION_IDS.map((id) => ({
        id: id,
    }));
}

export default function LobbyPage() {
    return <LobbyPageClient />;
}
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    PlusCircle, Search, FolderOpen, Edit, Eye,
    BookOpen, CalendarIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
    MOCK_COLLECTIONS,
    getActivitiesByCollectionId,
    deleteCollection
} from "./[id]/components/mock-data";

export default function CollectionsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [collections, setCollections] = useState(MOCK_COLLECTIONS);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("list");

    // Filter collections based on search query
    const filteredCollections = collections?.filter(collection =>
        collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get activities for a specific collection using the mock data helper function
    const getCollectionActivities = (collectionId: string) => {
        return getActivitiesByCollectionId(collectionId);
    };

    const handleCreateCollection = () => {
        router.push("/collections/create");
    };

    const handleViewActivities = (id: string) => {
        router.push(`/collections/${id}`);
    };

    const handleEditCollection = (id: string) => {
        router.push(`/collections/${id}/edit`);
    };

    const handleDeleteCollection = (id: string) => {
        // Use the mock data helper function to delete the collection
        const deleted = deleteCollection(id);
        if (deleted) {
            setCollections(collections.filter(collection => collection.id !== id));
            toast({
                title: "Collection deleted",
                description: "The collection has been successfully deleted.",
                variant: "default",
            });
        } else {
            toast({
                title: "Error",
                description: "Failed to delete collection.",
                variant: "destructive",
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getActivityPastelColor = (activityType: string) => {
        // Map of activity types to pastel colors
        const colorMap: Record<string, string> = {
            "quiz": "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800/30",
            "presentation": "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30",
            "poll": "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/30",
            "discussion": "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30",
            "assignment": "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30",
            "document": "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/30",
        };

        // Default color if type is not in the map
        return colorMap[activityType.toLowerCase()] || "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800/30";
    };

    // Function to get a color for a collection based on its index
    const getCollectionColor = (index: number) => {
        const colors = [
            {
                card: "border-indigo-200 dark:border-indigo-800/30 hover:border-indigo-300 dark:hover:border-indigo-700",
                header: "bg-indigo-50 dark:bg-indigo-900/20",
                button: "bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/40 dark:text-indigo-300"
            },
            {
                card: "border-violet-200 dark:border-violet-800/30 hover:border-violet-300 dark:hover:border-violet-700",
                header: "bg-violet-50 dark:bg-violet-900/20",
                button: "bg-violet-100 hover:bg-violet-200 text-violet-700 dark:bg-violet-900/30 dark:hover:bg-violet-800/40 dark:text-violet-300"
            },
            {
                card: "border-pink-200 dark:border-pink-800/30 hover:border-pink-300 dark:hover:border-pink-700",
                header: "bg-pink-50 dark:bg-pink-900/20",
                button: "bg-pink-100 hover:bg-pink-200 text-pink-700 dark:bg-pink-900/30 dark:hover:bg-pink-800/40 dark:text-pink-300"
            },
            {
                card: "border-blue-200 dark:border-blue-800/30 hover:border-blue-300 dark:hover:border-blue-700",
                header: "bg-blue-50 dark:bg-blue-900/20",
                button: "bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 dark:text-blue-300"
            },
            {
                card: "border-teal-200 dark:border-teal-800/30 hover:border-teal-300 dark:hover:border-teal-700",
                header: "bg-teal-50 dark:bg-teal-900/20",
                button: "bg-teal-100 hover:bg-teal-200 text-teal-700 dark:bg-teal-900/30 dark:hover:bg-teal-800/40 dark:text-teal-300"
            },
            {
                card: "border-amber-200 dark:border-amber-800/30 hover:border-amber-300 dark:hover:border-amber-700",
                header: "bg-amber-50 dark:bg-amber-900/20",
                button: "bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900/30 dark:hover:bg-amber-800/40 dark:text-amber-300"
            }
        ];

        return colors[index % colors.length];
    };

    const collectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.3
            }
        })
    };

    return (
        <div className="flex justify-center">
            <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">My Collections</h1>
                        <p className="text-muted-foreground mt-2 text-lg">
                            Create and manage your interactive learning collections
                        </p>
                    </div>
                    <Button
                        onClick={handleCreateCollection}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all rounded-none"
                        size="lg"
                    >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        New Collection
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search collections..."
                            className="pl-10 border-zinc-300 dark:border-zinc-700 h-11 rounded-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
                        <TabsList className="grid w-[180px] grid-cols-2 rounded-none p-0.5 bg-zinc-100 dark:bg-zinc-800">
                            <TabsTrigger value="grid" className="flex items-center rounded-none">
                                <div className="grid grid-cols-2 gap-0.5 mr-2">
                                    <div className="w-2 h-2 bg-current"></div>
                                    <div className="w-2 h-2 bg-current"></div>
                                    <div className="w-2 h-2 bg-current"></div>
                                    <div className="w-2 h-2 bg-current"></div>
                                </div>
                                Grid
                            </TabsTrigger>
                            <TabsTrigger value="list" className="flex items-center rounded-none">
                                <div className="flex flex-col gap-0.5 mr-2">
                                    <div className="w-4 h-1 bg-current"></div>
                                    <div className="w-4 h-1 bg-current"></div>
                                    <div className="w-4 h-1 bg-current"></div>
                                </div>
                                List
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {filteredCollections?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                        <FolderOpen className="h-16 w-16 text-zinc-300 dark:text-zinc-700 mb-6" />
                        <h3 className="text-xl font-semibold">No collections found</h3>
                        <p className="text-muted-foreground text-center mt-2 mb-8 max-w-lg">
                            {searchQuery ? "Try a different search term or clear your search to see all collections." : "Create your first collection to start building interactive learning experiences."}
                        </p>
                        {!searchQuery && (
                            <Button
                                onClick={handleCreateCollection}
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-none"
                                size="lg"
                            >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Collection
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        {viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCollections.map((collection, i) => {
                                    const colorTheme = getCollectionColor(i);
                                    return (
                                        <motion.div
                                            key={collection.id}
                                            variants={collectionVariants}
                                            initial="hidden"
                                            animate="visible"
                                            custom={i}
                                            className="group"
                                        >
                                            <Card className={`h-full overflow-hidden hover:shadow-lg transition-all ${colorTheme.card} dark:border-zinc-800 rounded-none`}>
                                                <div
                                                    className={`aspect-video w-full bg-cover bg-center relative overflow-hidden cursor-pointer`}
                                                    style={{ backgroundImage: `url(${collection.coverImage})` }}
                                                    onClick={() => handleViewActivities(collection.id)}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 rounded-none">
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Detail
                                                        </Button>
                                                    </div>
                                                    {collection.is_published && (
                                                        <Badge className="absolute top-3 right-3 bg-emerald-500 text-white shadow-sm rounded-none">Published</Badge>
                                                    )}
                                                </div>
                                                <div className={`p-5 ${colorTheme.header}`}>
                                                    <h3 className="font-semibold text-xl mb-2 line-clamp-1">{collection.title}</h3>
                                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2">{collection.description}</p>

                                                    <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 space-x-4 mb-4">
                                                        <div className="flex items-center">
                                                            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                                                            {getCollectionActivities(collection.id).length} Activities
                                                        </div>
                                                        <div className="flex items-center">
                                                            <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                                                            {formatDate(collection.updated_at)}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <Button
                                                            className={`${colorTheme.button} rounded-none`}
                                                            size="sm"
                                                            onClick={() => handleViewActivities(collection.id)}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Detail
                                                        </Button>
                                                        <Button
                                                            className={`${colorTheme.button} rounded-none`}
                                                            size="sm"
                                                            onClick={() => handleEditCollection(collection.id)}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredCollections.map((collection, i) => {
                                    const colorTheme = getCollectionColor(i);
                                    return (
                                        <motion.div
                                            key={collection.id}
                                            variants={collectionVariants}
                                            initial="hidden"
                                            animate="visible"
                                            custom={i}
                                        >
                                            <Card className={`overflow-hidden hover:shadow-md transition-all ${colorTheme.card} dark:border-zinc-800 rounded-none`}>
                                                <div className="flex flex-col sm:flex-row">
                                                    <div
                                                        className="sm:w-64 h-40 sm:h-auto bg-cover bg-center cursor-pointer relative"
                                                        style={{ backgroundImage: `url(${collection.coverImage})` }}
                                                        onClick={() => handleViewActivities(collection.id)}
                                                    >
                                                        {collection.is_published && (
                                                            <Badge className="absolute top-3 right-3 bg-emerald-500 text-white shadow-sm rounded-none">
                                                                Published
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className={`flex-1 p-5 ${colorTheme.header}`}>
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                                            <h3 className="font-semibold text-xl">{collection.title}</h3>
                                                            <div className="flex items-center space-x-2 text-xs text-zinc-500 dark:text-zinc-400">
                                                                <div className="flex items-center">
                                                                    <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                                                                    {getCollectionActivities(collection.id).length} Activities
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                                                                    {formatDate(collection.updated_at)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">{collection.description}</p>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                className={`${colorTheme.button} rounded-none`}
                                                                size="sm"
                                                                onClick={() => handleViewActivities(collection.id)}
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Detail
                                                            </Button>
                                                            <Button
                                                                className={`${colorTheme.button} rounded-none`}
                                                                size="sm"
                                                                onClick={() => handleEditCollection(collection.id)}
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
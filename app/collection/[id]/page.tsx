"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collectionsApi } from "@/api-client";
import { MOCK_ACTIVITIES } from "../components/mock-data";
import { Collection as OldCollection, Activity as OldActivity } from "@/app/collections/components/types";
import { ArrowLeft, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import DefaultLayout from "@/app/default-layout";

import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { toast } = useToast();
    const collectionId = params.id;

    const [isLoading, setIsLoading] = useState(true);
    const [collection, setCollection] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [displayMode, setDisplayMode] = useState<'summary' | 'activities'>('summary');

    useEffect(() => {
        const fetchCollectionData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch collection details
                const response = await collectionsApi.getCollectionById(collectionId);
                console.log("Collection API Response:", response);

                let processedData;
                if (typeof response.data === "string") {
                    try {
                        const cleanedData = response.data.trim();
                        processedData = JSON.parse(cleanedData);
                    } catch (parseError) {
                        console.error("JSON Parse Error:", parseError);
                        throw new Error("Dữ liệu JSON không hợp lệ từ API");
                    }
                } else {
                    processedData = response.data;
                }

                if (processedData?.success && processedData?.data) {
                    // Store the entire collection data including activities
                    setCollection(processedData.data);
                } else {
                    throw new Error("Collection data structure is invalid");
                }
            } catch (err) {
                console.error("Error fetching collection:", err);
                setError("Could not load collection details. Please try again later.");
                toast({
                    title: "Error",
                    description:
                        typeof err === "object" && err !== null && "message" in err
                            ? String((err as Error).message)
                            : "Failed to load collection",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (collectionId) {
            fetchCollectionData();
        }
    }, [collectionId, toast]);

    const formatDateToLocale = (dateString?: string) => {
        if (!dateString) return "Unknown date";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Invalid date";
            return date.toLocaleDateString();
        } catch (e) {
            return "Invalid date";
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <DefaultLayout showBackButton={true} title="Collection Details">
                <div className="container max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                        <Skeleton className="w-full md:w-1/3 aspect-video rounded-lg" />
                        <div className="w-full md:w-2/3 space-y-4">
                            <Skeleton className="h-10 w-4/5" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-10 w-3/5" />
                        </div>
                    </div>
                    <Separator className="my-8" />
                    <Skeleton className="h-8 w-48 mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-72 w-full rounded-lg" />
                        ))}
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    // Error state
    if (error || !collection) {
        return (
            <DefaultLayout showBackButton={true} title="Error">
                <div className="container max-w-7xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
                    <p className="text-muted-foreground mb-6">{error || "Collection not found"}</p>
                    <Button
                        onClick={() => router.push('/collections')}
                        variant="default"
                    >
                        Back to Collections
                    </Button>
                </div>
            </DefaultLayout>
        );
    }

    const hasActivities = collection.activities && collection.activities.length > 0;

    return (
        <DefaultLayout showBackButton={true} title={collection.title}>
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {displayMode === 'summary' ? (
                    <>
                        <div className="flex flex-col md:flex-row gap-8 mb-8">
                            {/* Collection cover image */}
                            <div className="w-full md:w-1/3 aspect-video rounded-lg overflow-hidden relative shadow-lg">
                                <Image
                                    src={collection.coverImage || "/placeholder-collection.jpg"}
                                    alt={collection.title}
                                    className="object-cover"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    priority
                                />
                            </div>

                            {/* Collection info */}
                            <div className="w-full md:w-2/3">
                                <h1 className="text-3xl font-bold mb-3">{collection.title}</h1>
                                <p className="text-lg text-muted-foreground mb-6">{collection.description}</p>

                                <div className="flex flex-wrap gap-4 mb-6">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Clock className="mr-2 h-4 w-4" />
                                        Created: {formatDateToLocale(collection.createdAt)}
                                    </div>
                                    {collection.createdBy && (
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <User className="mr-2 h-4 w-4" />
                                            Author: {collection.createdBy}
                                        </div>
                                    )}
                                </div>

                                {/* Activity count */}
                                <div className="bg-muted p-4 rounded-lg mb-6">
                                    <h3 className="text-lg font-medium mb-2">Collection Contents</h3>
                                    <p>{hasActivities ? collection.activities.length : 0} activities in this collection</p>
                                </div>

                                {/* View activities button */}
                                {hasActivities && (
                                    <Button
                                        onClick={() => setDisplayMode('activities')}
                                        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                                    >
                                        View All Activities
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Preview of activities */}
                        {hasActivities && (
                            <>
                                <Separator className="my-8" />
                                <h2 className="text-2xl font-bold mb-6">Activity Preview</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {collection.activities.slice(0, 3).map((activity: any) => (
                                        <div
                                            key={activity.activityId}
                                            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                        >
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-xl font-medium">{activity.title}</h3>
                                                    <div className="text-xs bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
                                                        {activity.activityType.replace(/_/g, ' ')}
                                                    </div>
                                                </div>
                                                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                                    {activity.description}
                                                </p>

                                                <div className="mt-4 flex justify-end">
                                                    <Button
                                                        onClick={() => setDisplayMode('activities')}
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {collection.activities.length > 3 && (
                                    <div className="mt-6 text-center">
                                        <Button
                                            onClick={() => setDisplayMode('activities')}
                                            variant="outline"
                                        >
                                            Show All {collection.activities.length} Activities
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}

                        {!hasActivities && (
                            <div className="text-center py-12 bg-muted rounded-lg mt-8">
                                <p className="text-muted-foreground mb-4">
                                    This collection doesn't have any activities yet.
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="flex items-center mb-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDisplayMode('summary')}
                                className="mr-4"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Summary
                            </Button>
                            <h2 className="text-2xl font-bold">Collection Activities</h2>
                        </div>

                        {/* Use our new component for activities display */}
                       
                    </>
                )}
            </div>
        </DefaultLayout>
    );
}
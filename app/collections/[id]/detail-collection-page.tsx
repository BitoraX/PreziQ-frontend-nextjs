"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    getCollectionById,
    getActivitiesByCollectionId,
    Collection,
    Activity
} from "./components/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, Eye, PenLine, Plus, ArrowLeft, Clock3, Calendar, FileText, Book, LayoutList } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function DetailCollectionPage() {
    const { id } = useParams();
    const router = useRouter();
    const [collection, setCollection] = useState<Collection | undefined>(undefined);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    useEffect(() => {
        if (!id || typeof id !== 'string') return;

        const collectionData = getCollectionById(id);
        if (!collectionData) {
            router.push('/collections');
            return;
        }

        setCollection(collectionData);
        const activitiesData = getActivitiesByCollectionId(id);
        setActivities(activitiesData);
        setLoading(false);
    }, [id, router]);

    const handleCreateActivity = () => {
        if (!id) return;
        router.push(`/collections/${id}/create-activity`);
    };

    const handleEditActivity = (activityId: string) => {
        router.push(`/collections/${id}/activities/${activityId}/edit`);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    const getActivityPastelColor = (index: number) => {
        const colorSchemes = [
            {
                header: isDarkMode ? "bg-blue-950/20" : "bg-blue-50",
                border: isDarkMode ? "border-blue-900/30" : "border-blue-200",
                badge: isDarkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-700",
                footer: isDarkMode ? "bg-blue-950/30" : "bg-blue-50/80"
            },
            {
                header: isDarkMode ? "bg-purple-950/20" : "bg-purple-50",
                border: isDarkMode ? "border-purple-900/30" : "border-purple-200",
                badge: isDarkMode ? "bg-purple-900/30 text-purple-300" : "bg-purple-100 text-purple-700",
                footer: isDarkMode ? "bg-purple-950/30" : "bg-purple-50/80"
            },
            {
                header: isDarkMode ? "bg-pink-950/20" : "bg-pink-50",
                border: isDarkMode ? "border-pink-900/30" : "border-pink-200",
                badge: isDarkMode ? "bg-pink-900/30 text-pink-300" : "bg-pink-100 text-pink-700",
                footer: isDarkMode ? "bg-pink-950/30" : "bg-pink-50/80"
            },
            {
                header: isDarkMode ? "bg-teal-950/20" : "bg-teal-50",
                border: isDarkMode ? "border-teal-900/30" : "border-teal-200",
                badge: isDarkMode ? "bg-teal-900/30 text-teal-300" : "bg-teal-100 text-teal-700",
                footer: isDarkMode ? "bg-teal-950/30" : "bg-teal-50/80"
            },
            {
                header: isDarkMode ? "bg-amber-950/20" : "bg-amber-50",
                border: isDarkMode ? "border-amber-900/30" : "border-amber-200",
                badge: isDarkMode ? "bg-amber-900/30 text-amber-300" : "bg-amber-100 text-amber-700",
                footer: isDarkMode ? "bg-amber-950/30" : "bg-amber-50/80"
            },
            {
                header: isDarkMode ? "bg-indigo-950/20" : "bg-indigo-50",
                border: isDarkMode ? "border-indigo-900/30" : "border-indigo-200",
                badge: isDarkMode ? "bg-indigo-900/30 text-indigo-300" : "bg-indigo-100 text-indigo-700",
                footer: isDarkMode ? "bg-indigo-950/30" : "bg-indigo-50/80"
            }
        ];

        return colorSchemes[index % colorSchemes.length];
    };
    const renderActivityContent = (activity: Activity) => {
        switch (activity.type) {
            case "multiple_choice":
            case "multiple_response":
                return (
                    <div className="space-y-4">
                        <div className="font-medium text-foreground">Options:</div>
                        <ul className="space-y-2">
                            {activity.options.map((option, index) => (
                                <li key={index} className={cn(
                                    "flex items-start gap-2 p-3 border rounded-md transition-colors",
                                    option.is_correct
                                        ? isDarkMode
                                            ? "border-emerald-600 bg-emerald-950/30"
                                            : "border-green-300 bg-green-50"
                                        : isDarkMode
                                            ? "border-muted bg-muted/30"
                                            : "border-gray-200 hover:bg-gray-50"
                                )}>
                                    <div className="mt-0.5 flex-shrink-0">
                                        {activity.type === "multiple_choice" ? (
                                            <div className={cn(
                                                "w-4 h-4 rounded-full border flex items-center justify-center",
                                                option.is_correct
                                                    ? isDarkMode
                                                        ? "bg-emerald-600 border-emerald-500"
                                                        : "bg-green-500 border-green-600"
                                                    : isDarkMode
                                                        ? "border-gray-600"
                                                        : "border-gray-400"
                                            )}>
                                                {option.is_correct && (
                                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className={cn(
                                                "w-4 h-4 rounded border flex items-center justify-center",
                                                option.is_correct
                                                    ? isDarkMode
                                                        ? "bg-emerald-600 border-emerald-500"
                                                        : "bg-green-500 border-green-600"
                                                    : isDarkMode
                                                        ? "border-gray-600"
                                                        : "border-gray-400"
                                            )}>
                                                {option.is_correct && (
                                                    <CircleCheck className="w-3 h-3 text-white" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 text-foreground">{option.option_text}</div>
                                    {option.is_correct && (
                                        <Badge variant="outline" className={cn(
                                            isDarkMode
                                                ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                                                : "bg-green-50 text-green-600 border-green-200"
                                        )}>
                                            Correct
                                        </Badge>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {activity.explanation && (
                            <div className={cn(
                                "mt-4 p-4 rounded-md",
                                isDarkMode
                                    ? "bg-blue-950/30 border border-blue-900"
                                    : "bg-blue-50"
                            )}>
                                <div className={cn(
                                    "font-medium mb-1",
                                    isDarkMode ? "text-blue-400" : "text-blue-800"
                                )}>
                                    Explanation:
                                </div>
                                <div className={isDarkMode ? "text-blue-300" : "text-blue-700"}>
                                    {activity.explanation}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case "true_false":
                return (
                    <div className="space-y-4">
                        <div className="font-medium text-foreground">Options:</div>
                        <div className="flex gap-4">
                            <div className={cn(
                                "p-3 border rounded-md flex items-center gap-2 flex-1 justify-center font-medium",
                                activity.options.find(o => o.option_text === 'True')?.is_correct
                                    ? isDarkMode
                                        ? "bg-emerald-950/30 border-emerald-800 text-emerald-400"
                                        : "bg-green-50 border-green-300 text-green-700"
                                    : isDarkMode
                                        ? "border-muted text-muted-foreground"
                                        : "border-gray-200 text-gray-700"
                            )}>
                                <span>True</span>
                                {activity.options.find(o => o.option_text === 'True')?.is_correct && (
                                    <CircleCheck className={cn(
                                        "w-4 h-4",
                                        isDarkMode ? "text-emerald-400" : "text-green-600"
                                    )} />
                                )}
                            </div>
                            <div className={cn(
                                "p-3 border rounded-md flex items-center gap-2 flex-1 justify-center font-medium",
                                activity.options.find(o => o.option_text === 'False')?.is_correct
                                    ? isDarkMode
                                        ? "bg-emerald-950/30 border-emerald-800 text-emerald-400"
                                        : "bg-green-50 border-green-300 text-green-700"
                                    : isDarkMode
                                        ? "border-muted text-muted-foreground"
                                        : "border-gray-200 text-gray-700"
                            )}>
                                <span>False</span>
                                {activity.options.find(o => o.option_text === 'False')?.is_correct && (
                                    <CircleCheck className={cn(
                                        "w-4 h-4",
                                        isDarkMode ? "text-emerald-400" : "text-green-600"
                                    )} />
                                )}
                            </div>
                        </div>
                        {activity.explanation && (
                            <div className={cn(
                                "mt-4 p-4 rounded-md",
                                isDarkMode
                                    ? "bg-blue-950/30 border border-blue-900"
                                    : "bg-blue-50"
                            )}>
                                <div className={cn(
                                    "font-medium mb-1",
                                    isDarkMode ? "text-blue-400" : "text-blue-800"
                                )}>
                                    Explanation:
                                </div>
                                <div className={isDarkMode ? "text-blue-300" : "text-blue-700"}>
                                    {activity.explanation}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case "text_answer":
                return (
                    <div className="space-y-4">
                        {activity.slide_content && (
                            <div className={cn(
                                "prose max-w-none",
                                isDarkMode ? "prose-invert" : ""
                            )} dangerouslySetInnerHTML={{ __html: activity.slide_content }}></div>
                        )}
                        {activity.slide_image && (
                            <div className="relative h-64 w-full overflow-hidden rounded-lg border">
                                <Image
                                    src={activity.slide_image}
                                    alt="Slide image"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        {activity.correct_answer_text && (
                            <div className={cn(
                                "mt-4 p-4 rounded-md",
                                isDarkMode
                                    ? "bg-emerald-950/30 border border-emerald-900"
                                    : "bg-green-50"
                            )}>
                                <div className={cn(
                                    "font-medium mb-1",
                                    isDarkMode ? "text-emerald-400" : "text-green-800"
                                )}>
                                    Reference answer:
                                </div>
                                <div className={isDarkMode ? "text-emerald-300" : "text-green-700"}>
                                    {activity.correct_answer_text}
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return <div className="text-muted-foreground">No content available</div>;
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-10 max-w-7xl">
                <div className="mb-8">
                    <Skeleton className="h-4 w-32 mb-6" />
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-2/3">
                            <div className="space-y-3 mb-6">
                                <Skeleton className="h-10 w-64" />
                                <Skeleton className="h-4 w-96" />
                            </div>
                            <Skeleton className="h-6 w-48 mb-4" />
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="border rounded-lg overflow-hidden">
                                        <div className="p-6 bg-muted/30">
                                            <Skeleton className="h-6 w-full max-w-md mb-3" />
                                            <Skeleton className="h-4 w-full max-w-sm" />
                                        </div>
                                        <div className="p-6">
                                            <div className="space-y-3">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-3/4" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/3">
                            <div className="sticky top-20">
                                <Skeleton className="h-10 w-full mb-6" />
                                <Skeleton className="h-[200px] w-full rounded-lg mb-6" />
                                <div className="space-y-3">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!collection) {
        return (
            <div className="container mx-auto py-20 max-w-5xl">
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="text-2xl font-semibold text-muted-foreground">Collection not found</div>
                    <p className="text-muted-foreground max-w-md">The collection you're looking for might have been removed or is not accessible.</p>
                    <Button onClick={() => router.push('/collections')}>
                        Return to Collections
                    </Button>
                </div>
            </div>
        );
    }

    const countByType = activities.reduce((acc, activity) => {
        acc[activity.type] = (acc[activity.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="container mx-auto py-10 max-w-7xl">
            <Link href="/collections" className="text-primary hover:text-primary/80 mb-6 inline-flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Collections
            </Link>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main content column (7/10) */}
                <div className="lg:w-2/3">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-foreground">{collection.title}</h1>
                        <p className="text-muted-foreground mt-2">{collection.description}</p>
                        <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Created: {formatDate(collection.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Badge variant={collection.is_published ? "default" : "outline"} className="text-xs">
                                    {collection.is_published ? "Published" : "Draft"}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold border-b border-border pb-2 flex items-center justify-between">
                            <span>Activities ({activities.length})</span>
                            {activities.length > 0 && (
                                <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => router.push(`/collections/${id}/preview`)}>
                                    <Eye className="w-4 h-4" /> Preview Mode
                                </Button>
                            )}
                        </h2>

                        {activities.length === 0 ? (
                            <div className={cn(
                                "text-center py-16 border rounded-lg flex flex-col items-center",
                                isDarkMode ? "border-border" : "border-gray-200"
                            )}>
                                <div className="bg-muted rounded-full p-3 mb-4">
                                    <Plus className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-muted-foreground mb-4">No activities in this collection yet</h3>
                                <Button onClick={handleCreateActivity} className="flex items-center gap-1.5">
                                    <Plus className="w-4 h-4" /> Create Activity
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {activities.map((activity, index) => {
                                    const activityColor = getActivityPastelColor(index);

                                    return (
                                        <Card key={activity.id} className={cn(
                                            "overflow-hidden transition-all rounded-md",
                                            activityColor.border,
                                            activityColor.header, // Apply the header color to the entire card
                                            isDarkMode ? "hover:border-border/80" : "hover:shadow-md"
                                        )}>
                                            <CardHeader className={cn(
                                                "border-b",
                                                isDarkMode ? "border-border/20" : "border-gray-200/50"
                                            )}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                                            <Badge variant={activity.is_published ? "default" : "outline"} className={
                                                                activity.is_published
                                                                    ? ""
                                                                    : isDarkMode
                                                                        ? "text-muted-foreground"
                                                                        : ""
                                                            }>
                                                                {activity.is_published ? "Published" : "Draft"}
                                                            </Badge>
                                                            <Badge variant="outline" className={cn(
                                                                "capitalize",
                                                                activityColor.badge
                                                            )}>
                                                                {activity.type.replace(/_/g, ' ')}
                                                            </Badge>
                                                        </div>
                                                        <CardTitle className="text-foreground group">
                                                            <span className="flex items-baseline gap-1">
                                                                <span className="text-muted-foreground font-normal">{index + 1}.</span>
                                                                {activity.title}
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    onClick={() => handleEditActivity(activity.id)}
                                                                >
                                                                    <PenLine className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </span>
                                                        </CardTitle>
                                                        {activity.description && (
                                                            <CardDescription className="mt-1">{activity.description}</CardDescription>
                                                        )}
                                                    </div>
                                                    <Button variant="outline" size="sm" onClick={() => handleEditActivity(activity.id)}
                                                        className={cn(
                                                            "flex items-center gap-1",
                                                            isDarkMode ? "bg-background/40 hover:bg-background/70" : "bg-white/70 hover:bg-white/90"
                                                        )}
                                                    >
                                                        <PenLine className="w-3.5 h-3.5" /> Edit
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-6">
                                                {renderActivityContent(activity)}
                                            </CardContent>
                                            <CardFooter className={cn(
                                                "text-xs text-muted-foreground border-t",
                                                isDarkMode ? "border-border/20" : "border-gray-200/50"
                                            )}>
                                                <div className="flex justify-between w-full py-1">
                                                    <span>Created: {formatDate(activity.created_at)}</span>
                                                    <span>Updated: {formatDate(activity.updated_at)}</span>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar column (3/10) */}
                <div className="lg:w-1/3">
                    <div className="sticky top-20 space-y-6">
                        {/* Actions panel */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => router.push(`/collections/${id}/edit`)}
                                >
                                    <PenLine className="mr-2 h-4 w-4" /> Edit/ Add Collection
                                </Button>

                                {activities.length > 0 && (
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => router.push(`/collections/${id}/preview`)}
                                    >
                                        <Eye className="mr-2 h-4 w-4" /> Preview Mode
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Collection stats */}
                        {collection.coverImage && (
                            <Card className="overflow-hidden">
                                <div className="relative h-40 w-full">
                                    <Image
                                        src={collection.coverImage}
                                        alt={collection.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <div className="text-sm font-medium">Collection Cover</div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Collection Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={cn(
                                        "p-3 rounded-lg border flex flex-col items-center text-center",
                                        isDarkMode ? "bg-muted/30" : "bg-gray-50"
                                    )}>
                                        <FileText className="h-5 w-5 mb-1 text-muted-foreground" />
                                        <div className="text-2xl font-semibold">{activities.length}</div>
                                        <div className="text-xs text-muted-foreground">Total Activities</div>
                                    </div>
                                    <div className={cn(
                                        "p-3 rounded-lg border flex flex-col items-center text-center",
                                        isDarkMode ? "bg-muted/30" : "bg-gray-50"
                                    )}>
                                        <LayoutList className="h-5 w-5 mb-1 text-muted-foreground" />
                                        <div className="text-2xl font-semibold">
                                            {activities.filter(a => a.is_published).length}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Published</div>
                                    </div>
                                </div>

                                {Object.keys(countByType).length > 0 && (
                                    <>
                                        <div className="text-sm font-medium mt-4">Activities by Type</div>
                                        <div className="space-y-2">
                                            {Object.entries(countByType).map(([type, count]) => (
                                                <div key={type} className="flex justify-between items-center">
                                                    <div className="text-sm capitalize">{type.replace(/_/g, ' ')}</div>
                                                    <Badge variant="secondary">{count}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
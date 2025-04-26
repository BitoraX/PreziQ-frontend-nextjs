"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, CheckCircle, XCircle, Monitor, Share2, AlignLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import {
    getActivitiesByCollectionId,
    getCollectionById,
    getQuestionsByActivityId,
    updateActivity,
    saveQuestions
} from "../components/mock-data";

// Import the Question editor components
import { QuestionList } from "../components/question-editor/question-list";
import { QuestionPreview } from "../components/question-editor/question-preview";
import { QuestionSettings } from "../components/question-editor/question-settings";

export default function EditActivitiesPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const collectionId = params.id;
    const [collection, setCollection] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

    const [questions, setQuestions] = useState<any[]>([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [activeTab, setActiveTab] = useState("content");
    const [timeLimit, setTimeLimit] = useState(30); // seconds
    const [backgroundImage, setBackgroundImage] = useState("");
    const [previewMode, setPreviewMode] = useState(false);

    // Load collection and all activities
    useEffect(() => {
        const collectionData = getCollectionById(collectionId);
        if (collectionData) {
            setCollection(collectionData);
            const activitiesData = getActivitiesByCollectionId(collectionId);

            if (activitiesData.length > 0) {
                setActivities(activitiesData);

                // Set timeLimit from the first activity if available
                if (activitiesData[0].time_limit) {
                    setTimeLimit(activitiesData[0].time_limit);
                }

                // Load questions for all activities in the collection
                const activityQuestions = getQuestionsByActivityId(activitiesData[0].id);

                if (activityQuestions.length > 0) {
                    setQuestions(activityQuestions);
                    setActiveQuestionIndex(0);
                } else {
                    // Create an empty question if none exist
                    const emptyQuestion = createEmptyQuestion(activitiesData[0].id);
                    setQuestions([emptyQuestion]);
                }
            }
        }
    }, [collectionId]);

    // Update current activity based on the selected question
    useEffect(() => {
        if (questions.length > 0 && activeQuestionIndex >= 0 && activeQuestionIndex < questions.length) {
            const currentQuestion = questions[activeQuestionIndex];
            const activityId = currentQuestion.activity_id;
            const activityIndex = activities.findIndex(a => a.id === activityId);

            if (activityIndex !== -1) {
                setCurrentActivityIndex(activityIndex);

                // Update timeLimit for the current activity
                if (activities[activityIndex].time_limit) {
                    setTimeLimit(activities[activityIndex].time_limit);
                }
            }
        }
    }, [activeQuestionIndex, questions, activities]);

    const createEmptyQuestion = (activityId: string): any => ({
        activity_id: activityId,
        question_text: "",
        question_type: "multiple_choice",
        options: [
            { option_text: "", is_correct: true, display_order: 0 },
            { option_text: "", is_correct: false, display_order: 1 },
            { option_text: "", is_correct: false, display_order: 2 },
            { option_text: "", is_correct: false, display_order: 3 }
        ],
        explanation: ""
    });

    const handleSlideContentChange = (value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[activeQuestionIndex] = {
            ...updatedQuestions[activeQuestionIndex],
            slide_content: value
        };
        setQuestions(updatedQuestions);
    };

    const handleSlideImageChange = (value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[activeQuestionIndex] = {
            ...updatedQuestions[activeQuestionIndex],
            slide_image: value
        };
        setQuestions(updatedQuestions);
    };

    const handleAddQuestion = (newQuestion?: any) => {
        const questionToAdd = newQuestion || createEmptyQuestion(activities[currentActivityIndex]?.id || "");
        setQuestions([...questions, questionToAdd]);
        setActiveQuestionIndex(questions.length);
    };

    const handleDeleteQuestion = (index: number) => {
        if (questions.length <= 1) {
            return; // Don't delete the last question
        }

        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);

        if (activeQuestionIndex >= updatedQuestions.length) {
            setActiveQuestionIndex(updatedQuestions.length - 1);
        }
    };

    const handleQuestionTextChange = (value: string, questionIndex: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            question_text: value
        };
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (questionIndex: number, optionIndex: number, field: string, value: any) => {
        const updatedQuestions = [...questions];
        const options = [...updatedQuestions[questionIndex].options];
        const questionType = updatedQuestions[questionIndex].question_type;

        if (field === 'is_correct' && value === true) {
            if (questionType === 'true_false' || questionType === 'multiple_choice') {
                options.forEach((option, i) => {
                    options[i] = { ...option, is_correct: i === optionIndex };
                });
            } else {
                options[optionIndex] = { ...options[optionIndex], [field]: value };
            }
        } else {
            options[optionIndex] = { ...options[optionIndex], [field]: value };
        }

        updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            options
        };

        setQuestions(updatedQuestions);
    };

    const handleQuestionTypeChange = (value: string) => {
        const updatedQuestions = [...questions];
        let options = [...updatedQuestions[activeQuestionIndex].options];

        if (value === "true_false") {
            options = [
                { option_text: "True", is_correct: true, display_order: 0 },
                { option_text: "False", is_correct: false, display_order: 1 }
            ];
        } else if (value === "text_answer") {
            options = [];
        } else if (options.length < 2) {
            options = [
                { option_text: "", is_correct: true, display_order: 0 },
                { option_text: "", is_correct: false, display_order: 1 }
            ];
        } else if (value === "multiple_choice" && updatedQuestions[activeQuestionIndex].question_type === "multiple_response") {
            let hasCorrect = false;
            options = options.map((option, idx) => {
                if (option.is_correct && !hasCorrect) {
                    hasCorrect = true;
                    return option;
                }
                return { ...option, is_correct: false };
            });

            if (!hasCorrect && options.length > 0) {
                options[0] = { ...options[0], is_correct: true };
            }
        }

        updatedQuestions[activeQuestionIndex] = {
            ...updatedQuestions[activeQuestionIndex],
            question_type: value,
            options
        };

        setQuestions(updatedQuestions);
    };

    const handleCorrectAnswerChange = (value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[activeQuestionIndex] = {
            ...updatedQuestions[activeQuestionIndex],
            correct_answer_text: value
        };
        setQuestions(updatedQuestions);
    };

    const handleAddOption = () => {
        const updatedQuestions = [...questions];
        const options = [...updatedQuestions[activeQuestionIndex].options];
        const newOption = {
            option_text: "",
            is_correct: false,
            display_order: options.length
        };

        updatedQuestions[activeQuestionIndex] = {
            ...updatedQuestions[activeQuestionIndex],
            options: [...options, newOption]
        };

        setQuestions(updatedQuestions);
    };

    const handleDeleteOption = (index: number) => {
        if (questions[activeQuestionIndex].options.length <= 2) {
            return; // Don't delete if only 2 options remain
        }

        const updatedQuestions = [...questions];
        const options = [...updatedQuestions[activeQuestionIndex].options];
        options.splice(index, 1);

        options.forEach((option, i) => {
            options[i] = { ...option, display_order: i };
        });

        updatedQuestions[activeQuestionIndex] = {
            ...updatedQuestions[activeQuestionIndex],
            options
        };

        setQuestions(updatedQuestions);
    };

    const handleSave = async () => {
        if (activities.length === 0) return;

        // Save all questions
        saveQuestions(activities[0].id, questions);

        // Update all activities with their respective time limits
        const activityIds = new Set(questions.map(q => q.activity_id));

        activityIds.forEach(activityId => {
            if (activityId) {
                updateActivity(activityId as string, {
                    is_published: true,
                    updated_at: new Date().toISOString(),
                    time_limit: timeLimit
                });
            }
        });

        // Redirect to detail page after saving
        setTimeout(() => {
            router.push(`/collections/${collectionId}`);
        }, 500);
    };

    const activeQuestion = questions[activeQuestionIndex];
    const currentActivity = activities[currentActivityIndex];

    if (!collection || activities.length === 0) {
        return (
            <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-muted-foreground">Loading question editor...</p>
                </div>
            </div>
        );
    }

    const questionTypeIcons = {
        "multiple_choice": <CheckCircle className="h-4 w-4 mr-2" />,
        "multiple_response": <CheckCircle className="h-4 w-4 mr-2" />,
        "true_false": <XCircle className="h-4 w-4 mr-2" />,
        "text_answer": <AlignLeft className="h-4 w-4 mr-2" />
    };

    const questionTypeLabels = {
        "multiple_choice": "Single Choice",
        "multiple_response": "Multiple Choice",
        "true_false": "True/False",
        "text_answer": "Text Answer"
    };

    return (
        <div className="container mx-auto py-4">
            <div className="flex justify-between items-center mb-4 bg-card p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/collections/${collection.id}`)}
                        className="mr-2"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{collection.title}</h1>
                        <p className="text-sm text-muted-foreground">
                            {currentActivity ? `Editing: ${currentActivity.title}` : "Edit Collection"}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Share collection with others</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                        <Monitor className="mr-2 h-4 w-4" /> {previewMode ? "Edit Mode" : "Preview"}
                    </Button>

                    <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-none">
                        <Save className="mr-2 h-4 w-4" /> Save Collection
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-2">
                    <QuestionList
                        questions={questions}
                        activeQuestionIndex={activeQuestionIndex}
                        onQuestionSelect={setActiveQuestionIndex}
                        onAddQuestion={handleAddQuestion}
                        onDeleteQuestion={handleDeleteQuestion}
                    />
                </div>

                <div className="col-span-12 md:col-span-7">
                    {activeQuestion && (
                        <QuestionPreview
                            questions={questions}
                            activeQuestionIndex={activeQuestionIndex}
                            timeLimit={timeLimit}
                            backgroundImage={backgroundImage}
                            previewMode={previewMode}
                            onQuestionTextChange={handleQuestionTextChange}
                            onOptionChange={handleOptionChange}
                            onChangeQuestion={setActiveQuestionIndex}
                        />
                    )}
                </div>

                <div className="col-span-12 md:col-span-3">
                    <QuestionSettings
                        activeQuestion={activeQuestion}
                        activeQuestionIndex={activeQuestionIndex}
                        activeTab={activeTab}
                        timeLimit={timeLimit}
                        backgroundImage={backgroundImage}
                        questionTypeIcons={questionTypeIcons}
                        questionTypeLabels={questionTypeLabels}
                        onTabChange={setActiveTab}
                        onQuestionTypeChange={handleQuestionTypeChange}
                        onTimeLimitChange={setTimeLimit}
                        onBackgroundImageChange={(value) => setBackgroundImage(value)}
                        onClearBackground={() => setBackgroundImage("")}
                        onAddOption={handleAddOption}
                        onOptionChange={handleOptionChange}
                        onDeleteOption={handleDeleteOption}
                        onCorrectAnswerChange={handleCorrectAnswerChange}
                        onSlideContentChange={handleSlideContentChange}
                        onSlideImageChange={handleSlideImageChange}
                    />
                </div>
            </div>
        </div>
    );
}
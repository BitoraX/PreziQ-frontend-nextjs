import { v4 as uuidv4 } from "uuid";

// Collection types
export interface Collection {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

// Activity interface and types
export type ActivityType =
  | "multiple_choice"
  | "multiple_response"
  | "true_false"
  | "text_answer";

export interface Activity {
  id: string;
  collection_id: string;
  title: string;
  description: string;
  type: ActivityType;
  is_published: boolean;
  activity_type_id?: string;
  options: {
    option_text: string;
    is_correct: boolean;
    display_order: number;
  }[];
  correct_answer_text?: string;
  slide_content?: string;
  slide_image?: string;
  time_limit?: number;
  explanation?: string;
  created_at: string;
  updated_at: string;
}

// Mock collections data
export let MOCK_COLLECTIONS = [
  {
    id: "col-1",
    title: "Frontend Development Masterclass",
    description: "Comprehensive guide to modern frontend technologies",
    coverImage:
      "https://www.downgraf.com/wp-content/uploads/2016/07/Cute-Minions-Wallpapers-Collection-001.jpg",
    is_published: true,
    created_at: "2023-10-15T08:30:00Z",
    updated_at: "2023-10-20T14:15:00Z",
    owner_id: "user-1",
  },
  {
    id: "col-2",
    title: "Backend Development Essentials",
    description: "Learn about databases, APIs, and server-side logic",
    coverImage:
      "https://www.downgraf.com/wp-content/uploads/2016/07/Cute-Minions-Wallpapers-Collection-001.jpg",
    is_published: true,
    created_at: "2023-10-18T12:00:00Z",
    updated_at: "2023-10-22T10:00:00Z",
    owner_id: "user-2",
  },
  {
    id: "col-3",
    title: "Data Science with Python",
    description:
      "Master data analysis, visualization, and machine learning with Python",
    coverImage:
      "https://www.downgraf.com/wp-content/uploads/2016/07/Cute-Minions-Wallpapers-Collection-001.jpg",
    is_published: true,
    created_at: "2023-11-01T09:00:00Z",
    updated_at: "2023-11-05T16:00:00Z",
    owner_id: "user-3",
  },
];

// Mock activities data
export let MOCK_ACTIVITIES = [
  {
    id: "act-1",
    collection_id: "col-1",
    title: "Which of the following is not a JavaScript data type?",
    description: "Test your knowledge of JavaScript data types",
    type: "multiple_choice" as ActivityType,
    activity_type_id: "quiz",
    is_published: true,
    options: [
      { option_text: "String", is_correct: false, display_order: 0 },
      { option_text: "Boolean", is_correct: false, display_order: 1 },
      { option_text: "Integer", is_correct: true, display_order: 2 },
      { option_text: "Object", is_correct: false, display_order: 3 },
    ],
    time_limit: 30,
    explanation:
      "JavaScript has Number type instead of separate Integer and Float types.",
    created_at: "2023-10-16T09:00:00Z",
    updated_at: "2023-10-16T09:00:00Z",
  },
  {
    id: "act-4",
    collection_id: "col-1",
    title: "What is the purpose of CSS Flexbox?",
    description: "Learn about CSS layout techniques",
    type: "multiple_choice" as ActivityType,
    is_published: true,
    options: [
      {
        option_text: "To align items efficiently",
        is_correct: true,
        display_order: 0,
      },
      { option_text: "To define colors", is_correct: false, display_order: 1 },
    ],
    explanation:
      "CSS Flexbox is used to design flexible and responsive layouts.",
    created_at: "2023-10-17T10:00:00Z",
    updated_at: "2023-10-17T10:00:00Z",
  },
  {
    id: "act-5",
    collection_id: "col-1",
    title: "How does the DOM work in JavaScript?",
    description: "Understand the basics of the Document Object Model",
    type: "text_answer" as ActivityType,
    is_published: true,
    correct_answer_text:
      "The DOM represents the document as a tree of objects.",
    created_at: "2023-10-18T11:00:00Z",
    updated_at: "2023-10-18T11:00:00Z",
  },
  {
    id: "act-2",
    collection_id: "col-1", // Changed from col-2 to col-1
    title: "What is an API?",
    description: "Understand the fundamentals of APIs and how they work",
    type: "true_false" as ActivityType,
    activity_type_id: "quiz",
    is_published: true,
    options: [
      {
        option_text: "A tool for designing UI",
        is_correct: false,
        display_order: 0,
      },
      {
        option_text: "A way for applications to communicate",
        is_correct: true,
        display_order: 1,
      },
    ],
    explanation:
      "An API (Application Programming Interface) allows different systems to communicate.",
    created_at: "2023-10-18T14:30:00Z",
    updated_at: "2023-10-18T14:30:00Z",
  },
  {
    id: "act-6",
    collection_id: "col-1",
    title: "What does HTML stand for?",
    description: "Test your knowledge of web fundamentals",
    type: "multiple_choice" as ActivityType,
    is_published: true,
    options: [
      {
        option_text: "Hyper Text Markup Language",
        is_correct: true,
        display_order: 0,
      },
      {
        option_text: "High Tech Modern Language",
        is_correct: false,
        display_order: 1,
      },
      {
        option_text: "Hyper Transfer Markup Logic",
        is_correct: false,
        display_order: 2,
      },
    ],
    explanation:
      "HTML stands for Hyper Text Markup Language, the standard language for web pages.",
    created_at: "2023-10-19T09:00:00Z",
    updated_at: "2023-10-19T09:00:00Z",
  },
  {
    id: "act-7",
    collection_id: "col-1",
    title: "Is JavaScript case-sensitive?",
    description: "Learn about JavaScript syntax rules",
    type: "true_false" as ActivityType,
    is_published: true,
    options: [
      { option_text: "Yes", is_correct: true, display_order: 0 },
      { option_text: "No", is_correct: false, display_order: 1 },
    ],
    explanation:
      "JavaScript is case-sensitive, meaning 'variable' and 'Variable' are different.",
    created_at: "2023-10-20T10:00:00Z",
    updated_at: "2023-10-20T10:00:00Z",
  },
  {
    id: "act-8",
    collection_id: "col-1",
    title: "What is the use of 'console.log()' in JavaScript?",
    description: "Explore JavaScript debugging techniques",
    type: "multiple_choice" as ActivityType,
    is_published: true,
    options: [
      {
        option_text: "To output messages to the console",
        is_correct: true,
        display_order: 0,
      },
      {
        option_text: "To define a variable",
        is_correct: false,
        display_order: 1,
      },
      {
        option_text: "To create a loop",
        is_correct: false,
        display_order: 2,
      },
    ],
    explanation:
      "console.log() is used to print information to the console for debugging.",
    created_at: "2023-10-21T12:00:00Z",
    updated_at: "2023-10-21T12:00:00Z",
  },
  {
    id: "act-9",
    collection_id: "col-1",
    title: "What is a CSS selector?",
    description: "Understand how to target HTML elements with CSS",
    type: "text_answer",
    is_published: true,
    correct_answer_text:
      "A CSS selector is a pattern used to select elements to style.",
    created_at: "2023-10-22T14:00:00Z",
    updated_at: "2023-10-22T14:00:00Z",
  },
];
export const getCollectionById = (id: string): Collection | undefined => {
  return MOCK_COLLECTIONS.find((collection) => collection.id === id);
};

export const getActivitiesByCollectionId = (
  collectionId: string
): Activity[] => {
  return MOCK_ACTIVITIES.filter(
    (activity) => activity.collection_id === collectionId
  );
};

export const getActivityById = (id: string): Activity | undefined => {
  return MOCK_ACTIVITIES.find((activity) => activity.id === id);
};

// For compatibility with the existing editor code, we'll treat the activity itself as the question
// This transforms the activity into a question format expected by the editor
// For compatibility with the existing editor code, we'll map all activities in a collection to questions
export const getQuestionsByActivityId = (activityId: string): any[] => {
  // First get the activity to find its collection
  const activity = MOCK_ACTIVITIES.find((a) => a.id === activityId);
  if (!activity) return [];

  // Get the collection ID
  const collectionId = activity.collection_id;

  // Get all activities from this collection
  const activitiesInCollection = MOCK_ACTIVITIES.filter(
    (a) => a.collection_id === collectionId
  );

  // Map each activity to a question object
  return activitiesInCollection.map((activity) => ({
    activity_id: activity.id,
    question_text: activity.title,
    question_type: activity.type,
    options: activity.options || [],
    correct_answer_text: activity.correct_answer_text || "",
    slide_content: activity.slide_content || "",
    slide_image: activity.slide_image || "",
    explanation: activity.explanation || "",
  }));
};

// Save the question by updating the activity
// Save questions by updating the corresponding activities
export const saveQuestions = (activityId: string, questions: any[]): void => {
  // Find the initial activity to get its collection
  const initialActivity = MOCK_ACTIVITIES.find((a) => a.id === activityId);
  if (!initialActivity) return;

  // Process each question and update its corresponding activity
  questions.forEach((question) => {
    const activityIndex = MOCK_ACTIVITIES.findIndex(
      (a) => a.id === question.activity_id
    );
    if (activityIndex === -1) return;

    // Update the activity with the question data
    MOCK_ACTIVITIES[activityIndex] = {
      ...MOCK_ACTIVITIES[activityIndex],
      title: question.question_text || MOCK_ACTIVITIES[activityIndex].title,
      options: question.options || [],
      type: question.question_type || MOCK_ACTIVITIES[activityIndex].type,
      correct_answer_text: question.correct_answer_text,
      slide_content: question.slide_content,
      slide_image: question.slide_image,
      explanation: question.explanation,
      updated_at: new Date().toISOString(),
    };
  });
};

// Functions for creating/updating data
export const createCollection = (data: Partial<Collection>): Collection => {
  const newCollection: Collection = {
    id: uuidv4(),
    title: data.title || "Untitled Collection",
    description: data.description || "",
    coverImage:
      data.coverImage ||
      "https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80",
    is_published: data.is_published || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner_id: "user-1",
  };

  MOCK_COLLECTIONS.push(newCollection);
  return newCollection;
};

export const createActivity = (data: Partial<Activity>): Activity => {
  if (!data.collection_id) {
    throw new Error("Collection ID is required");
  }

  const newActivity: Activity = {
    id: uuidv4(),
    collection_id: data.collection_id,
    title: data.title || "Untitled Activity",
    description: data.description || "",
    type: data.type || "multiple_choice",
    activity_type_id: data.activity_type_id || "quiz",
    is_published: data.is_published || false,
    options: data.options || [],
    correct_answer_text: data.correct_answer_text || "",
    slide_content: data.slide_content || "",
    slide_image: data.slide_image || "",
    time_limit: data.time_limit || 30,
    explanation: data.explanation || "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  MOCK_ACTIVITIES.push(newActivity);
  return newActivity;
};

export const updateCollection = (
  id: string,
  data: Partial<Collection>
): Collection | undefined => {
  const index = MOCK_COLLECTIONS.findIndex((c) => c.id === id);
  if (index === -1) return undefined;

  MOCK_COLLECTIONS[index] = {
    ...MOCK_COLLECTIONS[index],
    ...data,
    updated_at: new Date().toISOString(),
  };

  return MOCK_COLLECTIONS[index];
};

export const updateActivity = (
  id: string,
  data: Partial<Activity>
): Activity | undefined => {
  const index = MOCK_ACTIVITIES.findIndex((a) => a.id === id);
  if (index === -1) return undefined;

  const updatedActivity: Activity = {
    ...MOCK_ACTIVITIES[index],
    ...data,
    updated_at: new Date().toISOString(),
  };

  MOCK_ACTIVITIES[index] = updatedActivity;
  return updatedActivity;
};

export const deleteCollection = (id: string): boolean => {
  const initialLength = MOCK_COLLECTIONS.length;
  MOCK_COLLECTIONS = MOCK_COLLECTIONS.filter((c) => c.id !== id);

  if (MOCK_COLLECTIONS.length === initialLength) {
    return false;
  }

  // Also delete all activities in this collection
  MOCK_ACTIVITIES = MOCK_ACTIVITIES.filter((a) => a.collection_id !== id);
  return true;
};

export const deleteActivity = (id: string): boolean => {
  const initialLength = MOCK_ACTIVITIES.length;
  MOCK_ACTIVITIES = MOCK_ACTIVITIES.filter((a) => a.id !== id);

  if (MOCK_ACTIVITIES.length === initialLength) {
    return false;
  }
  return true;
};

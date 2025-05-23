/**
 * Custom hook for managing slide operations
 */

import { useToast } from '@/hooks/use-toast';
import { activitiesApi } from '@/api-client';
import { Activity, QuizQuestion } from '../components/types';
import { slideBackgroundManager } from '@/utils/slideBackgroundManager'; 



export function useSlideOperations(
  questions: QuizQuestion[],
  setQuestions: (questions: QuizQuestion[]) => void,
  activeQuestionIndex: number,
  activity: Activity | null,
  timeLimit: number
) {
  /**
   * Handle slide content change for info slides
   */
  const handleSlideContentChange = async (value: string) => {
    if (!activity) return;

    // Update local state
    const updatedQuestions = [...questions];
    updatedQuestions[activeQuestionIndex] = {
      ...updatedQuestions[activeQuestionIndex],
      slide_content: value,
    };
    setQuestions(updatedQuestions);

    // For now, API doesn't fully support separate slide content updates
    // We'll implement this when the API supports it
    try {
      // Update the activity with the new content
      await activitiesApi.updateActivity(activity.id, {
        description: value,
      });


      console.log("Slide content updated");
    } catch (error) {
      console.error("Error updating slide content:", error);

    }
  };

  /**
   * Handle slide image change for info slides
   */
  const handleSlideImageChange = async (value: string) => {
    if (!activity) return;

    // Update local state
    const updatedQuestions = [...questions];
    updatedQuestions[activeQuestionIndex] = {
      ...updatedQuestions[activeQuestionIndex],
      slide_image: value,
    };
    setQuestions(updatedQuestions);

    // For now, API doesn't fully support separate slide image updates
    // We'll implement this when the API supports it
    slideBackgroundManager.set(activity.id, {
      backgroundImage: value,
      backgroundColor: '',
    });


    // 3. (OPTIONAL) emit event nếu bạn có listener khác
    window.dispatchEvent(
      new CustomEvent('activity:background:updated', {
        detail: {
          activityId: activity.id,
          properties: { backgroundImage: value },
        },
      })
    );

  };

  /**
   * Save all changes to the current activity
   */
  const handleSave = async () => {
    if (!activity) return;

    try {

      console.log("Saving your changes");


      // Most changes are already saved incrementally, but we can update the activity title, etc.
      await activitiesApi.updateActivity(activity.id, {
        title: activity.title,
        description: activity.description,
        isPublished: activity.is_published,
      });



      console.log("All changes saved successfully");
    } catch (error) {
      console.error("Error saving changes:", error);

    }
  };

  return {
    handleSlideContentChange,
    handleSlideImageChange,
    handleSave,
  };
}

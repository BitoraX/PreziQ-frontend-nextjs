// 1) Định nghĩa phần chung
interface BaseSlideElementPayload {
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  rotation: number;
  layerOrder: number;

  entryAnimation?: string | null;
  entryAnimationDuration?: number | null;
  entryAnimationDelay?: number | null;
  exitAnimation?: string | null;
  exitAnimationDuration?: number | null;
  exitAnimationDelay?: number | null;
}

export type SlideElementPayload = BaseSlideElementPayload &
  (
    | {
        slideElementType: 'TEXT';
        content: string;
        sourceUrl?: never;
      }
    | {
        slideElementType: 'IMAGE';
        sourceUrl: string;
        content?: never;
      }
  );

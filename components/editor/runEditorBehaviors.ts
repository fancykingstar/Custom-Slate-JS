import { Editor } from 'slate';

type BehaviorFunction = (editor: Editor, rootElementType: string[]) => boolean;

/**
 * Returns true at the first behavior that returns true. Returns false if
 * no behaviors succeed.
 *
 * Ideally, the order of behaviors should not affect the outcome.
 */
export default function runEditorBehaviors(
  editor: Editor,
  rootElementType: string[],
  behaviors: BehaviorFunction[]
): boolean {
  for (let i = 0; i < behaviors.length; i += 1) {
    if (behaviors[i](editor, rootElementType)) {
      return true;
    }
  }

  return false;
}

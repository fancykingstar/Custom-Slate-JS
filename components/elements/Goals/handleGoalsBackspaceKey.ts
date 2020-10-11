import { Editor, Range } from 'slate';

import { GoalsElementType } from 'components/elements/Goals/GoalsElementType';
import runEditorBehaviors from 'components/editor/runEditorBehaviors';
import clearGeneratedTextWhenEmpty from 'components/editor/behaviors/clearGeneratedTextWhenEmpty';
import clearGeneratedTextWhenIntersects from 'components/editor/behaviors/clearGeneratedTextWhenIntersects';
import unindentNestedListItemOnStart from 'components/editor/behaviors/unindentNestedListItemOnStart';
import mergeFromRootToPreviousLastListItem from 'components/editor/behaviors/mergeFromRootToPreviousLastListItem';
import mergeStartOfListItemWithSublistToPrevItem from 'components/editor/behaviors/mergeStartOfListItemWithSublistToPrevItem';
import nothingOnFirstListItemWithSublist from 'components/editor/behaviors/nothingOnFirstListItemWithSublist';
import nothingOnFrontOfNonemptyGeneratedText from 'components/editor/behaviors/nothingOnFrontOfNonemptyGeneratedText';
import exitListOnFirstOnlyEmptyRootListItem from 'components/editor/behaviors/exitListOnFirstOnlyEmptyRootListItem';
import exitListOnFinalEmptyRootListItem from 'components/editor/behaviors/exitListOnFinalEmptyRootListItem';
import exitListOnEmptyFirstListItemWithSiblings from 'components/editor/behaviors/exitListOnEmptyFirstListItemWithSiblings';

export default function handleGoalsBackspaceKey(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  const { selection } = editor;
  if (selection == null) {
    return false;
  }

  if (!Range.isCollapsed(selection)) {
    runEditorBehaviors(
      editor,
      [GoalsElementType.Wrapper],
      [clearGeneratedTextWhenIntersects]
    );
    return false;
  }

  if (
    runEditorBehaviors(
      editor,
      [GoalsElementType.Wrapper],
      [mergeFromRootToPreviousLastListItem]
    )
  ) {
    event.preventDefault();
    return true;
  }

  // Do nothing if we're not in the Goals tool
  const wrapperEntry = Editor.above(editor, {
    match: (n) => n.type === GoalsElementType.Wrapper,
  });
  if (wrapperEntry == null) {
    return false;
  }

  if (
    runEditorBehaviors(
      editor,
      [GoalsElementType.Wrapper],
      [
        clearGeneratedTextWhenEmpty,
        unindentNestedListItemOnStart,
        mergeStartOfListItemWithSublistToPrevItem,
        nothingOnFirstListItemWithSublist,
        nothingOnFrontOfNonemptyGeneratedText,
        exitListOnFirstOnlyEmptyRootListItem,
        exitListOnFinalEmptyRootListItem,
        exitListOnEmptyFirstListItemWithSiblings,
      ]
    )
  ) {
    event.preventDefault();
    return true;
  }

  return false;
}

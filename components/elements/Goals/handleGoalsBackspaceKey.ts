import { Editor, Range } from 'slate';
import { GoalsElement } from 'components/elements/Goals/GoalsElement';
import runEditorBehaviors from 'components/editor/runEditorBehaviors';
import unindentNestedListItemOnStart from 'components/editor/behaviors/unindentNestedListItemOnStart';
import mergeFromRootToPreviousLastListItem from 'components/editor/behaviors/mergeFromRootToPreviousLastListItem';
import mergeStartOfListItemWithSublistToPrevItem from 'components/editor/behaviors/mergeStartOfListItemWithSublistToPrevItem';
import nothingOnFirstListItemWithSublist from 'components/editor/behaviors/nothingOnFirstListItemWithSublist';
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
    return false;
  }

  if (
    runEditorBehaviors(
      editor,
      [GoalsElement.Wrapper],
      [mergeFromRootToPreviousLastListItem]
    )
  ) {
    event.preventDefault();
    return true;
  }

  // Do nothing if we're not in the Criteria tool
  const wrapperEntry = Editor.above(editor, {
    match: (n) => n.type === GoalsElement.Wrapper,
  });
  if (wrapperEntry == null) {
    return false;
  }

  if (
    runEditorBehaviors(
      editor,
      [GoalsElement.Wrapper],
      [
        unindentNestedListItemOnStart,
        mergeStartOfListItemWithSublistToPrevItem,
        nothingOnFirstListItemWithSublist,
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

import { Editor } from 'slate';
import { isRangeAtRoot } from 'components/editor/queries';
import { GoalsElement } from 'components/elements/Goals/GoalsElement';
import runEditorBehaviors from 'components/editor/runEditorBehaviors';
import unindentEmptyNestedListItem from 'components/editor/behaviors/unindentEmptyNestedListItem';
import exitListOnFirstOnlyEmptyRootListItem from 'components/editor/behaviors/exitListOnFirstOnlyEmptyRootListItem';
import exitListOnFinalEmptyRootListItem from 'components/editor/behaviors/exitListOnFinalEmptyRootListItem';
import addNewListItemAboveOnStartOfListItem from 'components/editor/behaviors/addNewListItemAboveOnStartOfListItem';
import addNewListItemBelowOnEndOfListItem from 'components/editor/behaviors/addNewListItemBelowOnEndOfListItem';
import splitListItemOnMiddleOfListItem from 'components/editor/behaviors/splitListItemOnMiddleOfListItem';

export default function handleGoalsEnterKey(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  const { selection } = editor;
  if (selection == null || isRangeAtRoot(selection)) {
    return false;
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
        unindentEmptyNestedListItem,
        exitListOnFirstOnlyEmptyRootListItem,
        exitListOnFinalEmptyRootListItem,
        addNewListItemAboveOnStartOfListItem,
        addNewListItemBelowOnEndOfListItem,
        splitListItemOnMiddleOfListItem,
      ]
    )
  ) {
    event.preventDefault();
    return true;
  }

  return false;
}

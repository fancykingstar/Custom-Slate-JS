import { Editor } from 'slate';
import { isRangeAtRoot } from 'components/editor/queries';
import { CriteriaElement } from 'components/elements/Criteria/CriteriaElement';
import unindentEmptyNestedListItem from 'components/editor/behaviors/unindentEmptyNestedListItem';
import exitListOnFirstOnlyEmptyRootListItem from 'components/editor/behaviors/exitListOnFirstOnlyEmptyRootListItem';
import exitListOnFinalEmptyRootListItem from 'components/editor/behaviors/exitListOnFinalEmptyRootListItem';
import addNewListItemAboveOnStartOfListItem from 'components/editor/behaviors/addNewListItemAboveOnStartOfListItem';
import addNewListItemBelowOnEndOfListItem from 'components/editor/behaviors/addNewListItemBelowOnEndOfListItem';
import splitListItemOnMiddleOfListItem from 'components/editor/behaviors/splitListItemOnMiddleOfListItem';
import runEditorBehaviors from 'components/editor/runEditorBehaviors';

export default function handleCriteriaEnterKey(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  const { selection } = editor;
  if (selection == null || isRangeAtRoot(selection)) {
    return false;
  }

  // Do nothing if we're not in the Criteria tool
  const wrapperEntry = Editor.above(editor, {
    match: (n) => n.type === CriteriaElement.Wrapper,
  });
  if (wrapperEntry == null) {
    return false;
  }

  if (
    runEditorBehaviors(
      editor,
      [CriteriaElement.Wrapper],
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

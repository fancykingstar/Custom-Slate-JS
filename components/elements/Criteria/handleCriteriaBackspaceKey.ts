import { Editor, Range } from 'slate';
import { CriteriaElement } from 'components/elements/Criteria/CriteriaElement';
import runEditorBehaviors from 'components/editor/runEditorBehaviors';
import unindentNestedListItemOnStart from 'components/editor/behaviors/unindentNestedListItemOnStart';
import mergeFromRootToPreviousLastListItem from 'components/editor/behaviors/mergeFromRootToPreviousLastListItem';
import mergeStartOfListItemWithSublistToPrevItem from 'components/editor/behaviors/mergeStartOfListItemWithSublistToPrevItem';
import nothingOnFirstListItemWithSublist from 'components/editor/behaviors/nothingOnFirstListItemWithSublist';
import exitListOnFinalEmptyRootListItem from 'components/editor/behaviors/exitListOnFinalEmptyRootListItem';
import exitListOnFirstOnlyEmptyRootListItem from 'components/editor/behaviors/exitListOnFirstOnlyEmptyRootListItem';
import exitListOnEmptyFirstListItemWithSiblings from 'components/editor/behaviors/exitListOnEmptyFirstListItemWithSiblings';

export default function handleCriteriaBackspaceKey(
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
      [CriteriaElement.Wrapper],
      [mergeFromRootToPreviousLastListItem]
    )
  ) {
    event.preventDefault();
    return true;
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

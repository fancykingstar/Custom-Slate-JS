import { Editor, Range } from 'slate';
import { InversionElement } from 'components/elements/Inversion/InversionElement';
import runEditorBehaviors from 'components/editor/runEditorBehaviors';
import mergeFromRootToPreviousLastListItem from 'components/editor/behaviors/mergeFromRootToPreviousLastListItem';
import mergeStartOfListItemWithSublistToPrevItem from 'components/editor/behaviors/mergeStartOfListItemWithSublistToPrevItem';
import nothingOnFirstListItemWithSublist from 'components/editor/behaviors/nothingOnFirstListItemWithSublist';
import exitListOnFirstOnlyEmptyRootListItem from 'components/editor/behaviors/exitListOnFirstOnlyEmptyRootListItem';
import exitListOnEmptyFirstListItemWithSiblings from 'components/editor/behaviors/exitListOnEmptyFirstListItemWithSiblings';
import mergeFromStartOfSublistToPrevItem from 'components/editor/behaviors/mergeFromStartOfSublistToPrevItem';

export default function handleInversionBackspaceKey(
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
      [InversionElement.Wrapper],
      [
        mergeFromStartOfSublistToPrevItem,
        mergeFromRootToPreviousLastListItem,
        mergeStartOfListItemWithSublistToPrevItem,
        nothingOnFirstListItemWithSublist,
        exitListOnFirstOnlyEmptyRootListItem,
        exitListOnEmptyFirstListItemWithSiblings,
      ]
    )
  ) {
    event.preventDefault();
    return true;
  }

  return false;
}

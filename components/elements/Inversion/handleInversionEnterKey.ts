import { Editor } from 'slate';
import { isRangeAtRoot } from 'components/editor/queries';
import { InversionElement } from 'components/elements/Inversion/InversionElement';
import runEditorBehaviors from 'components/editor/runEditorBehaviors';
import unindentEmptyNestedListItem from 'components/editor/behaviors/unindentEmptyNestedListItem';
import exitListOnFinalEmptyRootListItem from 'components/editor/behaviors/exitListOnFinalEmptyRootListItem';
import addNewListItemAboveOnStartOfListItem from 'components/editor/behaviors/addNewListItemAboveOnStartOfListItem';
import addNewListItemBelowOnEndOfListItem from 'components/editor/behaviors/addNewListItemBelowOnEndOfListItem';
import splitListItemOnMiddleOfListItem from 'components/editor/behaviors/splitListItemOnMiddleOfListItem';
import addNewListItemBelowOnFirstOnlyEmptyRootListItem from 'components/editor/behaviors/addNewListItemBelowOnFirstOnlyEmptyRootListItem';
import addNewSublistBelowOnEndOfListItem from 'components/editor/behaviors/addNewSublistBelowOnEndOfListItem';

export default function handleInversionEnterKey(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  const { selection } = editor;
  if (selection == null || isRangeAtRoot(selection)) {
    return false;
  }

  // Do nothing if we're not in the Criteria tool
  const wrapperEntry = Editor.above(editor, {
    match: (n) => n.type === InversionElement.Wrapper,
  });
  if (wrapperEntry == null) {
    return false;
  }

  if (
    runEditorBehaviors(
      editor,
      [InversionElement.Wrapper],
      [
        unindentEmptyNestedListItem,
        addNewListItemBelowOnFirstOnlyEmptyRootListItem,
        exitListOnFinalEmptyRootListItem,
        (behaviorEditor: Editor, rootElement: string[]) =>
          addNewSublistBelowOnEndOfListItem(
            behaviorEditor,
            rootElement,
            InversionElement.ItemSublist,
            InversionElement.ItemSublistItem,
            InversionElement.ItemSublistItemParagraph
          ),
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

import { useSlate, useSelected, useFocused, ReactEditor } from 'slate-react';
import { Editor, Element, Path, Range } from 'slate';
import styles from './InlinePlaceholder.module.scss';

interface Props {
  children: React.ReactNode;
  element: Element;
  // Optional children to render when node has no focus (and is empty)
  blurChildren?: React.ReactNode;
}

/**
 * Placeholder component for rendered Slate elements.
 *
 * Should be placed as a sibling after the `{children}` in a
 * Slate element component. Note that the parent component must
 * have its own stacking context (e.g., via `position: relative`)
 * in order to position the placeholder correctly.
 *
 * Ex:
 * ```
 * <p {...attributes}>
 *   {children}
 *   <InlinePlaceholder />
 * </p>
 * ```
 */
export default function InlinePlaceholder(props: Props): JSX.Element | null {
  // TODO: Fix inefficient use of `useSlate()`. Ideally, we would use `useEditor()`,
  //  but it doesn't cause a re-render when moving selection from a multi-line selection.
  const editor = useSlate();
  const selected = useSelected();
  const focused = useFocused();

  const { children, element, blurChildren } = props;

  // Render nothing if the user is not focused on this specific element
  const { selection } = editor;
  const isEmpty = Editor.isEmpty(editor, element);
  if (
    !selected ||
    !focused ||
    selection == null ||
    !Range.isCollapsed(selection)
  ) {
    // Render blur children if they exist
    if (isEmpty && blurChildren != null) {
      return (
        <span className={styles.placeholder} contentEditable={false}>
          {blurChildren}
        </span>
      );
    }

    return null;
  }

  // Render nothing if element has content
  if (!isEmpty) {
    return null;
  }

  const nodePath = ReactEditor.findPath(editor, element);
  const [, selectionPath] = Editor.node(editor, selection);
  const [, selectionParentPath] = Editor.parent(editor, selectionPath);

  // Double-check that the selection matches the node found
  if (!Path.equals(selectionParentPath, nodePath)) {
    return null;
  }

  if (children == null) {
    return null;
  }

  return (
    <span className={styles.placeholder} contentEditable={false}>
      {children}
    </span>
  );
}
import { useMemo } from 'react';
import { RenderElementProps, useSlate, ReactEditor } from 'slate-react';
import InlinePlaceholder from 'components/editor/InlinePlaceholder';
import { Node } from 'slate';
import AssistantPrompt from 'components/editor/AssistantPrompt';
import styles from './ParagraphElement.module.scss';

export default function ParagraphElement(
  props: RenderElementProps
): JSX.Element {
  // TODO: Fix inefficient use of `useSlate()`. Ideally, we would use `useEditor()`,
  //  but it doesn't cause a re-render when moving selection from a multi-line selection.
  const editor = useSlate();
  const { attributes, children, element } = props;

  const { selection } = editor;
  const nodes = editor.children;

  // Determine whether to show the 1st line blur placeholder
  const blurChildren = useMemo(() => {
    const firstBodyNode = nodes[1];
    const bodyIsEmpty =
      nodes.length <= 2 &&
      firstBodyNode != null &&
      !Node.string(firstBodyNode).length;

    if (bodyIsEmpty) {
      return 'An excellent decision awaits…';
    }

    return null;
  }, [selection, nodes]);

  // Show the placeholder only if it's a root p node
  const nodePath = ReactEditor.findPath(editor, element);
  const showPlaceholder = nodePath.length === 1;

  return (
    <p {...attributes} className={styles.p}>
      {children}
      {showPlaceholder ? (
        <InlinePlaceholder element={element} blurChildren={blurChildren}>
          <AssistantPrompt />
        </InlinePlaceholder>
      ) : null}
    </p>
  );
}

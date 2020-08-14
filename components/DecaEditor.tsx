// @refresh reset

import { useMemo, useState, useCallback, useRef } from 'react';
import { withHistory } from 'slate-history';
import { Slate, Editable, withReact, RenderLeafProps } from 'slate-react';
import { createEditor, Editor, Node, Range, Transforms, Path } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import Element, {
  BasicElement,
  ReservedElement,
} from 'components/elements/Element';
import withLayout from 'components/editor/withLayout';
import withVoids from 'components/editor/withVoids';
import withMarkdown from 'components/editor/withMarkdown';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';
import { isTopLevelPath } from 'components/editor/queries';
import withSimulationElement from 'components/elements/Simulation/withSimulationElement';
import AssistantContext, {
  AssistantAction,
} from 'components/editor/AssistantContext';
import handleAutoScroll from 'components/editor/handleAutoScroll';
import useConfirmExit from 'components/editor/useConfirmExit';
import useSlashMenu from 'components/editor/SlashMenu/useSlashMenu';
import SlashMenu from 'components/editor/SlashMenu/SlashMenu';
import Leaf from 'components/editor/Leaf';
import styles from './DecaEditor.module.scss';

export default function DecaEditor(): JSX.Element {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editor = useMemo(
    () =>
      withSimulationElement(
        withVoids(
          withMarkdown(withLayout(withHistory(withReact(createEditor()))))
        )
      ),
    []
  );
  const [value, setValue] = useState<Node[]>([
    {
      type: ReservedElement.Title,
      children: [{ text: '' }],
    },
    {
      type: BasicElement.Paragraph,
      children: [{ text: '' }],
    },
  ]);
  const [assistantActions, setAssistantActions] = useState<AssistantAction[]>(
    []
  );

  const [
    onChangeSlashMenu,
    onKeyDownSlashMenu,
    onAddTool,
    slashMenuPos,
    slashMenuContent,
    slashMenuIndex,
  ] = useSlashMenu(editor);

  useConfirmExit();

  const renderElement = useCallback((props) => <Element {...props} />, []);

  // NOTE: This is not memoized due to a Slate bug
  // See: https://github.com/ianstormtaylor/slate/issues/3447
  const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;

  const decorate = useCallback(
    (entry) => {
      const [node, path] = entry;
      const ranges: Range[] = [];

      const { selection } = editor;

      // Determine whether to highlight slash command text
      if (
        selection != null &&
        Range.isCollapsed(selection) &&
        Path.equals(selection.focus.path, path) &&
        slashMenuPos != null &&
        node.text != null &&
        path.length === 2
      ) {
        const match = node.text.match(/^\/(\w.*)?$/);
        if (match != null) {
          const range = {
            anchor: Editor.start(editor, path),
            focus: Editor.end(editor, path),
            slashHighlight: true,
          };
          ranges.push(range);
        }
      }

      return ranges;
    },
    [editor, slashMenuPos]
  );

  const onKeyDown = useCallback(
    (event) => {
      const { selection } = editor;
      onElementKeyDown(editor, event);
      onKeyDownSlashMenu(event);

      // Prevent creation of a new starter node from title when pressing enter
      if (
        isKeyHotkey(Keys.Enter, event) &&
        editor.children.length <= 2 &&
        selection != null &&
        Range.isCollapsed(selection)
      ) {
        const caretPoint = selection.anchor;
        const [caretLine] = caretPoint.path;
        if (caretLine === 0) {
          Transforms.select(editor, [1, 0]);
          event.preventDefault();
        }
      }

      // Execute assistant action only when at the beginning of the line.
      if (
        isKeyHotkey('mod+enter', event) &&
        selection != null &&
        Range.isCollapsed(selection) &&
        assistantActions.length
      ) {
        const [selectionStart] = Range.edges(selection);
        const [node] = Editor.node(editor, selectionStart);
        const [caretLine] = selection.anchor.path;

        if (
          caretLine > 0 &&
          !Node.string(node).length &&
          isTopLevelPath(selectionStart.path)
        ) {
          // TODO: Allow handling of multiple actions
          const action = assistantActions[0];
          if (action != null) {
            action(editor);
            event.preventDefault();
          }
        }
      }
    },
    [assistantActions, onElementKeyDown, onKeyDownSlashMenu]
  );

  const onChange = useCallback(
    (newValue) => {
      setValue(newValue);
      onChangeSlashMenu();
    },
    [setValue, onChangeSlashMenu]
  );

  const onSelect = useCallback(() => {
    handleAutoScroll(editor);
  }, [editor]);

  return (
    <AssistantContext.Provider
      value={{
        actions: assistantActions,
        setActions: setAssistantActions,
      }}
    >
      <div className={styles.wrapper} ref={wrapperRef}>
        <Slate editor={editor} value={value} onChange={onChange}>
          <Editable
            id="editor"
            autoFocus
            className={styles.editor}
            decorate={decorate}
            onKeyDown={onKeyDown}
            onSelect={onSelect}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
          />
          {slashMenuPos != null ? (
            <div
              className={styles.slashWrapper}
              style={{
                transform: `translate3d(${slashMenuPos[0] / 10}rem, ${
                  slashMenuPos[1] / 10
                }rem, 0)`,
              }}
            >
              <SlashMenu
                activeIndex={slashMenuIndex}
                content={slashMenuContent}
                onAddTool={onAddTool}
              />
            </div>
          ) : null}
        </Slate>
      </div>
    </AssistantContext.Provider>
  );
}

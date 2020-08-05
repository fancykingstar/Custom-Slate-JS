// @refresh reset

import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { withHistory } from 'slate-history';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { createEditor, Editor, Node, Range, Transforms } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import ClientOnlyPortal from 'components/ClientOnlyPortal';
import Element, {
  BasicElement,
  ReservedElement,
} from 'components/elements/Element';
import withLayout from 'components/editor/withLayout';
import withMarkdown from 'components/editor/withMarkdown';
import Assistant, { AssistantContent } from 'components/editor/Assistant';
import Placeholder from 'components/editor/Placeholder';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';
import insertChoicesTool from 'components/elements/Choices/insertChoicesTool';
import insertCriteriaTool from 'components/elements/Criteria/insertCriteriaTool';
import insertGoalsTool from 'components/elements/Goals/insertGoalsTool';
import SlashMenu, { MENU_ITEMS, MenuItem, SlashTitle } from './SlashMenu';
import styles from './DecaEditor.module.scss';

export interface SlashPoint {
  x: number;
  y: number;
}

export default function DecaEditor(): JSX.Element {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editor = useMemo(
    () => withMarkdown(withLayout(withHistory(withReact(createEditor())))),
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
  const renderElement = useCallback((props) => <Element {...props} />, []);

  const [assistantContent, setAssistantContent] = useState<JSX.Element[]>([
    AssistantContent.Default,
  ]);

  const pushAssistantContent = (newContent: JSX.Element) => {
    setAssistantContent((content) => {
      return [...content, newContent];
    });
  };

  const shiftAssistantContent = () => {
    setAssistantContent((content) => {
      if (content.length === 1) {
        return [AssistantContent.Default];
      }
      return content.slice(1);
    });
  };

  const [, setToolCount] = useState<number>(0);
  const incrementToolCount = () => {
    setToolCount((prev) => {
      const next = prev + 1;

      if (next === 1) {
        pushAssistantContent(AssistantContent.Eliminate);
      } else if (next === 2) {
        pushAssistantContent(AssistantContent.Nudge);
      }

      return next;
    });
  };

  const [slashRange, setSlashRange] = useState<Range | null>(null);
  const [slashPos, setSlashPos] = useState<SlashPoint | null>(null);
  const [slashIndex, setSlashIndex] = useState(0);

  const onAddTool = useCallback(
    (item: MenuItem) => {
      if (slashRange == null) {
        return;
      }

      Transforms.select(editor, slashRange);

      if (item.title === SlashTitle.Choices) {
        insertChoicesTool(editor);
        incrementToolCount();
      } else if (item.title === SlashTitle.Criteria) {
        insertCriteriaTool(editor);
        incrementToolCount();
      } else if (item.title === SlashTitle.Goals) {
        insertGoalsTool(editor);
        incrementToolCount();
      } else {
        Transforms.insertText(
          editor,
          `<FIXME: ${item.title} tool gets inserted here>`
        );
        incrementToolCount();
      }

      // Return focus to the editor (ex: when clicking on a slash menu item causes blur)
      ReactEditor.focus(editor);
      setSlashRange(null);
    },
    [editor, slashRange]
  );

  const onKeyDown = useCallback(
    (event) => {
      const { selection } = editor;
      onElementKeyDown(editor, event);

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

      if (slashRange == null) {
        return;
      }

      const availableMenuItems = MENU_ITEMS.filter(
        (item) => item.comingSoon == null
      );

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSlashIndex(
            slashIndex >= availableMenuItems.length - 1 ? 0 : slashIndex + 1
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSlashIndex(
            slashIndex <= 0 ? availableMenuItems.length - 1 : slashIndex - 1
          );
          break;
        case 'Tab':
        case 'Enter':
          event.preventDefault();
          onAddTool(availableMenuItems[slashIndex]);
          setSlashRange(null);
          break;
        case 'Escape':
          event.preventDefault();
          setSlashRange(null);
          break;
        default:
      }
    },
    [slashIndex, slashRange]
  );

  useEffect(() => {
    if (slashRange == null) {
      return;
    }

    const domRange = ReactEditor.toDOMRange(editor, slashRange);
    const rect = domRange.getBoundingClientRect();

    // TODO: Move slash menu on window resize
    setSlashPos({
      x: rect.left + window.pageXOffset,
      y: rect.top + window.pageYOffset + 24,
    });
  }, [slashRange]);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => {
          const { selection } = editor;
          setValue(newValue);

          // Close slash menu on editor blur
          if (selection == null || !Range.isCollapsed(selection)) {
            setSlashRange(null);
            return;
          }

          const caretPoint = selection.anchor;
          const [caretLine] = caretPoint.path;

          // Determine if slash should be available
          const [selectionStart] = Range.edges(selection);
          const [node] = Editor.node(editor, selectionStart);
          const slashAvailable =
            node.text === '/' && selectionStart.offset === 1;

          // Store selection range to calculate position of menu
          const lineStart = Editor.before(editor, selectionStart, {
            unit: 'line',
          });
          const lineRange =
            lineStart && Editor.range(editor, lineStart, selectionStart);

          // Open the slash menu if slash is the first and only char in a body line
          if (
            slashRange == null &&
            lineRange != null &&
            slashAvailable &&
            caretLine > 0
          ) {
            setSlashRange(lineRange);
            setSlashIndex(0);
            return;
          }

          // Otherwise, close the slash menu if it's open
          if (slashRange != null) {
            setSlashRange(null);
          }
        }}
      >
        <Placeholder />
        <Assistant
          wrapperRef={wrapperRef}
          content={assistantContent}
          pushContent={pushAssistantContent}
          shiftContent={shiftAssistantContent}
        />
        <Editable
          autoFocus
          className={styles.editor}
          onKeyDown={onKeyDown}
          renderElement={renderElement}
        />
        {slashRange != null && slashPos != null ? (
          <ClientOnlyPortal>
            <div
              className={styles.slashWrapper}
              style={{
                transform: `translate3d(${slashPos.x / 10}rem, ${
                  slashPos.y / 10
                }rem, 0)`,
              }}
            >
              <SlashMenu activeIndex={slashIndex} onAddTool={onAddTool} />
            </div>
          </ClientOnlyPortal>
        ) : null}
      </Slate>
    </div>
  );
}

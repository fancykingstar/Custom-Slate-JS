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
import withVoids from 'components/editor/withVoids';
import withMarkdown from 'components/editor/withMarkdown';
import Assistant, {
  AssistantContent,
  AssistantLine,
} from 'components/editor/Assistant';
import Placeholder from 'components/editor/Placeholder';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';
import insertCategorizerTool from 'components/elements/Categorizer/insertCategorizerTool';
import insertChoicesTool from 'components/elements/Choices/insertChoicesTool';
import insertGoalsTool from 'components/elements/Goals/insertGoalsTool';
import insertInversionTool from 'components/elements/Inversion/insertInversionTool';
import insertSimulationTool from 'components/elements/Simulation/insertSimulationTool';
import { isTopLevelPath } from 'components/editor/queries';
import withSimulationElement from 'components/elements/Simulation/withSimulationElement';
import SlashMenu, { MENU_ITEMS, MenuItem, SlashTitle } from './SlashMenu';
import styles from './DecaEditor.module.scss';

export interface SlashPoint {
  x: number;
  y: number;
}

export default function DecaEditor(): JSX.Element {
  // Prevent the user from accidentally closing or refreshing the prototype.
  useEffect(() => {
    function beforeUnload(event: BeforeUnloadEvent) {
      // Cancel the event as stated by the standard.
      event.preventDefault();
      // Chrome requires returnValue to be set.
      // eslint-disable-next-line no-param-reassign
      event.returnValue = '';
    }

    window.addEventListener('beforeunload', beforeUnload);

    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, []);

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
  const renderElement = useCallback((props) => <Element {...props} />, []);

  const [assistantLines, setAssistantLines] = useState<AssistantLine[]>([
    {
      content: AssistantContent.Default,
      action: null,
    },
  ]);

  const pushAssistantLine = (line: AssistantLine) => {
    setAssistantLines((lines) => {
      return [...lines, line];
    });
  };

  const shiftAssistantLine = () => {
    setAssistantLines((lines) => {
      if (lines.length === 1) {
        return [
          {
            content: AssistantContent.Default,
            action: null,
          },
        ];
      }

      return lines.slice(1);
    });
  };

  const [, setToolCount] = useState<number>(0);
  const incrementToolCount = () => {
    setToolCount((prev) => {
      const next = prev + 1;

      if (next === 1) {
        pushAssistantLine({
          content: AssistantContent.Eliminate,
          action: null,
        });
      } else if (next === 2) {
        pushAssistantLine({
          content: AssistantContent.Nudge,
          action: null,
        });
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

      if (item.title === SlashTitle.Categorizer) {
        insertCategorizerTool(editor);
      } else if (item.title === SlashTitle.Choices) {
        insertChoicesTool(editor);
        pushAssistantLine({
          content: AssistantContent.Goals,
          action: (e: Editor) => {
            insertGoalsTool(e);
          },
        });
      } else if (item.title === SlashTitle.Goals) {
        insertGoalsTool(editor);
      } else if (item.title === SlashTitle.Inversion) {
        insertInversionTool(editor);
      } else if (item.title === SlashTitle.Simulation) {
        insertSimulationTool(editor);
      } else {
        Transforms.insertText(
          editor,
          `<FIXME: ${item.title} tool gets inserted here>`
        );
      }

      incrementToolCount();

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

      // Execute assistant action only when at the beginning of the line.
      if (
        isKeyHotkey('mod+enter', event) &&
        selection != null &&
        Range.isCollapsed(selection)
      ) {
        const [selectionStart] = Range.edges(selection);
        const [node] = Editor.node(editor, selectionStart);
        const [caretLine] = selection.anchor.path;

        if (
          caretLine > 0 &&
          node.text === '' &&
          isTopLevelPath(selectionStart.path)
        ) {
          const { action } = assistantLines[0];
          if (action != null) {
            action(editor);
            event.preventDefault();
            return;
          }
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
    [assistantLines, slashIndex, slashRange]
  );

  const onChange = useCallback(
    (newValue) => {
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
        node.text === '/' &&
        selectionStart.offset === 1 &&
        isTopLevelPath(caretPoint.path);

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
    },
    [editor, slashRange, setSlashRange, setSlashIndex]
  );

  const onSelect = useCallback(() => {
    // Handle autoscrolling
    // - Via https://github.com/ianstormtaylor/slate/issues/3750#issuecomment-657783206
    // - Modified to change the element that's scrolled into view to ensure it isn't off-screen
    if (!(window.chrome || typeof InstallTrigger !== 'undefined')) {
      return;
    }

    // Do nothing if there is no selection (or if it's a multi-line selection, which
    // automatically scrolls already)
    if (editor.selection == null || !Range.isCollapsed(editor.selection)) {
      return;
    }

    try {
      const domPoint = ReactEditor.toDOMPoint(editor, editor.selection.focus);
      const [node] = domPoint;
      if (node == null) {
        return;
      }

      const element = node.parentElement;
      if (element == null) {
        return;
      }

      // Closest node that's a direct child of the editor (hacky and non-performant?)
      const rootElement = element.closest('#editor > *');
      if (rootElement == null) {
        return;
      }

      rootElement.scrollIntoView({
        block: 'nearest',
        inline: 'start',
      });
    } catch (e) {
      // No-op
    }
  }, [editor]);

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
      <Slate editor={editor} value={value} onChange={onChange}>
        <Placeholder />
        <Assistant
          wrapperRef={wrapperRef}
          lines={assistantLines}
          pushLine={pushAssistantLine}
          shiftLine={shiftAssistantLine}
        />
        <Editable
          id="editor"
          autoFocus
          className={styles.editor}
          onKeyDown={onKeyDown}
          onSelect={onSelect}
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

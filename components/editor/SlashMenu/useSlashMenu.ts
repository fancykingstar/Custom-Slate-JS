import { useEffect, useState, useCallback, useMemo } from 'react';
import { Range, Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import insertCategorizerTool from 'components/elements/Categorizer/insertCategorizerTool';
import insertChoicesTool from 'components/elements/Choices/insertChoicesTool';
import insertGoalsTool from 'components/elements/Goals/insertGoalsTool';
import insertInversionTool from 'components/elements/Inversion/insertInversionTool';
import insertSimulationTool from 'components/elements/Simulation/insertSimulationTool';
import insertProConTool from 'components/elements/ProCon/insertProConTool';
import getMenuContent, {
  MenuItem,
  SlashMenuContent,
  MenuItemTitle,
} from 'components/editor/SlashMenu/getMenuContent';

type onChangeFn = () => void;
type onKeyDownFn = (event: KeyboardEvent) => void;
type onAddTool = (item: MenuItem) => void;
type Pos = [number, number] | null;
type Index = number;

export default function useSlashMenu(
  editor: ReactEditor
): [onChangeFn, onKeyDownFn, onAddTool, Pos, SlashMenuContent, Index] {
  const [range, setRange] = useState<Range | null>(null);
  const [pos, setPos] = useState<Pos>(null);
  const [query, setQuery] = useState<string | null>(null);
  const [index, setIndex] = useState(0);

  const content: SlashMenuContent = useMemo(() => getMenuContent(query), [
    query,
  ]);

  /**
   * Recalculate the position of the slash menu whenever the range changes
   */
  useEffect(() => {
    if (range == null) {
      if (pos != null) {
        setPos(null);
      }
      return;
    }

    const domRange = ReactEditor.toDOMRange(editor, range);
    const rangeRect = domRange.getBoundingClientRect();

    const editorElement = ReactEditor.toDOMNode(editor, editor);
    const editorRect = editorElement.getBoundingClientRect();

    setPos([
      rangeRect.left - editorRect.left,
      rangeRect.top - editorRect.top + 24,
    ]);
  }, [range, setPos]);

  const onAddTool = useCallback(
    (item: MenuItem) => {
      if (range == null) {
        return;
      }

      Transforms.select(editor, range);

      if (item.title === MenuItemTitle.Categorizer) {
        insertCategorizerTool(editor);
      } else if (item.title === MenuItemTitle.Choices) {
        insertChoicesTool(editor);
      } else if (item.title === MenuItemTitle.Goals) {
        insertGoalsTool(editor);
      } else if (item.title === MenuItemTitle.Inversion) {
        insertInversionTool(editor);
      } else if (item.title === MenuItemTitle.Simulation) {
        insertSimulationTool(editor);
      } else if (item.title === MenuItemTitle.ProsCons) {
        insertProConTool(editor);
      } else {
        Transforms.insertText(
          editor,
          `<FIXME: ${item.title} tool gets inserted here>`
        );
      }

      // Return focus to the editor (ex: when clicking on a slash menu item causes blur)
      ReactEditor.focus(editor);
      setRange(null);
    },
    [editor, range, setRange]
  );

  /**
   * Listen to document changes to identify slash commands.
   */
  const onChange = useCallback(() => {
    const { selection } = editor;
    if (selection == null || !Range.isCollapsed(selection)) {
      return;
    }

    const [startOfSelection] = Range.edges(selection);
    const [caretLine] = startOfSelection.path;
    // Ignore first line and non-root nodes
    if (caretLine === 0 || startOfSelection.path.length !== 2) {
      setRange(null);
      return;
    }

    // Get the content of the current line
    const lineText = Editor.string(editor, startOfSelection.path);

    // Get the current word closest to the start of the selection
    const lineStart = {
      path: startOfSelection.path,
      offset: 0,
    };
    const lineEnd = Editor.end(editor, selection);

    // Get the range for the entire line
    const lineRange = Editor.range(editor, lineStart, lineEnd);

    // Look for empty slash OR slash with immediate character after
    const lineMatch = lineText.match(/^\/(\w.*)?$/);

    if (lineMatch == null) {
      setRange(null);
      return;
    }

    // TODO: Test how a small (<200ms) debounce feels compared to instant search
    setQuery(lineMatch[1] ?? '');

    // Reset the menu cursor index
    setIndex(0);
    // Update the range to cause a recalculation of the menu position
    setRange(lineRange);
  }, [editor, setIndex, setRange, setQuery]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (range == null) {
        return;
      }

      const availableMenuItems = content.items.filter(
        (item) => item.comingSoon == null
      );

      switch (event.key) {
        case 'ArrowDown':
          setIndex(index >= availableMenuItems.length - 1 ? 0 : index + 1);
          event.preventDefault();
          break;
        case 'ArrowUp':
          setIndex(index <= 0 ? availableMenuItems.length - 1 : index - 1);
          event.preventDefault();
          break;
        case 'Tab':
        case 'Enter':
          if (availableMenuItems.length) {
            onAddTool(availableMenuItems[index]);
            event.preventDefault();
          }
          setRange(null);
          break;
        case 'Escape':
          setRange(null);
          event.preventDefault();
          break;
        default:
      }
    },
    [range, setRange, index, setIndex, content]
  );

  return [onChange, onKeyDown, onAddTool, pos, content, index];
}

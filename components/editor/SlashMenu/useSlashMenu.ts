import { useEffect, useState, useCallback } from 'react';
import { Range, Editor, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import fuzzy from 'fuzzy';
import insertCategorizerTool from 'components/elements/Categorizer/insertCategorizerTool';
import insertChoicesTool from 'components/elements/Choices/insertChoicesTool';
import insertGoalsTool from 'components/elements/Goals/insertGoalsTool';
import insertInversionTool from 'components/elements/Inversion/insertInversionTool';
import insertSimulationTool from 'components/elements/Simulation/insertSimulationTool';
import insertProConTool from 'components/elements/ProCon/insertProConTool';

enum Category {
  Planning = 'Planning',
  Thinking = 'Thinking',
  Comparing = 'Comparing',
}

export interface MenuItem {
  category: Category;
  title: string;
  description: string;
  icon: string;
  keywords: string[];
  comingSoon?: boolean;
}

export enum MenuItemTitle {
  Categorizer = 'Categorizer',
  Choices = 'Choices',
  Comparison = 'Comparison of Choices',
  Goals = 'Goals',
  Inversion = 'Inversion',
  ProsCons = 'Pros / Cons',
  Simulation = 'Simulation Thinking',
}

export const slashMenuItems: MenuItem[] = [
  {
    category: Category.Planning,
    title: MenuItemTitle.Choices,
    description: 'What are my options?',
    icon: '🌈',
    keywords: [],
  },
  {
    category: Category.Planning,
    title: MenuItemTitle.Goals,
    description: "What's the point?",
    icon: '⭐️',
    keywords: ['criteria'],
  },
  {
    category: Category.Planning,
    title: MenuItemTitle.Categorizer,
    description: 'Know how to treat this decision',
    icon: '🍎',
    keywords: ['type'],
  },
  {
    category: Category.Thinking,
    title: MenuItemTitle.Inversion,
    description: 'Flip your point of view',
    icon: '⏳',
    keywords: [],
  },
  {
    category: Category.Thinking,
    title: MenuItemTitle.Simulation,
    description: 'Predict the future you want',
    icon: '🧠',
    keywords: ['2nd Order Thinking'],
  },
  {
    category: Category.Comparing,
    title: MenuItemTitle.ProsCons,
    description: 'Simply compare each choice',
    keywords: [],
    icon: '🧾',
  },
  {
    category: Category.Comparing,
    title: MenuItemTitle.Comparison,
    description: 'Compare choices by criteria',
    icon: '🛒',
    keywords: ['Comparison Table'],
    comingSoon: true,
  },
];

type onChangeFn = () => void;
type onKeyDownFn = (event: KeyboardEvent) => void;
type onAddTool = (item: MenuItem) => void;
type Pos = [number, number] | null;
type Items = MenuItem[];
type Index = number;

export default function useSlashMenu(
  editor: ReactEditor
): [onChangeFn, onKeyDownFn, onAddTool, Pos, Items, Index] {
  const [range, setRange] = useState<Range | null>(null);
  const [pos, setPos] = useState<Pos>(null);
  const [items, setItems] = useState(slashMenuItems);
  const [index, setIndex] = useState(0);

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

    // Get the current word closest to the start of the selection
    const wordStart = Editor.before(editor, startOfSelection, {
      unit: 'word',
    });

    // Go back one offset (to try to capture the slash character)
    let wordStartWithOffset = wordStart && Editor.before(editor, wordStart);

    // If we moved to the previous line, swap to the previous start
    if (
      wordStartWithOffset &&
      Path.isBefore(wordStartWithOffset.path, startOfSelection.path)
    ) {
      wordStartWithOffset = wordStart;
    }

    // Get the text and see if it matches the expected slash command format
    const beforeRange =
      wordStartWithOffset &&
      Editor.range(editor, wordStartWithOffset, startOfSelection);

    const beforeText = beforeRange && Editor.string(editor, beforeRange);
    const beforeMatch = beforeText && beforeText.match(/^\/(\w*)$/);

    // Ensure there's an empty space or nothing after the command
    const after = Editor.after(editor, startOfSelection);
    const afterRange = Editor.range(editor, startOfSelection, after);
    const afterText = Editor.string(editor, afterRange);
    const afterMatch = afterText.match(/^(\s|$)/);

    if (
      // Prevent slash menu after start of line
      wordStartWithOffset?.offset === 0 &&
      // Limit slash menu to root level
      startOfSelection.path.length === 2 &&
      caretLine > 0 &&
      beforeRange &&
      beforeMatch &&
      afterMatch
    ) {
      setIndex(0);

      // Filter available items by the query
      const query = beforeMatch[1];
      const filteredItems = fuzzy
        .filter(query, slashMenuItems, {
          extract: (item) =>
            [
              item.title,
              item.description,
              item.category,
              item.keywords.join(' '),
            ].join(' '),
        })
        .map((item) => item.original)
        // Group items by category — not the best user experience, but
        // the first item is always the best match still
        .reduce((storage: MenuItem[][], item) => {
          const { category } = item;

          const storageCategory = storage.find(
            (storedCategory) => storedCategory[0].category === category
          );

          if (storageCategory == null) {
            storage.push([item]);
          } else {
            storageCategory.push(item);
          }

          return storage;
        }, [])
        .flat();

      setItems(filteredItems);

      // Update the range to cause a recalculation of the menu position
      setRange(beforeRange);
      return;
    }

    setRange(null);
  }, [editor, setIndex, setRange, setItems]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (range == null) {
        return;
      }

      const availableMenuItems = items.filter(
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
          onAddTool(availableMenuItems[index]);
          setRange(null);
          event.preventDefault();
          break;
        case 'Escape':
          setRange(null);
          event.preventDefault();
          break;
        default:
      }
    },
    [range, setRange, index, setIndex, items]
  );

  return [onChange, onKeyDown, onAddTool, pos, items, index];
}
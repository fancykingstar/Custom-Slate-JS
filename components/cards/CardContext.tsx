import {
  createContext,
  useMemo,
  useState,
  useCallback,
  useContext,
} from 'react';
import { useEditor, ReactEditor } from 'slate-react';
import { ChoicesElement } from 'components/elements/Choices/ChoicesElement';
import { GoalsElement } from 'components/elements/Goals/GoalsElement';
import { Node, Editor, Transforms, Range } from 'slate';
import { CategorizerElement } from 'components/elements/Categorizer/CategorizerElement';
import { InversionElement } from 'components/elements/Inversion/InversionElement';
import { SimulationElement } from 'components/elements/Simulation/SimulationElement';
import { BasicElement } from 'components/elements/Element';
import insertChoicesTool from 'components/elements/Choices/insertChoicesTool';
import insertCategorizerTool from 'components/elements/Categorizer/insertCategorizerTool';
import insertGoalsTool from 'components/elements/Goals/insertGoalsTool';
import insertInversionTool from 'components/elements/Inversion/insertInversionTool';
import insertSimulationTool from 'components/elements/Simulation/insertSimulationTool';
import { WidgetContext, WidgetType } from 'components/widgets/WidgetContext';
import { v4 as uuidv4 } from 'uuid';
import { differenceInMinutes } from 'date-fns';

const HandCardLimit = 3;

export enum CardId {
  ToolCategorizer,
  ToolChoices,
  ToolChoicesTimer,
  ToolGoals,
  ToolGoalsTimer,
  ToolInversion,
  ToolInversionTimer,
  ToolSimulation,
  ToolSimulationTimer,
  ToolProsCons,
}

export interface Card {
  id: CardId;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const CardContext = createContext({
  cards: [] as Card[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cardAction: (cardId: CardId) => {
    // No-op
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeCard: (cardId: CardId) => {
    // No-op
  },
});

const cardData = {
  [CardId.ToolCategorizer]: {
    id: CardId.ToolCategorizer,
    icon: '🍎',
    title: 'Add the Categorizer Tool',
    description: 'Find the best plan for this decision',
  },
  [CardId.ToolChoices]: {
    id: CardId.ToolChoices,
    icon: '🌈',
    title: 'Add the Choices Tool',
    description: 'List options you might pick from',
  },
  [CardId.ToolChoicesTimer]: {
    id: CardId.ToolChoicesTimer,
    icon: '⏱ 🌈',
    title: 'Focus 2 min on the Choices Tool',
    description: 'Do a mini-brainstorm for new options',
  },
  [CardId.ToolGoals]: {
    id: CardId.ToolGoals,
    icon: '🎯️',
    title: 'Add the Goals Tool',
    description: "Figure out what's most important",
  },
  [CardId.ToolGoalsTimer]: {
    id: CardId.ToolGoalsTimer,
    icon: '⏱ 🎯️',
    title: 'Focus 2 min on the Goals Tool',
    description: 'Go one level deeper with your goals',
  },
  [CardId.ToolInversion]: {
    id: CardId.ToolInversion,
    icon: '⌛️',
    title: 'Add the Inversion Tool',
    description: 'Flip your point of view',
  },
  [CardId.ToolInversionTimer]: {
    id: CardId.ToolInversionTimer,
    icon: '⏱ ⌛️',
    title: 'Spend 5 min on the Inversion Tool',
    description: 'Grow your mental model with new perspectives',
  },
  [CardId.ToolSimulation]: {
    id: CardId.ToolSimulation,
    icon: '🧠',
    title: 'Add the Simulation Tool',
    description: 'Explore and compare different outcomes',
  },
  [CardId.ToolSimulationTimer]: {
    id: CardId.ToolSimulationTimer,
    icon: '⏱ 🧠',
    title: 'Spend 5 min on the Simulation Tool',
    description: 'List more probable outcomes',
  },
  [CardId.ToolProsCons]: {
    id: CardId.ToolProsCons,
    icon: '✅',
    title: 'Add the Pros / Cons Tool',
    description: 'Simply compare your choices',
  },
};

// 2nd value is a score
type PoolItem = [Card, number];

function genHand(nodes: Node[], usedCardIds: Set<CardId>): Card[] {
  const pool: PoolItem[] = [];

  // Insert: Categorizer Tool
  const categorizerTool = nodes.find(
    (node) => node.type === CategorizerElement.Wrapper
  );
  if (categorizerTool == null) {
    pool.push([cardData[CardId.ToolCategorizer], 1]);
  }

  // Insert: Choice Tool
  const choiceTool = nodes.find((node) => node.type === ChoicesElement.Wrapper);
  if (choiceTool == null) {
    pool.push([cardData[CardId.ToolChoices], 1]);
  }

  // Insert: Goals Tool
  const goalsTool = nodes.find((node) => node.type === GoalsElement.Wrapper);
  if (goalsTool == null) {
    pool.push([cardData[CardId.ToolGoals], 1]);
  }

  // Insert: Inversion Tool
  const inversionTool = nodes.find(
    (node) => node.type === InversionElement.Wrapper
  );
  if (inversionTool == null) {
    pool.push([cardData[CardId.ToolInversion], 0.5]);
  }

  // Insert: Simulation Tool
  const simulationTool = nodes.find(
    (node) => node.type === SimulationElement.Tool
  );
  if (simulationTool == null) {
    pool.push([cardData[CardId.ToolSimulation], 0.5]);
  }

  // Insert: Choices Timer
  if (choiceTool != null) {
    let score = 0.3;

    // Double priority if 5 min have elapsed
    const choiceTimestamp = choiceTool.timestamp;
    if (choiceTimestamp != null && choiceTimestamp instanceof Date) {
      const timeElapsed = differenceInMinutes(Date.now(), choiceTimestamp);

      if (timeElapsed > 5) {
        score *= 2;
      }
    }

    const choiceCount = (choiceTool.children as Node[]).length;
    if (choiceCount < 3) {
      pool.push([cardData[CardId.ToolChoicesTimer], score]);
    }
  }

  // Insert: Goals Timer
  if (goalsTool != null) {
    let score = 0.3;

    // Double priority if 5 min have elapsed
    const choiceTimestamp = goalsTool.timestamp;
    if (choiceTimestamp != null && choiceTimestamp instanceof Date) {
      const timeElapsed = differenceInMinutes(Date.now(), choiceTimestamp);

      if (timeElapsed > 5) {
        score *= 2;
      }
    }

    const goalCount = (goalsTool.children as Node[]).length;
    if (goalCount < 3) {
      pool.push([cardData[CardId.ToolGoalsTimer], score]);
    }
  }

  // Insert: Inversion Timer
  if (inversionTool != null) {
    let score = 0.3;

    // Double priority if 10 min have elapsed
    const choiceTimestamp = inversionTool.timestamp;
    if (choiceTimestamp != null && choiceTimestamp instanceof Date) {
      const timeElapsed = differenceInMinutes(Date.now(), choiceTimestamp);

      if (timeElapsed > 10) {
        score *= 2;
      }
    }

    pool.push([cardData[CardId.ToolInversionTimer], score]);
  }

  // Insert: Simulation Timer
  if (simulationTool != null) {
    let score = 0.3;

    // Double priority if 10 min have elapsed
    const choiceTimestamp = simulationTool.timestamp;
    if (choiceTimestamp != null && choiceTimestamp instanceof Date) {
      const timeElapsed = differenceInMinutes(Date.now(), choiceTimestamp);

      if (timeElapsed > 10) {
        score *= 2;
      }
    }

    pool.push([cardData[CardId.ToolSimulationTimer], score]);
  }

  // Insert: Pros / Cons Tool
  // N/A -> Not an official tool so we can't detect it

  return (
    pool
      // Filter out cards that were already used
      .filter(([card]) => !usedCardIds.has(card.id))
      // Order pool by score
      .sort(([, aScore], [, bScore]) => bScore - aScore)
      // Limit to three cards
      .slice(0, HandCardLimit)
      .map(([card]) => card)
  );
}

/**
 * Hacky way to make a paragraph node available so that we can use the same insert
 * functions as the slash menu.
 */
function prepareForAddTool(editor: Editor): void {
  const { children } = editor;

  let path = [children.length];

  const lastRootPath = [children.length - 1];
  const [lastRootNode] = Editor.node(editor, lastRootPath);
  const lastRootNodeIsEmptyParagraph =
    !Editor.string(editor, lastRootPath).length &&
    lastRootNode.type === BasicElement.Paragraph;

  // Create new last node
  if (lastRootNodeIsEmptyParagraph) {
    Transforms.delete(editor, {
      at: lastRootPath,
    });
    path = lastRootPath;
  }

  Transforms.insertNodes(
    editor,
    {
      type: BasicElement.Paragraph,
      children: [{ text: '' }],
    },
    {
      at: path,
    }
  );

  Transforms.select(editor, path.concat([0]));
}

function selectTool(editor: ReactEditor, nodeType: string): void {
  const nodes = editor.children;
  const choicesTool = nodes.find((node) => node.type === nodeType);

  const { selection } = editor;

  if (choicesTool != null) {
    const path = ReactEditor.findPath(editor, choicesTool);

    // Do nothing if we're already focused on the choices tool
    if (selection != null && Range.includes(selection, path)) {
      return;
    }

    Transforms.select(editor, {
      path: path.concat([0, 0]),
      offset: 0,
    });
  }
}

interface Props {
  children: React.ReactNode;
}

export default function CardHandler(props: Props): JSX.Element {
  const editor = useEditor();
  const { addWidget } = useContext(WidgetContext);

  const [usedCardIds, setUsedCardIds] = useState(new Set<CardId>());

  const nodes = editor.children;
  const hand = useMemo(() => genHand(nodes, usedCardIds), [nodes, usedCardIds]);

  const removeCard = (cardId: CardId) => {
    setUsedCardIds((ids) => new Set(ids).add(cardId));
  };

  const cardAction = useCallback(
    (cardId: CardId): void => {
      const cardIndex = hand.findIndex((card) => card.id === cardId);
      if (cardIndex < 0) {
        // eslint-disable-next-line no-console
        console.warn("Tried to play card that isn't in user hand.");
        return;
      }

      // Take action
      const card = cardData[cardId];
      switch (card.id) {
        case CardId.ToolCategorizer:
          prepareForAddTool(editor);
          insertCategorizerTool(editor);
          ReactEditor.focus(editor);
          break;
        case CardId.ToolChoices:
          prepareForAddTool(editor);
          insertChoicesTool(editor);
          ReactEditor.focus(editor);
          break;
        case CardId.ToolGoals:
          prepareForAddTool(editor);
          insertGoalsTool(editor);
          ReactEditor.focus(editor);
          break;
        case CardId.ToolInversion:
          prepareForAddTool(editor);
          insertInversionTool(editor);
          ReactEditor.focus(editor);
          break;
        case CardId.ToolSimulation:
          prepareForAddTool(editor);
          insertSimulationTool(editor);
          ReactEditor.focus(editor);
          break;
        case CardId.ToolChoicesTimer:
          addWidget({
            id: uuidv4().toString(),
            type: WidgetType.Timer,
            duration: 120,
            title: cardData[CardId.ToolChoicesTimer].title,
            buttons: [
              {
                label: 'Go to Choices tool',
                onClick: () => {
                  selectTool(editor, ChoicesElement.Wrapper);
                  ReactEditor.focus(editor);
                },
              },
            ],
          });

          selectTool(editor, ChoicesElement.Wrapper);
          ReactEditor.focus(editor);
          removeCard(CardId.ToolChoicesTimer);
          break;
        case CardId.ToolGoalsTimer:
          addWidget({
            id: uuidv4().toString(),
            type: WidgetType.Timer,
            duration: 120,
            title: cardData[CardId.ToolGoalsTimer].title,
            buttons: [
              {
                label: 'Go to Goals tool',
                onClick: () => {
                  selectTool(editor, GoalsElement.Wrapper);
                  ReactEditor.focus(editor);
                },
              },
            ],
          });

          selectTool(editor, GoalsElement.Wrapper);
          ReactEditor.focus(editor);
          removeCard(CardId.ToolGoalsTimer);
          break;
        case CardId.ToolInversionTimer:
          addWidget({
            id: uuidv4().toString(),
            type: WidgetType.Timer,
            duration: 300,
            title: cardData[CardId.ToolInversionTimer].title,
            buttons: [
              {
                label: 'Go to Inversion tool',
                onClick: () => {
                  selectTool(editor, InversionElement.Wrapper);
                  ReactEditor.focus(editor);
                },
              },
            ],
          });

          selectTool(editor, InversionElement.Wrapper);
          ReactEditor.focus(editor);
          removeCard(CardId.ToolInversionTimer);
          break;
        case CardId.ToolSimulationTimer:
          addWidget({
            id: uuidv4().toString(),
            type: WidgetType.Timer,
            duration: 300,
            title: cardData[CardId.ToolSimulationTimer].title,
            buttons: [
              {
                label: 'Go to Simulation tool',
                onClick: () => {
                  selectTool(editor, SimulationElement.Tool);
                  ReactEditor.focus(editor);
                },
              },
            ],
          });

          selectTool(editor, SimulationElement.Tool);
          ReactEditor.focus(editor);
          removeCard(CardId.ToolSimulationTimer);
          break;
        default:
      }
    },
    [hand, usedCardIds, addWidget]
  );

  const { children } = props;
  const cardValue = useMemo(
    () => ({
      cards: hand,
      cardAction,
      removeCard,
    }),
    [hand, cardAction, removeCard]
  );
  return (
    <CardContext.Provider value={cardValue}>{children}</CardContext.Provider>
  );
}

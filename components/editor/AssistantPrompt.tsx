import { useEffect, useRef, useContext, useMemo } from 'react';
import { useEditor } from 'slate-react';
import { Node } from 'slate';
import { add, isAfter } from 'date-fns';
import { CategorizerElement } from 'components/elements/Categorizer/CategorizerElement';
import { ChoicesElement } from 'components/elements/Choices/ChoicesElement';
import { GoalsElement } from 'components/elements/Goals/GoalsElement';
import { InversionElement } from 'components/elements/Inversion/InversionElement';
import { SimulationElement } from 'components/elements/Simulation/SimulationElement';
import AssistantContext, {
  AssistantAction,
} from 'components/editor/AssistantContext';
import insertGoalsTool from 'components/elements/Goals/insertGoalsTool';
import styles from './AssistantPrompt.module.scss';

const Tools: string[] = [
  CategorizerElement.Wrapper,
  ChoicesElement.Wrapper,
  GoalsElement.Wrapper,
  InversionElement.Wrapper,
  SimulationElement.Tool,
];

interface State {
  showTimeoutNudge: boolean;
  shouldSetTimeoutNudge: boolean;
  showedEliminatePrompt: boolean;
  slash: {
    whenShownMillis: number | null;
  };
}

// Hacky global variable to store shared flags without causing re-renders
// like a react context.
//
// NOTE: A full-page refresh is required to reset these (fast refresh will not
// do it for you).
let assistantState: State = {
  showTimeoutNudge: false,
  shouldSetTimeoutNudge: true,
  showedEliminatePrompt: false,
  slash: {
    whenShownMillis: null,
  },
};

/**
 * Returns assistant content as a function of Slate nodes.
 */
function getAssistantPrompt(
  nodes: Node[]
): [React.ReactNode, AssistantAction[], Partial<State>] {
  const tools = nodes.filter((node) => Tools.includes(node.type as string));
  const toolCount = tools.length;
  const now: Date = new Date();

  if (
    assistantState.slash.whenShownMillis == null ||
    isAfter(
      now,
      add(new Date(assistantState.slash.whenShownMillis), {
        minutes: 5,
      })
    )
  ) {
    return [
      <>
        Start typing or press <kbd className={styles.kbd}>/</kbd> to think
      </>,
      [],
      {
        slash: {
          ...assistantState.slash,
          whenShownMillis: Date.now(),
        },
      },
    ];
  }

  // Case: Timeout finished and takes priority
  if (assistantState.showTimeoutNudge) {
    return [
      'Could it be you’ve already made up your mind?',
      [],
      {
        showTimeoutNudge: false,
      },
    ];
  }

  // Case: 1st tool is choice tool
  const usedChoiceTool =
    tools.find((node) => node.type === ChoicesElement.Wrapper) != null;

  if (
    usedChoiceTool &&
    toolCount === 1 &&
    !assistantState.showedEliminatePrompt
  ) {
    return [
      'Can you cross out some choices now?',
      [],
      {
        showedEliminatePrompt: true,
      },
    ];
  }

  if (toolCount === 1) {
    return [
      <>
        Have any goals in mind? [Add Goals tool
        <kbd className={styles.kbd}>Ctrl Enter</kbd>]
      </>,
      [
        (e) => {
          insertGoalsTool(e);
        },
      ],
      {},
    ];
  }

  return [
    <>
      Start typing or press <kbd className={styles.kbd}>/</kbd> to think
    </>,
    [],
    {},
  ];
}

export default function AssistantPrompt(): JSX.Element {
  const editor = useEditor();
  const { setActions } = useContext(AssistantContext);
  const timeoutId = useRef<number | null>(null);

  const { children } = editor;

  // Only update the content when the doc changes
  const [content, newActions, stateUpdates] = useMemo(() => {
    return getAssistantPrompt(children);
  }, [children]);

  // Run logic based on the current assistant output
  useEffect(() => {
    // Update available assistant actions
    setActions(newActions);

    // Update flags
    assistantState = {
      ...assistantState,
      ...stateUpdates,
    };

    // Set timer for nudge if we haven't already
    if (assistantState.shouldSetTimeoutNudge) {
      timeoutId.current = window.setTimeout(() => {
        // Make the nudge visible
        assistantState.showTimeoutNudge = true;

        if (timeoutId.current != null) {
          window.clearTimeout(timeoutId.current);
          timeoutId.current = null;
        }
      }, 5000);
      assistantState.shouldSetTimeoutNudge = false;
    }
  }, [content, newActions, stateUpdates]);

  return <>{content}</>;
}

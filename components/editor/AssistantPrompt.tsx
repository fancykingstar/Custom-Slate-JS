import { useEffect, useRef, useContext, useMemo } from 'react';
import { useEditor } from 'slate-react';
import { Node } from 'slate';
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

interface Flags {
  showTimeoutNudge: boolean;
  shouldSetTimeoutNudge: boolean;
  showedEliminatePrompt: boolean;
}

// Hacky global variable to store shared flags without causing re-renders
// like a react context.
//
// NOTE: A full-page refresh is required to reset these (fast refresh will not
// do it for you).
let assistantFlags: Flags = {
  showTimeoutNudge: false,
  shouldSetTimeoutNudge: true,
  showedEliminatePrompt: false,
};

/**
 * Returns assistant content as a function of Slate nodes.
 */
function getAssistantPrompt(
  nodes: Node[]
): [React.ReactNode, AssistantAction[], Partial<Flags>] {
  const tools = nodes.filter((node) => Tools.includes(node.type as string));
  const toolCount = tools.length;

  // Case: Timeout finished and takes priority
  if (assistantFlags.showTimeoutNudge) {
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
    !assistantFlags.showedEliminatePrompt
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
  const [content, newActions, flagsUpdates] = useMemo(() => {
    return getAssistantPrompt(children);
  }, [children]);

  // Run logic based on the current assistant output
  useEffect(() => {
    // Update available assistant actions
    setActions(newActions);

    // Update flags
    assistantFlags = {
      ...assistantFlags,
      ...flagsUpdates,
    };

    // Set timer for nudge if we haven't already
    if (assistantFlags.shouldSetTimeoutNudge) {
      timeoutId.current = window.setTimeout(() => {
        // Make the nudge visible
        assistantFlags.showTimeoutNudge = true;

        if (timeoutId.current != null) {
          window.clearTimeout(timeoutId.current);
          timeoutId.current = null;
        }
      }, 5000);
      assistantFlags.shouldSetTimeoutNudge = false;
    }
  }, [content, newActions, flagsUpdates]);

  return <>{content}</>;
}

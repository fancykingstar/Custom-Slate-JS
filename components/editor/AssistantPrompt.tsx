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
import insertCategorizerTool from 'components/elements/Categorizer/insertCategorizerTool';
import insertChoicesTool from 'components/elements/Choices/insertChoicesTool';
import insertGoalsTool from 'components/elements/Goals/insertGoalsTool';
import AssistantKeyboardCommand from 'components/editor/AssistantKeyboardCommand';
import styles from './AssistantPrompt.module.scss';

// Default max number of time a prompt should be shown.
const MaxShownCount = 5;

const Tools: string[] = [
  CategorizerElement.Wrapper,
  ChoicesElement.Wrapper,
  GoalsElement.Wrapper,
  InversionElement.Wrapper,
  SimulationElement.Tool,
];

interface State {
  categorizer: {
    shownCount: number;
  };
  choices: {
    shownCount: number;
  };
  goals: {
    shownCount: number;
  };
  showTimeoutNudge: boolean;
  shouldSetTimeoutNudge: boolean;
  showedEliminatePrompt: boolean;
  slash: {
    shownCount: number;
    whenShownMillis: number | null;
  };
}

// Hacky global variable to store shared flags without causing re-renders
// like a react context.
//
// NOTE: A full-page refresh is required to reset these (fast refresh will not
// do it for you).
let assistantState: State = {
  categorizer: {
    shownCount: 0,
  },
  choices: {
    shownCount: 0,
  },
  goals: {
    shownCount: 0,
  },
  showTimeoutNudge: false,
  shouldSetTimeoutNudge: true,
  showedEliminatePrompt: false,
  slash: {
    shownCount: 0,
    whenShownMillis: null,
  },
};

/**
 * Reminds the user to try the slash menu, at the first time the doc opens or if the slash menu
 * prompt has not appeared in the last 5 mins.
 */
function getSlashPrompt():
  | [React.ReactNode, AssistantAction[], Partial<State>]
  | null {
  const message = (
    <>
      Start typing or press <kbd className={styles.kbd}>/</kbd> to think
    </>
  );

  if (assistantState.slash.whenShownMillis == null) {
    return [
      message,
      [],
      {
        slash: {
          ...assistantState.slash,
          shownCount: 1,
          whenShownMillis: Date.now(),
        },
      },
    ];
  }

  if (assistantState.slash.shownCount < MaxShownCount) {
    return [
      message,
      [],
      {
        slash: {
          ...assistantState.slash,
          shownCount: assistantState.slash.shownCount + 1,
          whenShownMillis: Date.now(),
        },
      },
    ];
  }

  const now: Date = new Date();
  if (
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
          shownCount: 1,
          whenShownMillis: Date.now(),
        },
      },
    ];
  }

  return null;
}

function getDefaultPrompt(): [
  React.ReactNode,
  AssistantAction[],
  Partial<State>
] {
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

function getCategorizerPrompt(
  tools: Node[]
): [React.ReactNode, AssistantAction[], Partial<State>] | null {
  if (assistantState.categorizer.shownCount >= MaxShownCount) {
    return null;
  }

  if (tools.find((node) => node.type === CategorizerElement.Wrapper) != null) {
    return null;
  }

  return [
    <>
      Do you know the type of this decision?{' '}
      <AssistantKeyboardCommand>Add Categorizer tool</AssistantKeyboardCommand>
    </>,
    [
      (e) => {
        insertCategorizerTool(e);
      },
    ],
    {
      categorizer: {
        ...assistantState.categorizer,
        shownCount: assistantState.categorizer.shownCount + 1,
      },
    },
  ];
}

function getChoicesPrompt(
  tools: Node[]
): [React.ReactNode, AssistantAction[], Partial<State>] | null {
  if (assistantState.choices.shownCount >= MaxShownCount) {
    return null;
  }

  if (tools.find((node) => node.type === ChoicesElement.Wrapper) != null) {
    return null;
  }

  return [
    <>
      Do you know your choices?{' '}
      <AssistantKeyboardCommand>Add Choices tool</AssistantKeyboardCommand>
    </>,
    [
      (e) => {
        insertChoicesTool(e);
      },
    ],
    {
      choices: {
        ...assistantState.choices,
        shownCount: assistantState.choices.shownCount + 1,
      },
    },
  ];
}

function getGoalsPrompt(
  tools: Node[]
): [React.ReactNode, AssistantAction[], Partial<State>] | null {
  if (assistantState.goals.shownCount >= MaxShownCount) {
    return null;
  }

  if (tools.find((node) => node.type === GoalsElement.Wrapper) != null) {
    return null;
  }

  return [
    <>
      Have any goals in mind?{' '}
      <AssistantKeyboardCommand>Add Goals tool</AssistantKeyboardCommand>
    </>,
    [
      (e) => {
        insertGoalsTool(e);
      },
    ],
    {
      goals: {
        ...assistantState.goals,
        shownCount: assistantState.goals.shownCount + 1,
      },
    },
  ];
}

/**
 * Returns assistant content as a function of Slate nodes.
 */
function getAssistantPrompt(
  nodes: Node[]
): [React.ReactNode, AssistantAction[], Partial<State>] {
  const tools = nodes.filter((node) => Tools.includes(node.type as string));
  const toolCount = tools.length;

  let ret = getSlashPrompt();
  if (ret != null) {
    return ret;
  }

  ret = getCategorizerPrompt(tools);
  if (ret != null) {
    return ret;
  }

  ret = getChoicesPrompt(tools);
  if (ret != null) {
    return ret;
  }

  ret = getGoalsPrompt(tools);
  if (ret != null) {
    return ret;
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

  return getDefaultPrompt();
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

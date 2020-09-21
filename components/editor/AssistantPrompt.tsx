import { useEffect, useContext, useMemo } from 'react';
import { useEditor } from 'slate-react';
import { Node } from 'slate';
import { add, isAfter } from 'date-fns';
import { CategorizerElement } from 'components/elements/Categorizer/CategorizerElement';
import { ChoicesType } from 'components/elements/Choices/ChoicesType';
import { GoalsElementType } from 'components/elements/Goals/GoalsElementType';
import { InversionElement } from 'components/elements/Inversion/InversionElement';
import { SimulationElement } from 'components/elements/Simulation/SimulationElement';
import AssistantContext, {
  AssistantAction,
} from 'components/editor/AssistantContext';
import insertCategorizerTool from 'components/elements/Categorizer/insertCategorizerTool';
import insertChoicesTool from 'components/elements/Choices/insertChoicesTool';
import insertGoalsTool from 'components/elements/Goals/insertGoalsTool';
import insertInversionTool from 'components/elements/Inversion/insertInversionTool';
import insertSimulationTool from 'components/elements/Simulation/insertSimulationTool';
import AssistantKeyboardCommand from 'components/editor/AssistantKeyboardCommand';
import { CategorizerContext, DecisionCategory } from 'components/context';
import styles from './AssistantPrompt.module.scss';

// Default max number of time a prompt should be shown.
const MaxShownCount = 5;

const Tools: string[] = [
  CategorizerElement.Wrapper,
  ChoicesType.Wrapper,
  GoalsElementType.Wrapper,
  InversionElement.Wrapper,
  SimulationElement.Tool,
];

interface State {
  categorizer: {
    count: number;
  };
  choices: {
    count: number;
  };
  goals: {
    count: number;
  };
  inversion: {
    count: number;
    countEliminate: number;
  };
  nudge: {
    count: number;
    show: boolean;
    timeoutId: number | null;
  };
  simulation: {
    count: number;
    countEliminate: number;
  };
  slash: {
    count: number;
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
    count: 0,
  },
  choices: {
    count: 0,
  },
  goals: {
    count: 0,
  },
  inversion: {
    count: 0,
    countEliminate: 0,
  },
  nudge: {
    count: 0,
    show: false,
    timeoutId: null,
  },
  simulation: {
    count: 0,
    countEliminate: 0,
  },
  slash: {
    count: 0,
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
          count: 1,
          whenShownMillis: Date.now(),
        },
      },
    ];
  }

  if (assistantState.slash.count < MaxShownCount) {
    return [
      message,
      [],
      {
        slash: {
          ...assistantState.slash,
          count: assistantState.slash.count + 1,
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
          count: 1,
          whenShownMillis: Date.now(),
        },
      },
    ];
  }

  return null;
}

function getTimeoutPrompt():
  | [React.ReactNode, AssistantAction[], Partial<State>]
  | null {
  if (!assistantState.nudge.show) {
    return null;
  }

  if (assistantState.nudge.count < MaxShownCount - 1) {
    return [
      'Could it be you’ve already made up your mind?',
      [],
      {
        nudge: {
          ...assistantState.nudge,
          count: assistantState.nudge.count + 1,
        },
      },
    ];
  }

  return [
    'Could it be you’ve already made up your mind?',
    [],
    {
      nudge: {
        ...assistantState.nudge,
        count: 0,
        show: false,
      },
    },
  ];
}

function getCategorizerPrompt(
  tools: Node[]
): [React.ReactNode, AssistantAction[], Partial<State>] | null {
  if (assistantState.categorizer.count >= MaxShownCount) {
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
        count: assistantState.categorizer.count + 1,
      },
    },
  ];
}

function getChoicesPrompt(
  tools: Node[]
): [React.ReactNode, AssistantAction[], Partial<State>] | null {
  if (assistantState.choices.count >= MaxShownCount) {
    return null;
  }

  if (tools.find((node) => node.type === ChoicesType.Wrapper) != null) {
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
        count: assistantState.choices.count + 1,
      },
    },
  ];
}

function getGoalsPrompt(
  tools: Node[]
): [React.ReactNode, AssistantAction[], Partial<State>] | null {
  if (assistantState.goals.count >= MaxShownCount) {
    return null;
  }

  if (tools.find((node) => node.type === GoalsElementType.Wrapper) != null) {
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
        count: assistantState.goals.count + 1,
      },
    },
  ];
}

function getInversionPrompt(
  tools: Node[]
): [React.ReactNode, AssistantAction[], Partial<State>] | null {
  if (assistantState.inversion.count >= MaxShownCount) {
    return null;
  }

  if (tools.find((node) => node.type === InversionElement.Wrapper) != null) {
    if (assistantState.inversion.countEliminate >= MaxShownCount) {
      return null;
    }

    const usedChoiceTool =
      tools.find((node) => node.type === ChoicesType.Wrapper) != null;
    const usedInversionTool =
      tools.find((node) => node.type === InversionElement.Wrapper) != null;

    if (usedChoiceTool && usedInversionTool) {
      return [
        'Can you cross out some choices now?',
        [],
        {
          inversion: {
            ...assistantState.inversion,
            countEliminate: assistantState.inversion.countEliminate + 1,
          },
        },
      ];
    }

    return null;
  }

  return [
    <>
      What's the worst that could happen?{' '}
      <AssistantKeyboardCommand>Add Inversion tool</AssistantKeyboardCommand>
    </>,
    [
      (e) => {
        insertInversionTool(e);
      },
    ],
    {
      inversion: {
        ...assistantState.inversion,
        count: assistantState.inversion.count + 1,
      },
    },
  ];
}

function getSimulationPrompt(
  tools: Node[]
): [React.ReactNode, AssistantAction[], Partial<State>] | null {
  if (assistantState.simulation.count >= MaxShownCount) {
    return null;
  }

  if (tools.find((node) => node.type === SimulationElement.Tool) != null) {
    if (assistantState.simulation.countEliminate >= MaxShownCount) {
      return null;
    }

    const usedChoiceTool =
      tools.find((node) => node.type === ChoicesType.Wrapper) != null;
    const usedSimulationTool =
      tools.find((node) => node.type === SimulationElement.Tool) != null;

    if (usedChoiceTool && usedSimulationTool) {
      return [
        'Can you cross out some choices now?',
        [],
        {
          simulation: {
            ...assistantState.simulation,
            countEliminate: assistantState.simulation.countEliminate + 1,
          },
        },
      ];
    }

    return null;
  }

  return [
    <>
      Can you simulate what happens with each choice?{' '}
      <AssistantKeyboardCommand>Add Simulation tool</AssistantKeyboardCommand>
    </>,
    [
      (e) => {
        insertSimulationTool(e);
      },
    ],
    {
      simulation: {
        ...assistantState.simulation,
        count: assistantState.simulation.count + 1,
      },
    },
  ];
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

/**
 * Returns assistant content as a function of Slate nodes.
 */
function getAssistantPrompt(
  nodes: Node[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  decisionCategory: DecisionCategory | null
): [React.ReactNode, AssistantAction[], Partial<State>] {
  const tools = nodes.filter((node) => Tools.includes(node.type as string));

  let ret = getSlashPrompt();
  if (ret != null) {
    return ret;
  }

  ret = getTimeoutPrompt();
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

  ret = getInversionPrompt(tools);
  if (ret != null) {
    return ret;
  }

  ret = getSimulationPrompt(tools);
  if (ret != null) {
    return ret;
  }

  /*
  if (decisionCategory == null) {
  } else {
    switch (decisionCategory) {
      case DecisionCategory.Snap:
      case DecisionCategory.Dash:
      case DecisionCategory.Capstone:
      case DecisionCategory.Puzzle:
      case DecisionCategory.Leap:
      case DecisionCategory.Parachute:
      case DecisionCategory.Summit:
      case DecisionCategory.Mountain:
      default:
    }
  }
  */

  return getDefaultPrompt();
}

function scheduleNudge(): void {
  if (assistantState.nudge.timeoutId != null) {
    return;
  }

  assistantState.nudge.timeoutId = window.setTimeout(() => {
    assistantState.nudge.show = true;
    assistantState.nudge.timeoutId = null;

    scheduleNudge();
  }, 5 * 60 * 1000);
}

export default function AssistantPrompt(): JSX.Element {
  const editor = useEditor();
  const { setActions } = useContext(AssistantContext);

  const { children } = editor;
  const { decisionCategory } = useContext(CategorizerContext);

  // Only update the content when the doc changes
  const [content, newActions, stateUpdates] = useMemo(() => {
    return getAssistantPrompt(children, decisionCategory);
  }, [children, decisionCategory]);

  // Run logic based on the current assistant output
  useEffect(() => {
    // Update available assistant actions
    setActions(newActions);

    // Update flags
    assistantState = {
      ...assistantState,
      ...stateUpdates,
    };

    scheduleNudge();
  }, [content, newActions, stateUpdates]);

  return <>{content}</>;
}

import { useCallback } from 'react';
import {
  RenderElementProps,
  useSelected,
  useEditor,
  ReactEditor,
  useFocused,
} from 'slate-react';
import { Range, Element, Editor, Transforms, Path, Node } from 'slate';
import styles from './SimulationElement.module.scss';

export enum SimulationElement {
  Tool = 'simulation',
  Choice = 'simulation-choice',
  Item = 'simulation-item',
}

export enum SimulationProbability {
  None = 'none',
  Low = 'low',
  Med = 'med',
  High = 'high',
}

export function SimulationToolElement(props: RenderElementProps): JSX.Element {
  const selected = useSelected();
  const { attributes, children } = props;

  return (
    <div
      {...attributes}
      className={`${styles.wrapper} ${selected ? styles.active : ''}`}
    >
      {children}
      <h2 className={styles.toolName} contentEditable={false}>
        Simulation
      </h2>
    </div>
  );
}

export function SimulationChoiceElement(
  props: RenderElementProps
): JSX.Element {
  const { attributes, children, element } = props;

  return (
    <h3 {...attributes} className={styles.choice}>
      {children}
      <Placeholder
        element={element}
        text="What's a choice you want to simulate?"
        emptyText="Untitled simulation topic…"
      />
    </h3>
  );
}

export function SimulationItemElement(props: RenderElementProps): JSX.Element {
  const editor = useEditor();
  const selected = useSelected();
  const focused = useFocused();
  const { attributes, children, element } = props;
  const { selection } = editor;

  const setProbability = useCallback(
    (newProbability: SimulationProbability) => {
      const nodePath = ReactEditor.findPath(editor, element);

      Transforms.setNodes(
        editor,
        {
          probability: newProbability,
        },
        {
          at: nodePath,
        }
      );

      // Refocus on the editor after losing focus to the button
      ReactEditor.focus(editor);
    },
    [editor, element]
  );

  const classNames = [
    styles.itemWrapper,
    styles[`indent-${element.indent ?? 0}`],
    styles[`probability-${element.probability ?? SimulationProbability.None}`],
  ];

  const isNodeFocused =
    selected && focused && selection != null && Range.isCollapsed(selection);

  let placeholderText = 'What happens if this happens?';

  const nodePath = ReactEditor.findPath(editor, element);
  const nodeIndex = nodePath[nodePath.length - 1];
  if (nodeIndex > 0) {
    const indent = element.indent as number;
    const parentPath = nodePath.slice(0, nodePath.length - 1);

    // Find the first previous node which is has lower indent or
    // is a choice element
    let parentNode: Node | null = null;
    for (let i = nodeIndex - 1; i >= 0; i -= 1) {
      const [node] = Editor.node(editor, parentPath.concat(i));
      if (
        node.type === SimulationElement.Choice ||
        node.indent === indent - 1
      ) {
        parentNode = node;
        break;
      }
    }

    if (parentNode != null) {
      const parentNodeContent = Node.string(parentNode);
      let snippet = parentNodeContent.slice(0, 10);
      if (parentNodeContent.length > snippet.length) {
        snippet = snippet.concat('…');
      }

      const [prevNode] = Editor.node(editor, Path.previous(nodePath));
      const isPrevNodeChoice = prevNode.type === SimulationElement.Choice;
      const isFirstChildAtIndent =
        prevNode.indent === indent - 1 || prevNode.indent == null;

      if (snippet.length) {
        if (isPrevNodeChoice) {
          if (isFirstChildAtIndent) {
            placeholderText = `What might happen if you pick "${snippet}"?`;
          } else {
            placeholderText = `What else might happen if you pick "${snippet}"?`;
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (isFirstChildAtIndent) {
            placeholderText = `What might happen if "${snippet}" happens?`;
          } else {
            placeholderText = `What else might happen if "${snippet}" happens?`;
          }
        }
      }
    }
  }

  return (
    <ul {...attributes} className={classNames.join(' ')}>
      <li className={styles.itemContent}>
        {children}
        <ProbabilityDot element={element} setProbability={setProbability} />
        <Placeholder element={element} text={placeholderText} />
      </li>
      {isNodeFocused ? (
        <Menu element={element} setProbability={setProbability} />
      ) : null}
    </ul>
  );
}

interface ProbabilityDotProps {
  element: Element;
  setProbability: (newProbability: SimulationProbability) => void;
}

function ProbabilityDot(props: ProbabilityDotProps): JSX.Element {
  const { element, setProbability } = props;

  const probability =
    (element.probability as SimulationProbability | undefined) ??
    SimulationProbability.None;
  const probabilityClass = styles[`probability-${probability}`];

  const increaseProbability = useCallback(() => {
    let newProbability = null;

    if (probability === SimulationProbability.None) {
      newProbability = SimulationProbability.Low;
    } else if (probability === SimulationProbability.Low) {
      newProbability = SimulationProbability.Med;
    } else if (probability === SimulationProbability.Med) {
      newProbability = SimulationProbability.High;
    } else if (probability === SimulationProbability.High) {
      newProbability = SimulationProbability.None;
    }

    if (newProbability != null) {
      setProbability(newProbability);
    }
  }, [probability]);

  return (
    <button
      type="button"
      className={`${styles.probabilityDot} ${probabilityClass}`}
      contentEditable={false}
      onClick={increaseProbability}
      title="Increase probability"
    >
      {probability}
    </button>
  );
}

interface PlaceholderProps {
  element: Element;
  text: string;
  // eslint-disable-next-line react/require-default-props
  emptyText?: string;
}

function Placeholder(props: PlaceholderProps): JSX.Element | null {
  // BUG: Clicking on this node from a text selection that includes this node will
  // cause `useEditor()` to not re-render. We use `useEditor` instead of `useSlate`,
  // however, to favor performance over correctness in this edge-case.
  const editor = useEditor();
  const selected = useSelected();
  const focused = useFocused();
  const { selection } = editor;
  const { element, text, emptyText } = props;

  const isEmpty = Editor.isEmpty(editor, element);

  if (!selected || !focused || !isEmpty) {
    if (isEmpty && emptyText != null) {
      return (
        <span className={styles.placeholder} contentEditable={false}>
          {emptyText}
        </span>
      );
    }

    return null;
  }

  if (selection == null || !Range.isCollapsed(selection)) {
    return null;
  }

  const nodePath = ReactEditor.findPath(editor, element);
  const [, selectionPath] = Editor.node(editor, selection);
  const [, selectionParentPath] = Editor.parent(editor, selectionPath);

  if (!Path.equals(selectionParentPath, nodePath)) {
    return null;
  }

  return (
    <span className={styles.placeholder} contentEditable={false}>
      {text}
    </span>
  );
}

interface MenuProps {
  element: Element;
  setProbability: (newProbability: SimulationProbability) => void;
}

function Menu(props: MenuProps): JSX.Element | null {
  const editor = useEditor();
  const { element, setProbability } = props;
  const nodePath = ReactEditor.findPath(editor, element);

  const radioGroupName = nodePath.join('');

  return (
    <ul contentEditable={false} className={styles.menu}>
      <li>
        <div className={styles.probabilityMenu}>
          <input
            id={`${radioGroupName}-${SimulationProbability.None}`}
            type="radio"
            name={radioGroupName}
            value={SimulationProbability.None}
            checked={element.probability === SimulationProbability.None}
            onChange={() => setProbability(SimulationProbability.None)}
          />
          <label
            className={`${styles.probabilityMenuItem} ${
              styles[`menu-${SimulationProbability.None}`]
            }`}
            htmlFor={`${radioGroupName}-${SimulationProbability.None}`}
          >
            <svg
              className={styles.probabilityMenuIcon}
              width="16"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className={styles.noneCircleBG}
                cx="8"
                cy="8"
                r="7"
                fill="gray"
              />
              <circle
                className={styles.noneCircle}
                cx="8"
                cy="8"
                r="4"
                stroke="#717284"
                strokeWidth="1.33"
                strokeLinecap="round"
                strokeDasharray="0.1 3"
              />
            </svg>

            <MenuTooltip>Unknown probability</MenuTooltip>
          </label>

          <input
            id={`${radioGroupName}-${SimulationProbability.Low}`}
            type="radio"
            name={radioGroupName}
            value={SimulationProbability.Low}
            checked={element.probability === SimulationProbability.Low}
            onChange={() => setProbability(SimulationProbability.Low)}
          />
          <label
            className={`${styles.probabilityMenuItem} ${
              styles[`menu-${SimulationProbability.Low}`]
            }`}
            htmlFor={`${radioGroupName}-${SimulationProbability.Low}`}
          >
            <svg
              className={styles.probabilityMenuIcon}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className={styles.lowCircle}
                cx="8"
                cy="8"
                r="2.335"
                stroke="#717284"
                strokeWidth="1.33"
              />
            </svg>

            <MenuTooltip>Low probability</MenuTooltip>
          </label>

          <input
            id={`${radioGroupName}-${SimulationProbability.Med}`}
            type="radio"
            name={radioGroupName}
            value={SimulationProbability.Med}
            checked={element.probability === SimulationProbability.Med}
            onChange={() => setProbability(SimulationProbability.Med)}
          />
          <label
            className={`${styles.probabilityMenuItem} ${
              styles[`menu-${SimulationProbability.Med}`]
            }`}
            htmlFor={`${radioGroupName}-${SimulationProbability.Med}`}
          >
            <svg
              className={styles.probabilityMenuIcon}
              width="16"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className={styles.medCircle}
                cx="8"
                cy="8"
                r="4.335"
                stroke="#717284"
                strokeWidth="1.33"
              />
            </svg>

            <MenuTooltip>Med probability</MenuTooltip>
          </label>

          <input
            id={`${radioGroupName}-${SimulationProbability.High}`}
            type="radio"
            name={radioGroupName}
            value={SimulationProbability.High}
            checked={element.probability === SimulationProbability.High}
            onChange={() => setProbability(SimulationProbability.High)}
          />
          <label
            className={`${styles.probabilityMenuItem} ${
              styles[`menu-${SimulationProbability.High}`]
            }`}
            htmlFor={`${radioGroupName}-${SimulationProbability.High}`}
          >
            <svg
              className={styles.probabilityMenuIcon}
              width="16"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className={styles.highCircle}
                cx="8"
                cy="8"
                r="6.335"
                stroke="#717284"
                strokeWidth="1.33"
              />
            </svg>
            <MenuTooltip>High probability</MenuTooltip>
          </label>
        </div>
      </li>
      {/* <li>
        <button type="button" className={styles.menuDelete}>
          Delete
        </button>
      </li> */}
    </ul>
  );
}

interface MenuTooltipProps {
  children: string;
}

function MenuTooltip(props: MenuTooltipProps): JSX.Element {
  const { children } = props;
  return <div className={styles.tooltip}>{children}</div>;
}

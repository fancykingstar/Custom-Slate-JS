import { useCallback } from 'react';
import {
  RenderElementProps,
  useSelected,
  useEditor,
  ReactEditor,
  useFocused,
} from 'slate-react';
import { Range, Element, Editor, Transforms, Path, Node } from 'slate';
import ToolWrapper from 'components/editor/ToolWrapper';
import { IconToolSimulation } from 'components/icons/IconTool';
import InlinePlaceholder from 'components/editor/InlinePlaceholder';
import styles from './SimulationElement.module.scss';

export enum SimulationElement {
  Tool = 'simulation',
  Choice = 'simulation-choice',
  Item = 'simulation-item',
}

export enum SimulationImportance {
  None = 'none',
  Low = 'low',
  Med = 'med',
  High = 'high',
}

export function SimulationToolElement(props: RenderElementProps): JSX.Element {
  const { attributes, children } = props;
  return (
    <ToolWrapper
      attributes={attributes}
      name="Simulation"
      icon={<IconToolSimulation />}
    >
      {children}
    </ToolWrapper>
  );
}

export function SimulationChoiceElement(
  props: RenderElementProps
): JSX.Element {
  const { attributes, children, element } = props;

  return (
    <h3 {...attributes} className={styles.choice}>
      {children}
      <InlinePlaceholder
        element={element}
        blurChildren="Untitled simulation topic…"
      >
        What’s a choice you want to simulate?
      </InlinePlaceholder>
    </h3>
  );
}

export function SimulationItemElement(props: RenderElementProps): JSX.Element {
  const editor = useEditor();
  const selected = useSelected();
  const focused = useFocused();
  const { attributes, children, element } = props;
  const { selection } = editor;

  const setImportance = useCallback(
    (newImportance: SimulationImportance) => {
      const nodePath = ReactEditor.findPath(editor, element);

      Transforms.setNodes(
        editor,
        {
          importance: newImportance,
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
    styles[`importance-${element.importance ?? SimulationImportance.None}`],
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
        <ImportanceDot element={element} setImportance={setImportance} />
        <InlinePlaceholder element={element}>
          {placeholderText}
        </InlinePlaceholder>
      </li>
      {isNodeFocused ? (
        <Menu element={element} setImportance={setImportance} />
      ) : null}
    </ul>
  );
}

interface ImportanceDotProps {
  element: Element;
  setImportance: (newImportance: SimulationImportance) => void;
}

function ImportanceDot(props: ImportanceDotProps): JSX.Element {
  const { element, setImportance } = props;

  const importance =
    (element.importance as SimulationImportance | undefined) ??
    SimulationImportance.None;
  const importanceClass = styles[`importance-${importance}`];

  const increaseImportance = useCallback(() => {
    let newImportance = null;

    if (importance === SimulationImportance.None) {
      newImportance = SimulationImportance.Low;
    } else if (importance === SimulationImportance.Low) {
      newImportance = SimulationImportance.Med;
    } else if (importance === SimulationImportance.Med) {
      newImportance = SimulationImportance.High;
    } else if (importance === SimulationImportance.High) {
      newImportance = SimulationImportance.None;
    }

    if (newImportance != null) {
      setImportance(newImportance);
    }
  }, [importance]);

  return (
    <button
      type="button"
      className={`${styles.importanceDot} ${importanceClass}`}
      contentEditable={false}
      onClick={increaseImportance}
      title="Increase importance"
    >
      {importance}
    </button>
  );
}

interface MenuProps {
  element: Element;
  setImportance: (newImportance: SimulationImportance) => void;
}

function Menu(props: MenuProps): JSX.Element | null {
  const editor = useEditor();
  const { element, setImportance } = props;
  const nodePath = ReactEditor.findPath(editor, element);

  const radioGroupName = nodePath.join('');

  return (
    <ul contentEditable={false} className={styles.menu}>
      <li>
        <div className={styles.importanceMenu}>
          <input
            id={`${radioGroupName}-${SimulationImportance.None}`}
            type="radio"
            name={radioGroupName}
            value={SimulationImportance.None}
            checked={element.importance === SimulationImportance.None}
            onChange={() => setImportance(SimulationImportance.None)}
          />
          <label
            className={`${styles.importanceMenuItem} ${
              styles[`menu-${SimulationImportance.None}`]
            }`}
            htmlFor={`${radioGroupName}-${SimulationImportance.None}`}
          >
            <svg
              className={styles.importanceMenuIcon}
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

            <MenuTooltip>Unknown importance</MenuTooltip>
          </label>

          <input
            id={`${radioGroupName}-${SimulationImportance.Low}`}
            type="radio"
            name={radioGroupName}
            value={SimulationImportance.Low}
            checked={element.importance === SimulationImportance.Low}
            onChange={() => setImportance(SimulationImportance.Low)}
          />
          <label
            className={`${styles.importanceMenuItem} ${
              styles[`menu-${SimulationImportance.Low}`]
            }`}
            htmlFor={`${radioGroupName}-${SimulationImportance.Low}`}
          >
            <svg
              className={styles.importanceMenuIcon}
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

            <MenuTooltip>Low importance</MenuTooltip>
          </label>

          <input
            id={`${radioGroupName}-${SimulationImportance.Med}`}
            type="radio"
            name={radioGroupName}
            value={SimulationImportance.Med}
            checked={element.importance === SimulationImportance.Med}
            onChange={() => setImportance(SimulationImportance.Med)}
          />
          <label
            className={`${styles.importanceMenuItem} ${
              styles[`menu-${SimulationImportance.Med}`]
            }`}
            htmlFor={`${radioGroupName}-${SimulationImportance.Med}`}
          >
            <svg
              className={styles.importanceMenuIcon}
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

            <MenuTooltip>Med importance</MenuTooltip>
          </label>

          <input
            id={`${radioGroupName}-${SimulationImportance.High}`}
            type="radio"
            name={radioGroupName}
            value={SimulationImportance.High}
            checked={element.importance === SimulationImportance.High}
            onChange={() => setImportance(SimulationImportance.High)}
          />
          <label
            className={`${styles.importanceMenuItem} ${
              styles[`menu-${SimulationImportance.High}`]
            }`}
            htmlFor={`${radioGroupName}-${SimulationImportance.High}`}
          >
            <svg
              className={styles.importanceMenuIcon}
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
            <MenuTooltip>High importance</MenuTooltip>
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

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
import { IconToolPeople } from 'components/icons/IconTool';
import InlinePlaceholder from 'components/editor/InlinePlaceholder';
import styles from './PeopleElement.module.scss';

export enum PeopleElement {
  Tool = 'people',
  Team = 'people-team',
  Item = 'people-item',
}

export enum PeopleRole {
  None = 'none',
  Consultant = 'low',
  Approver = 'med',
  Responsible = 'high',
}

export function PeopleToolElement(props: RenderElementProps): JSX.Element {
  const { attributes, children } = props;
  return (
    <ToolWrapper
      attributes={attributes}
      name="People"
      icon={<IconToolPeople />}
    >
      {children}
    </ToolWrapper>
  );
}

export function PeopleTeamElement(props: RenderElementProps): JSX.Element {
  const { attributes, children, element } = props;

  return (
    <h3 {...attributes} className={styles.team}>
      {children}
      <InlinePlaceholder element={element} blurChildren="Team">
        What team should be involved?
      </InlinePlaceholder>
    </h3>
  );
}

export function PeopleItemElement(props: RenderElementProps): JSX.Element {
  const editor = useEditor();
  const selected = useSelected();
  const focused = useFocused();
  const { attributes, children, element } = props;
  const { selection } = editor;

  const setConfidence = useCallback(
    (newConfidence: PeopleRole) => {
      const nodePath = ReactEditor.findPath(editor, element);

      Transforms.setNodes(
        editor,
        {
          confidence: newConfidence,
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
    styles[`confidence-${element.confidence ?? PeopleRole.None}`],
  ];

  const isNodeFocused =
    selected && focused && selection != null && Range.isCollapsed(selection);

  let placeholderText = 'Who should be involved?';

  const nodePath = ReactEditor.findPath(editor, element);
  const nodeIndex = nodePath[nodePath.length - 1];
  if (nodeIndex > 0) {
    const indent = element.indent as number;
    const parentPath = nodePath.slice(0, nodePath.length - 1);

    // Find the first previous node which is has lower indent or
    // is a team element
    let parentNode: Node | null = null;
    for (let i = nodeIndex - 1; i >= 0; i -= 1) {
      const [node] = Editor.node(editor, parentPath.concat(i));
      if (node.type === PeopleElement.Team || node.indent === indent - 1) {
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
      const isFirstChildAtIndent =
        prevNode.indent === indent - 1 || prevNode.indent == null;

      if (!isFirstChildAtIndent) {
        placeholderText = 'Who else should be involved?';
      }
    }
  }

  return (
    <ul {...attributes} className={classNames.join(' ')}>
      <li className={styles.itemContent}>
        {children}
        <ConfidenceDot element={element} setConfidence={setConfidence} />
        <InlinePlaceholder element={element}>
          {placeholderText}
        </InlinePlaceholder>
      </li>
      {isNodeFocused ? (
        <Menu element={element} setConfidence={setConfidence} />
      ) : null}
    </ul>
  );
}

interface ConfidenceDotProps {
  element: Element;
  setConfidence: (newConfidence: PeopleRole) => void;
}

function ConfidenceDot(props: ConfidenceDotProps): JSX.Element {
  const { element, setConfidence } = props;

  const confidence =
    (element.confidence as PeopleRole | undefined) ?? PeopleRole.None;
  const confidenceClass = styles[`confidence-${confidence}`];

  const increaseConfidence = useCallback(() => {
    let newConfidence = null;

    if (confidence === PeopleRole.None) {
      newConfidence = PeopleRole.Consultant;
    } else if (confidence === PeopleRole.Consultant) {
      newConfidence = PeopleRole.Approver;
    } else if (confidence === PeopleRole.Approver) {
      newConfidence = PeopleRole.Responsible;
    } else if (confidence === PeopleRole.Responsible) {
      newConfidence = PeopleRole.None;
    }

    if (newConfidence != null) {
      setConfidence(newConfidence);
    }
  }, [confidence]);

  return (
    <button
      type="button"
      className={`${styles.confidenceDot} ${confidenceClass}`}
      contentEditable={false}
      onClick={increaseConfidence}
      title="Change role"
    >
      {confidence}
    </button>
  );
}

interface MenuProps {
  element: Element;
  setConfidence: (newConfidence: PeopleRole) => void;
}

function Menu(props: MenuProps): JSX.Element | null {
  const editor = useEditor();
  const { element, setConfidence } = props;
  const nodePath = ReactEditor.findPath(editor, element);

  const radioGroupName = nodePath.join('');

  return (
    <ul contentEditable={false} className={styles.menu}>
      <li>
        <div className={styles.confidenceMenu}>
          <input
            id={`${radioGroupName}-${PeopleRole.None}`}
            type="radio"
            name={radioGroupName}
            value={PeopleRole.None}
            checked={element.confidence === PeopleRole.None}
            onChange={() => setConfidence(PeopleRole.None)}
          />
          <label
            className={`${styles.confidenceMenuItem} ${
              styles[`menu-${PeopleRole.None}`]
            }`}
            htmlFor={`${radioGroupName}-${PeopleRole.None}`}
          >
            <svg
              className={styles.confidenceMenuIcon}
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

            <MenuTooltip>Unknown role</MenuTooltip>
          </label>

          <input
            id={`${radioGroupName}-${PeopleRole.Consultant}`}
            type="radio"
            name={radioGroupName}
            value={PeopleRole.Consultant}
            checked={element.confidence === PeopleRole.Consultant}
            onChange={() => setConfidence(PeopleRole.Consultant)}
          />
          <label
            className={`${styles.confidenceMenuItem} ${
              styles[`menu-${PeopleRole.Consultant}`]
            }`}
            htmlFor={`${radioGroupName}-${PeopleRole.Consultant}`}
          >
            <svg
              className={styles.confidenceMenuIcon}
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

            <MenuTooltip>Consultant</MenuTooltip>
          </label>

          <input
            id={`${radioGroupName}-${PeopleRole.Approver}`}
            type="radio"
            name={radioGroupName}
            value={PeopleRole.Approver}
            checked={element.confidence === PeopleRole.Approver}
            onChange={() => setConfidence(PeopleRole.Approver)}
          />
          <label
            className={`${styles.confidenceMenuItem} ${
              styles[`menu-${PeopleRole.Approver}`]
            }`}
            htmlFor={`${radioGroupName}-${PeopleRole.Approver}`}
          >
            <svg
              className={styles.confidenceMenuIcon}
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

            <MenuTooltip>Approver</MenuTooltip>
          </label>

          <input
            id={`${radioGroupName}-${PeopleRole.Responsible}`}
            type="radio"
            name={radioGroupName}
            value={PeopleRole.Responsible}
            checked={element.confidence === PeopleRole.Responsible}
            onChange={() => setConfidence(PeopleRole.Responsible)}
          />
          <label
            className={`${styles.confidenceMenuItem} ${
              styles[`menu-${PeopleRole.Responsible}`]
            }`}
            htmlFor={`${radioGroupName}-${PeopleRole.Responsible}`}
          >
            <svg
              className={styles.confidenceMenuIcon}
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
            <MenuTooltip>Responsible</MenuTooltip>
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

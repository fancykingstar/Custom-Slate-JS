import { useCallback } from 'react';
import { Range, Element, Editor, Transforms, Path, Node } from 'slate';
import {
  RenderElementProps,
  useSelected,
  useEditor,
  ReactEditor,
  useFocused,
} from 'slate-react';

import { DrawingPinIcon } from '@modulz/radix-icons';

import ToolWrapper from 'components/editor/ToolWrapper';
import { dragHandleProps } from 'components/editor/drag';
import { Target } from 'components/icons/Icons';
import { IconToolIssueTree } from 'components/icons/IconTool';
import InlinePlaceholder from 'components/editor/InlinePlaceholder';
import styles from './IssueTreeElement.module.scss';

export enum IssueTreeElement {
  Tool = 'issueTree',
  Question = 'issueTree-question',
  Item = 'issueTree-item',
}

export enum IssueTreeKind {
  Problem = 'problem',
  Solution = 'solution',
}

export enum IssueTreeRole {
  None = 'none',
  Consultant = 'low',
  Approver = 'med',
  Responsible = 'high',
}

function renderLegend(): JSX.Element {
  const roles: string[][] = [
    [IssueTreeRole.None, 'Unassigned'],
    [IssueTreeRole.Consultant, 'Consultant'],
    [IssueTreeRole.Approver, 'Approver'],
    [IssueTreeRole.Responsible, 'Responsible'],
  ];

  return (
    <ul contentEditable={false} className={styles.legend}>
      {roles.map((role) => {
        return (
          <li key={role[0]} className={styles.legendItem}>
            <span
              className={`${styles.legendDot} ${styles[`role-${role[0]}`]}`}
              contentEditable={false}
            />
            {role[1]}
          </li>
        );
      })}
    </ul>
  );
}

export function IssueTreeToolElement(
  props: RenderElementProps & dragHandleProps
): JSX.Element {
  const { attributes, children, element } = props;

  const editor = useEditor();
  const toolPath = ReactEditor.findPath(editor, element);

  return (
    <ToolWrapper
      {...props}
      attributes={attributes}
      name="Issue Tree"
      icon={<IconToolIssueTree />}
    >
      <KindSelector kind={element.kind as IssueTreeKind} toolPath={toolPath} />
      {children}
      {/* renderLegend() */}
    </ToolWrapper>
  );
}

function setKind(editor: Editor, kind: IssueTreeKind, path: Path): void {
  Transforms.setNodes(editor, { kind }, { at: path });
}

interface KindSelectorProps {
  kind: IssueTreeKind;
  toolPath: Path;
}

function KindSelector(props: KindSelectorProps): JSX.Element {
  const { kind, toolPath } = props;
  const editor = useEditor();

  return (
    <h3 className={styles.kind} contentEditable={false}>
      <div className={styles.sectionWrapper}>
        <div className={styles.section}>
          <div className={styles.buttons}>
            <label className={styles.button}>
              <input
                type="radio"
                name="kind"
                value={IssueTreeKind.Problem}
                checked={kind === IssueTreeKind.Problem}
                onChange={() =>
                  setKind(editor, IssueTreeKind.Problem, toolPath)
                }
              />
              <span>Problems</span>
            </label>
            <label className={styles.button}>
              <input
                type="radio"
                name="kind"
                value={IssueTreeKind.Solution}
                checked={kind === IssueTreeKind.Solution}
                onChange={() =>
                  setKind(editor, IssueTreeKind.Solution, toolPath)
                }
              />
              <span>Solutions</span>
            </label>
          </div>
        </div>
      </div>
    </h3>
  );
}

function getKind(editor: ReactEditor, here: Path): IssueTreeKind {
  if (here.length === 0) {
    return IssueTreeKind.Problem;
  }

  const toolPath = here.slice(0, 1);
  const [tool] = Editor.node(editor, toolPath);
  return tool.kind as IssueTreeKind;
}

function toPinPath(pin: Path): Path {
  return pin.slice(1, pin.length);
}

function getPin(editor: ReactEditor, here: Path): Path | null {
  if (here.length === 0) {
    return null;
  }

  const toolPath = here.slice(0, 1);
  const [tool] = Editor.node(editor, toolPath);

  if (!tool.pin) {
    return null;
  }

  return tool.pin as Path;
}

function parentIsPin(
  editor: ReactEditor,
  pin: Path,
  here: Path,
  current: Node
): boolean {
  const toolPath = here.slice(0, 1);
  const [pinElement] = Editor.node(editor, [...toolPath, ...pin]);

  if (current.indent === 0) {
    return pinElement.type === IssueTreeElement.Question;
  }
  return current.indent === (pinElement.indent as number) + 1;
}

function togglePin(editor: ReactEditor, here: Path): void {
  if (here.length <= 1) {
    return;
  }

  const pin = getPin(editor, here);
  let newPin: Path | null = toPinPath(here);
  if (pin != null && Path.equals(pin, toPinPath(here))) {
    newPin = null;
  }

  const toolPath = here.slice(0, 1);
  Transforms.setNodes(
    editor,
    {
      pin: newPin,
    },
    {
      at: toolPath,
    }
  );
}

export function IssueTreeQuestionElement(
  props: RenderElementProps
): JSX.Element {
  const { attributes, children, element } = props;

  const editor = useEditor();
  const path = ReactEditor.findPath(editor, element);
  const kind = getKind(editor, path);

  let prefix = 'Why ';
  let placeholder = 'does…';
  if (kind === IssueTreeKind.Solution) {
    prefix = 'How ';
    placeholder = 'can…';
  }

  const pin = getPin(editor, path);
  const pinned = pin != null && Path.equals(pin, toPinPath(path));

  let pinStyles = [styles.pinQuestion, styles.pinButton];
  if (pinned) {
    pinStyles = [styles.pinQuestion, styles.pinnedButton];
  }

  const textStyles = [styles.question];
  if (pinned) {
    textStyles.push(styles.boldText);
  }

  return (
    <div className={styles.line}>
      <label className={pinStyles.join(' ')} contentEditable={false}>
        <input
          type="button"
          name="pin"
          value={path.toString()}
          onClick={togglePin.bind(null, editor, path)}
        />
        <DrawingPinIcon />
      </label>
      <h3 {...attributes} className={textStyles.join(' ')}>
        <span className={styles.questionPrefix} contentEditable={false}>
          {prefix}
        </span>
        <InlinePlaceholder element={element} blurChildren="…">
          {placeholder}
        </InlinePlaceholder>
        {children}
      </h3>
    </div>
  );
}

export function IssueTreeItemElement(props: RenderElementProps): JSX.Element {
  const editor = useEditor();
  const selected = useSelected();
  const focused = useFocused();
  const { attributes, children, element } = props;
  const { selection } = editor;

  const setRole = useCallback(
    (newRole: IssueTreeRole) => {
      const nodePath = ReactEditor.findPath(editor, element);

      Transforms.setNodes(
        editor,
        {
          role: newRole,
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
    styles[`role-${element.role ?? IssueTreeRole.None}`],
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
    // is a question element
    let parentNode: Node | null = null;
    for (let i = nodeIndex - 1; i >= 0; i -= 1) {
      const [node] = Editor.node(editor, parentPath.concat(i));
      if (
        node.type === IssueTreeElement.Question ||
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
      const isFirstChildAtIndent =
        prevNode.indent === indent - 1 || prevNode.indent == null;

      if (!isFirstChildAtIndent) {
        placeholderText = 'Who else should be involved?';
      }
    }
  }

  const pin = getPin(editor, nodePath);
  const pinned = pin != null && Path.equals(pin, toPinPath(nodePath));

  let pinStyles = [styles.pinQuestion, styles.pinButton];
  if (pinned) {
    pinStyles = [styles.pinQuestion, styles.pinnedButton];
  }

  const textStyles = [styles.itemContent];
  if (pinned || (pin != null && parentIsPin(editor, pin, nodePath, element))) {
    textStyles.push(styles.boldText);
  }

  return (
    <div className={styles.line}>
      <label className={pinStyles.join(' ')} contentEditable={false}>
        <input
          type="button"
          name="pin"
          value={nodePath.toString()}
          onClick={togglePin.bind(null, editor, nodePath)}
        />
        <DrawingPinIcon />
      </label>
      <ul {...attributes} className={classNames.join(' ')}>
        <li className={textStyles.join(' ')}>
          {children}
          <RoleDot element={element} setRole={setRole} />
          <InlinePlaceholder element={element}>
            {placeholderText}
          </InlinePlaceholder>
        </li>
        {/* isNodeFocused ? <Menu element={element} setRole={setRole} /> : null */}
      </ul>
    </div>
  );
}

interface RoleDotProps {
  element: Element;
  setRole: (newRole: IssueTreeRole) => void;
}

function RoleDot(props: RoleDotProps): JSX.Element {
  const { element, setRole } = props;

  const role =
    (element.role as IssueTreeRole | undefined) ?? IssueTreeRole.None;
  const roleClass = styles[`role-${role}`];

  const increaseRole = useCallback(() => {
    let newRole = null;

    if (role === IssueTreeRole.None) {
      newRole = IssueTreeRole.Consultant;
    } else if (role === IssueTreeRole.Consultant) {
      newRole = IssueTreeRole.Approver;
    } else if (role === IssueTreeRole.Approver) {
      newRole = IssueTreeRole.Responsible;
    } else if (role === IssueTreeRole.Responsible) {
      newRole = IssueTreeRole.None;
    }

    if (newRole != null) {
      setRole(newRole);
    }
  }, [role]);

  return (
    <button
      type="button"
      className={`${styles.roleDot} ${roleClass}`}
      contentEditable={false}
      onClick={increaseRole}
      title="Change role"
    >
      {role}
    </button>
  );
}

interface MenuProps {
  element: Element;
  setRole: (newRole: IssueTreeRole) => void;
}

function Menu(props: MenuProps): JSX.Element | null {
  const editor = useEditor();
  const { element, setRole } = props;
  const nodePath = ReactEditor.findPath(editor, element);

  const radioGroupName = nodePath.join('');

  return (
    <ul contentEditable={false} className={styles.menu}>
      <li>
        <div className={styles.roleMenu}>
          <input
            id={`${radioGroupName}-${IssueTreeRole.None}`}
            type="radio"
            name={radioGroupName}
            value={IssueTreeRole.None}
            checked={element.role === IssueTreeRole.None}
            onChange={() => setRole(IssueTreeRole.None)}
          />
          <label
            className={`${styles.roleMenuItem} ${
              styles[`menu-${IssueTreeRole.None}`]
            }`}
            htmlFor={`${radioGroupName}-${IssueTreeRole.None}`}
          >
            <svg
              className={styles.roleMenuIcon}
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

            <MenuTooltip>Unassigned</MenuTooltip>
          </label>

          <input
            id={`${radioGroupName}-${IssueTreeRole.Consultant}`}
            type="radio"
            name={radioGroupName}
            value={IssueTreeRole.Consultant}
            checked={element.role === IssueTreeRole.Consultant}
            onChange={() => setRole(IssueTreeRole.Consultant)}
          />
          <label
            className={`${styles.roleMenuItem} ${
              styles[`menu-${IssueTreeRole.Consultant}`]
            }`}
            htmlFor={`${radioGroupName}-${IssueTreeRole.Consultant}`}
          >
            <svg
              className={styles.roleMenuIcon}
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
            id={`${radioGroupName}-${IssueTreeRole.Approver}`}
            type="radio"
            name={radioGroupName}
            value={IssueTreeRole.Approver}
            checked={element.role === IssueTreeRole.Approver}
            onChange={() => setRole(IssueTreeRole.Approver)}
          />
          <label
            className={`${styles.roleMenuItem} ${
              styles[`menu-${IssueTreeRole.Approver}`]
            }`}
            htmlFor={`${radioGroupName}-${IssueTreeRole.Approver}`}
          >
            <svg
              className={styles.roleMenuIcon}
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
            id={`${radioGroupName}-${IssueTreeRole.Responsible}`}
            type="radio"
            name={radioGroupName}
            value={IssueTreeRole.Responsible}
            checked={element.role === IssueTreeRole.Responsible}
            onChange={() => setRole(IssueTreeRole.Responsible)}
          />
          <label
            className={`${styles.roleMenuItem} ${
              styles[`menu-${IssueTreeRole.Responsible}`]
            }`}
            htmlFor={`${radioGroupName}-${IssueTreeRole.Responsible}`}
          >
            <svg
              className={styles.roleMenuIcon}
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

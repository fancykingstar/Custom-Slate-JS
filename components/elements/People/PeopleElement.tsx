import { useCallback } from 'react';
import {
  RenderElementProps,
  useSelected,
  useEditor,
  ReactEditor,
  useFocused,
} from 'slate-react';
import { Range, Element, Editor, Transforms, Path, Node } from 'slate';
import { dragHandleProps } from 'components/editor/drag';
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

function renderLegend(): JSX.Element {
  const roles: string[][] = [
    [PeopleRole.None, 'Unassigned'],
    [PeopleRole.Consultant, 'Consultant'],
    [PeopleRole.Approver, 'Approver'],
    [PeopleRole.Responsible, 'Responsible'],
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

export function PeopleToolElement(
  props: RenderElementProps & dragHandleProps
): JSX.Element {
  const { attributes, children } = props;
  return (
    <ToolWrapper
      {...props}
      attributes={attributes}
      name="People"
      icon={<IconToolPeople />}
    >
      {children}
      {renderLegend()}
    </ToolWrapper>
  );
}

export function PeopleTeamElement(props: RenderElementProps): JSX.Element {
  const { attributes, children, element } = props;

  return (
    <h3 {...attributes} className={styles.team}>
      {children}
      <InlinePlaceholder element={element} blurChildren="Team">
        What team or group of people should be involved?
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

  const setRole = useCallback(
    (newRole: PeopleRole) => {
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
    styles[`role-${element.role ?? PeopleRole.None}`],
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
        <RoleDot element={element} setRole={setRole} />
        <InlinePlaceholder element={element}>
          {placeholderText}
        </InlinePlaceholder>
      </li>
      {isNodeFocused ? <Menu element={element} setRole={setRole} /> : null}
    </ul>
  );
}

interface RoleDotProps {
  element: Element;
  setRole: (newRole: PeopleRole) => void;
}

function RoleDot(props: RoleDotProps): JSX.Element {
  const { element, setRole } = props;

  const role = (element.role as PeopleRole | undefined) ?? PeopleRole.None;
  const roleClass = styles[`role-${role}`];

  const increaseRole = useCallback(() => {
    let newRole = null;

    if (role === PeopleRole.None) {
      newRole = PeopleRole.Consultant;
    } else if (role === PeopleRole.Consultant) {
      newRole = PeopleRole.Approver;
    } else if (role === PeopleRole.Approver) {
      newRole = PeopleRole.Responsible;
    } else if (role === PeopleRole.Responsible) {
      newRole = PeopleRole.None;
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
  setRole: (newRole: PeopleRole) => void;
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
            id={`${radioGroupName}-${PeopleRole.None}`}
            type="radio"
            name={radioGroupName}
            value={PeopleRole.None}
            checked={element.role === PeopleRole.None}
            onChange={() => setRole(PeopleRole.None)}
          />
          <label
            className={`${styles.roleMenuItem} ${
              styles[`menu-${PeopleRole.None}`]
            }`}
            htmlFor={`${radioGroupName}-${PeopleRole.None}`}
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
            id={`${radioGroupName}-${PeopleRole.Consultant}`}
            type="radio"
            name={radioGroupName}
            value={PeopleRole.Consultant}
            checked={element.role === PeopleRole.Consultant}
            onChange={() => setRole(PeopleRole.Consultant)}
          />
          <label
            className={`${styles.roleMenuItem} ${
              styles[`menu-${PeopleRole.Consultant}`]
            }`}
            htmlFor={`${radioGroupName}-${PeopleRole.Consultant}`}
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
            id={`${radioGroupName}-${PeopleRole.Approver}`}
            type="radio"
            name={radioGroupName}
            value={PeopleRole.Approver}
            checked={element.role === PeopleRole.Approver}
            onChange={() => setRole(PeopleRole.Approver)}
          />
          <label
            className={`${styles.roleMenuItem} ${
              styles[`menu-${PeopleRole.Approver}`]
            }`}
            htmlFor={`${radioGroupName}-${PeopleRole.Approver}`}
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
            id={`${radioGroupName}-${PeopleRole.Responsible}`}
            type="radio"
            name={radioGroupName}
            value={PeopleRole.Responsible}
            checked={element.role === PeopleRole.Responsible}
            onChange={() => setRole(PeopleRole.Responsible)}
          />
          <label
            className={`${styles.roleMenuItem} ${
              styles[`menu-${PeopleRole.Responsible}`]
            }`}
            htmlFor={`${radioGroupName}-${PeopleRole.Responsible}`}
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

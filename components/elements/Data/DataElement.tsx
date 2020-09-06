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
import { IconToolData } from 'components/icons/IconTool';
import InlinePlaceholder from 'components/editor/InlinePlaceholder';
import styles from './DataElement.module.scss';

export enum DataElement {
  Tool = 'data',
  Category = 'data-category',
  Item = 'data-item',
  Legend = 'data-legend',
}

export enum DataConfidence {
  None = 'none',
  Low = 'low',
  Med = 'med',
  High = 'high',
}

export function DataToolElement(props: RenderElementProps): JSX.Element {
  const { attributes, children } = props;
  return (
    <ToolWrapper attributes={attributes} name="Data" icon={<IconToolData />}>
      {children}
    </ToolWrapper>
  );
}

export function DataCategoryElement(props: RenderElementProps): JSX.Element {
  const { attributes, children, element } = props;

  return (
    <h3 {...attributes} className={styles.category}>
      {children}
      <InlinePlaceholder element={element} blurChildren="Category">
        What's a category of data you want to list?
      </InlinePlaceholder>
    </h3>
  );
}

export function DataItemElement(props: RenderElementProps): JSX.Element {
  const editor = useEditor();
  const selected = useSelected();
  const focused = useFocused();
  const { attributes, children, element } = props;
  const { selection } = editor;

  const setConfidence = useCallback(
    (newConfidence: DataConfidence) => {
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
    styles[`confidence-${element.confidence ?? DataConfidence.None}`],
  ];

  const isNodeFocused =
    selected && focused && selection != null && Range.isCollapsed(selection);

  let placeholderText = "What's something you know? Or need to know?";

  const nodePath = ReactEditor.findPath(editor, element);
  const nodeIndex = nodePath[nodePath.length - 1];
  if (nodeIndex > 0) {
    const indent = element.indent as number;
    const parentPath = nodePath.slice(0, nodePath.length - 1);

    // Find the first previous node which is has lower indent or
    // is a category element
    let parentNode: Node | null = null;
    for (let i = nodeIndex - 1; i >= 0; i -= 1) {
      const [node] = Editor.node(editor, parentPath.concat(i));
      if (node.type === DataElement.Category || node.indent === indent - 1) {
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
        placeholderText = "What's another thing you know? Or need to know?";
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

export function DataLegendElement(props: RenderElementProps): JSX.Element {
  const { attributes, children } = props;
  return (
    <ul {...attributes} contentEditable={false} className={styles.legend}>
      {children}
      <li className={styles.legendItem}>
        <span
          className={`${styles.legendDot} ${
            styles[`role-${DataConfidence.None}`]
          }`}
          contentEditable={false}
        />
        Need to know
      </li>
      <li className={styles.legendItem}>
        <span
          className={`${styles.legendDot} ${
            styles[`role-${DataConfidence.Low}`]
          }`}
          contentEditable={false}
        />
        Low confidence
      </li>
      <li className={styles.legendItem}>
        <span
          className={`${styles.legendDot} ${
            styles[`role-${DataConfidence.Med}`]
          }`}
          contentEditable={false}
        />
        Med confidence
      </li>
      <li className={styles.legendItem}>
        <span
          className={`${styles.legendDot} ${
            styles[`role-${DataConfidence.High}`]
          }`}
          contentEditable={false}
        />
        High confidence
      </li>
    </ul>
  );
}

interface ConfidenceDotProps {
  element: Element;
  setConfidence: (newConfidence: DataConfidence) => void;
}

function ConfidenceDot(props: ConfidenceDotProps): JSX.Element {
  const { element, setConfidence } = props;

  const confidence =
    (element.confidence as DataConfidence | undefined) ?? DataConfidence.None;
  const confidenceClass = styles[`confidence-${confidence}`];

  const increaseConfidence = useCallback(() => {
    let newConfidence = null;

    if (confidence === DataConfidence.None) {
      newConfidence = DataConfidence.Low;
    } else if (confidence === DataConfidence.Low) {
      newConfidence = DataConfidence.Med;
    } else if (confidence === DataConfidence.Med) {
      newConfidence = DataConfidence.High;
    } else if (confidence === DataConfidence.High) {
      newConfidence = DataConfidence.None;
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
      title="Increase confidence"
    >
      {confidence}
    </button>
  );
}

interface MenuProps {
  element: Element;
  setConfidence: (newConfidence: DataConfidence) => void;
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
            id={`${radioGroupName}-${DataConfidence.None}`}
            type="radio"
            name={radioGroupName}
            value={DataConfidence.None}
            checked={element.confidence === DataConfidence.None}
            onChange={() => setConfidence(DataConfidence.None)}
          />
          <label
            className={`${styles.confidenceMenuItem} ${
              styles[`menu-${DataConfidence.None}`]
            }`}
            htmlFor={`${radioGroupName}-${DataConfidence.None}`}
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

            <MenuTooltip>{'Need\u00A0to know'}</MenuTooltip>
          </label>

          <input
            id={`${radioGroupName}-${DataConfidence.Low}`}
            type="radio"
            name={radioGroupName}
            value={DataConfidence.Low}
            checked={element.confidence === DataConfidence.Low}
            onChange={() => setConfidence(DataConfidence.Low)}
          />
          <label
            className={`${styles.confidenceMenuItem} ${
              styles[`menu-${DataConfidence.Low}`]
            }`}
            htmlFor={`${radioGroupName}-${DataConfidence.Low}`}
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

            <MenuTooltip>Low confidence</MenuTooltip>
          </label>

          <input
            id={`${radioGroupName}-${DataConfidence.Med}`}
            type="radio"
            name={radioGroupName}
            value={DataConfidence.Med}
            checked={element.confidence === DataConfidence.Med}
            onChange={() => setConfidence(DataConfidence.Med)}
          />
          <label
            className={`${styles.confidenceMenuItem} ${
              styles[`menu-${DataConfidence.Med}`]
            }`}
            htmlFor={`${radioGroupName}-${DataConfidence.Med}`}
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

            <MenuTooltip>Med confidence</MenuTooltip>
          </label>

          <input
            id={`${radioGroupName}-${DataConfidence.High}`}
            type="radio"
            name={radioGroupName}
            value={DataConfidence.High}
            checked={element.confidence === DataConfidence.High}
            onChange={() => setConfidence(DataConfidence.High)}
          />
          <label
            className={`${styles.confidenceMenuItem} ${
              styles[`menu-${DataConfidence.High}`]
            }`}
            htmlFor={`${radioGroupName}-${DataConfidence.High}`}
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
            <MenuTooltip>High confidence</MenuTooltip>
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

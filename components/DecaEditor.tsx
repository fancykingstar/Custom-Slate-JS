// @refresh reset

import { useMemo, useState, useCallback, useRef, useContext } from 'react';
import { withHistory } from 'slate-history';
import {
  Slate,
  Editable,
  withReact,
  RenderLeafProps,
  ReactEditor,
} from 'slate-react';
import { createEditor, Editor, Node, Range, Transforms, Path } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Context } from 'components/context';
import Element from 'components/elements/Element';
import withLayout from 'components/editor/withLayout';
import withVoids from 'components/editor/withVoids';
import withMarkdown from 'components/editor/withMarkdown';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';
import { isTopLevelPath } from 'components/editor/queries';
import withDataElement from 'components/elements/Data/withDataElement';
import withIssueTreeElement from 'components/elements/IssueTree/withIssueTreeElement';
import withPeopleElement from 'components/elements/People/withPeopleElement';
import withSimulationElement from 'components/elements/Simulation/withSimulationElement';
import AssistantContext, {
  AssistantAction,
} from 'components/editor/AssistantContext';
import handleAutoScroll from 'components/editor/handleAutoScroll';
import useSlashMenu from 'components/editor/SlashMenu/useSlashMenu';
import SlashMenu from 'components/editor/SlashMenu/SlashMenu';
import Leaf from 'components/editor/Leaf';
import { Store, Action, Doc } from 'store/store';
import CardHand from 'components/cards/CardHand';
import Placeholder from 'components/editor/Placeholder';
import SlashPromptPlaceholder from 'components/editor/SlashPromptPlaceholder';
import CardHandler from 'components/cards/CardContext';
import Indexer, {
  LocatedKey,
  indexState,
  isInterestingSentence,
} from 'components/intelligence/Indexer';
import WidgetSidebar from 'components/widgets/WidgetSidebar';
import WidgetHandler from 'components/widgets/WidgetContext';
import StarBar from 'components/elements/Star/StarBar';

import styles from './DecaEditor.module.scss';

interface Props {
  doc: Doc;
}

export default function DecaEditor(props: Props): JSX.Element {
  const { doc } = props;

  const { dispatch } = useContext(Store);
  const context = useContext(Context);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const editor = useMemo(
    () =>
      withDataElement(
        withIssueTreeElement(
          withPeopleElement(
            withSimulationElement(
              withVoids(
                withMarkdown(withLayout(withHistory(withReact(createEditor()))))
              )
            )
          )
        )
      ),
    []
  );

  const [value, setValue] = useState<Node[]>(doc.content);
  const [assistantActions, setAssistantActions] = useState<AssistantAction[]>(
    []
  );

  const [
    onChangeSlashMenu,
    onKeyDownSlashMenu,
    onAddTool,
    slashMenuPos,
    slashMenuContent,
    slashMenuIndex,
  ] = useSlashMenu(editor);

  const renderElement = useCallback(
    (elementProps) => {
      const { type } = elementProps.element;
      const makeDraggable =
        type.includes('-wrapper') ||
        type === 'data' ||
        type === 'issueTree' ||
        type === 'people' ||
        type === 'simulation';
      if (makeDraggable) {
        const slateIndexArray = ReactEditor.findPath(
          editor,
          elementProps.element
        );
        // if ReactEditor.findPath fails to produce a valid array here, drag / drog will not work
        const slateIndex =
          (slateIndexArray.length && slateIndexArray[0]) ||
          elementProps.element.id;
        return (
          <Draggable
            key={String(slateIndexArray)}
            draggableId={String(slateIndex)}
            index={slateIndex}
          >
            {(provided) => {
              return (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                  <Element
                    {...elementProps}
                    dragHandleProps={provided.dragHandleProps}
                  />
                </div>
              );
            }}
          </Draggable>
        );
      }
      return <Element {...elementProps} />;
    },
    [value]
  );

  const onDragEnd = useCallback(
    (result) => {
      const { destination, source } = result;
      const outOfBounds = !destination;
      const draggedToSameLocation =
        destination.droppableId === source.droppableId &&
        destination.index === source.index;

      if (outOfBounds || draggedToSameLocation) {
        return;
      }

      Transforms.moveNodes(editor, {
        at: [source.index],
        to: [destination.index],
      });
    },
    [editor]
  );

  // NOTE: This is not memoized due to a Slate bug
  // See: https://github.com/ianstormtaylor/slate/issues/3447
  const renderLeaf = (leafProps: RenderLeafProps) => <Leaf {...leafProps} />;

  const decorate = useCallback(
    (entry) => {
      const [node, path] = entry;
      const ranges: Range[] = [];

      const { selection } = editor;

      // Determine whether to highlight slash command text
      if (
        selection != null &&
        Range.isCollapsed(selection) &&
        Path.equals(selection.focus.path, path) &&
        slashMenuPos != null &&
        node.text != null &&
        path.length === 2
      ) {
        const match = node.text.match(/^\/(\w.*)?$/);
        if (match != null) {
          const range = {
            anchor: Editor.start(editor, path),
            focus: Editor.end(editor, path),
            slashHighlight: true,
          };
          ranges.push(range);
        }
      } else {
        const pathString = path.toString();
        if (pathString in indexState.sentenceScores) {
          indexState.sentenceScores[pathString].forEach((sentence) => {
            if (isInterestingSentence(sentence)) {
              const range = {
                ...sentence.range,
                suggestedStar: true,
              };
              ranges.push(range);
            }
          });
        }
      }

      return ranges;
    },
    [editor, slashMenuPos]
  );

  const onKeyDown = useCallback(
    (event) => {
      const { selection } = editor;
      onElementKeyDown(editor, context, event);
      onKeyDownSlashMenu(event);

      // Prevent creation of a new starter node from title when pressing enter
      if (
        isKeyHotkey(Keys.Enter, event) &&
        editor.children.length <= 2 &&
        selection != null &&
        Range.isCollapsed(selection)
      ) {
        const caretPoint = selection.anchor;
        const [caretLine] = caretPoint.path;
        if (caretLine === 0) {
          Transforms.select(editor, [1, 0]);
          event.preventDefault();
        }
      }

      // Execute assistant action only when at the beginning of the line.
      if (
        isKeyHotkey('mod+enter', event) &&
        selection != null &&
        Range.isCollapsed(selection) &&
        assistantActions.length
      ) {
        const [selectionStart] = Range.edges(selection);
        const [node] = Editor.node(editor, selectionStart);
        const [caretLine] = selection.anchor.path;

        if (
          caretLine > 0 &&
          !Node.string(node).length &&
          isTopLevelPath(selectionStart.path)
        ) {
          // TODO: Allow handling of multiple actions
          const action = assistantActions[0];
          if (action != null) {
            action(editor);
            event.preventDefault();
          }
        }
      }
    },
    [assistantActions, onElementKeyDown, onKeyDownSlashMenu]
  );

  const onChange = useCallback(
    (newValue) => {
      setValue(newValue);
      onChangeSlashMenu();

      // Naive save doc on every change
      dispatch({ type: Action.setDoc, docId: doc.id, content: newValue });
    },
    [setValue, onChangeSlashMenu]
  );

  const onSelect = useCallback(() => {
    handleAutoScroll(editor);
  }, [editor]);

  return (
    <AssistantContext.Provider
      value={{
        actions: assistantActions,
        setActions: setAssistantActions,
      }}
    >
      <div className={styles.wrapper} ref={wrapperRef}>
        <Slate editor={editor} value={value} onChange={onChange}>
          <WidgetHandler>
            <CardHandler>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      <Editable
                        id="editor"
                        autoFocus
                        className={styles.editor}
                        decorate={decorate}
                        onKeyDown={onKeyDown}
                        onSelect={onSelect}
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                      />
                      <SlashMenu
                        activeIndex={slashMenuIndex}
                        content={slashMenuContent}
                        pos={slashMenuPos}
                        onAddTool={onAddTool}
                      />
                      <SlashPromptPlaceholder wrapperRef={wrapperRef} />
                      <Placeholder />
                      <CardHand />
                      <WidgetSidebar />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardHandler>
          </WidgetHandler>
          <Indexer />
          <StarBar />
        </Slate>
      </div>
    </AssistantContext.Provider>
  );
}

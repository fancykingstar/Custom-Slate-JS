import { useState, useRef, useContext, useMemo, useEffect } from 'react';
import { useSlate } from 'slate-react';
import { BasicElement } from 'components/elements/Element';
import { Editor, Node, Range } from 'slate';
import { CardContext, CardId } from 'components/cards/CardContext';
import styles from './CardHand.module.scss';

export default function CardHand(): JSX.Element {
  // Add `useSlate` to listen to every `onChange` event (unlike `useEditor`)
  const editor = useSlate();

  const { selection, children } = editor;

  const docBodyIsEmpty = useMemo(() => {
    const firstBodyNode = children[1];
    const bodyIsEmpty =
      children.length <= 2 &&
      firstBodyNode != null &&
      !Node.string(firstBodyNode).length &&
      firstBodyNode.type === BasicElement.Paragraph;

    // TODO: Fix tabbing out of editor leaving assistant placeholder visible instead of body

    // If editor is blurred or has multi-character selection...
    if (selection == null || !Range.isCollapsed(selection)) {
      // Force hand visible
      if (bodyIsEmpty) {
        return true;
      }
      return false;
    }

    // NOTE: We can directly use `.anchor` as `.anchor` and `.focus` are equivalent for a collapsed selection
    const caretPoint = selection.anchor;
    const [caretLine] = caretPoint.path;
    const [caretNode] = Editor.node(editor, caretPoint);
    const caretNodeEmpty = !Node.string(caretNode).length;

    if (
      // Hide body placeholder if doc has content
      !bodyIsEmpty ||
      (caretLine === 1 && caretNodeEmpty)
    ) {
      return false;
    }

    // Show the body placeholder if doc body is empty
    if (bodyIsEmpty) {
      return true;
    }

    return true;
  }, [selection, children]);

  // TODO: Peek cards up on inactivity in blank paragraph node

  return (
    <div className={`${styles.hand}`}>
      <CardHandContent forceVisible={docBodyIsEmpty} />
    </div>
  );
}

interface CardHandContentProps {
  forceVisible: boolean;
}

function CardHandContent(props: CardHandContentProps): JSX.Element {
  const { forceVisible } = props;
  // Handle hover manually to add delay before cards are hidden
  const hoverRef = useRef<number | null>(null);
  const [hovered, setHovered] = useState(false);

  const { cards, cardAction, removeCard } = useContext(CardContext);

  return (
    <div
      className={`${styles.handContent} ${
        hovered || forceVisible ? styles.hovered : ''
      }`}
      onMouseEnter={() => {
        // Clear any unhover timeouts
        if (hoverRef.current != null) {
          window.clearTimeout(hoverRef.current);
          hoverRef.current = null;
        }

        setHovered(true);
      }}
      onMouseLeave={() => {
        // Clear any unhover timeouts
        if (hoverRef.current != null) {
          window.clearTimeout(hoverRef.current);
          hoverRef.current = null;
        }

        hoverRef.current = window.setTimeout(() => {
          setHovered(false);
        }, 400);
      }}
    >
      {cards.map((card, index) => (
        <Card
          key={card.id}
          index={index}
          icon={card.icon}
          title={card.title}
          description={card.description}
          topPick={card.id === CardId.ToolCategorizer}
          onClick={() => {
            // setHovered(false);
            cardAction(card.id);
          }}
          dismiss={() => removeCard(card.id)}
        />
      ))}
    </div>
  );
}

interface Props {
  index: number;
  className?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  topPick?: boolean;
  onClick: () => void;
  dismiss: () => void;
}

function Card(props: Props): JSX.Element {
  const closeRef = useRef<number | null>(null);
  const [closeVisible, setCloseVisible] = useState(false);

  useEffect(() => {
    return () => {
      if (closeRef.current != null) {
        window.clearTimeout(closeRef.current);
        closeRef.current = null;
      }
    };
  }, []);

  const {
    index,
    className,
    icon,
    title,
    description,
    topPick,
    onClick,
    dismiss,
  } = props;
  return (
    <div
      className={`${styles.cardWrapper} ${styles[`card-${index}`]}`}
      onMouseEnter={() => {
        // Clear any unhover timeouts
        if (closeRef.current != null) {
          window.clearTimeout(closeRef.current);
          closeRef.current = null;
        }

        closeRef.current = window.setTimeout(() => {
          setCloseVisible(true);
        }, 500);
      }}
      onMouseLeave={() => {
        // Clear any hover timeouts
        if (closeRef.current != null) {
          window.clearTimeout(closeRef.current);
          closeRef.current = null;
        }

        setCloseVisible(false);
      }}
    >
      <button
        type="button"
        className={`${styles.closeButton} ${
          closeVisible ? styles.visible : ''
        }`}
        onClick={(event) => {
          dismiss();
          event.preventDefault();
        }}
        onMouseEnter={() => {
          // Clear any unhover timeouts
          if (closeRef.current != null) {
            window.clearTimeout(closeRef.current);
            closeRef.current = null;
          }

          setCloseVisible(true);
        }}
      >
        Close
      </button>

      <button type="button" className={styles.cardButton} onClick={onClick}>
        <div className={[styles.card, className].join(' ')}>
          {topPick ? <div className={styles.topPick}>⭐ Top Pick</div> : null}
          <div className={styles.icon}>{icon}</div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </button>
    </div>
  );
}

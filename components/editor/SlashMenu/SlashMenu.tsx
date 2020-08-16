import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import {
  SlashMenuContent,
  MenuItem,
} from 'components/editor/SlashMenu/getMenuContent';
import styles from './SlashMenu.module.scss';

interface Props {
  activeIndex: number;
  content: SlashMenuContent;
  pos: [number, number] | null;
  onAddTool: (item: MenuItem) => void;
}

export default function SlashMenu(props: Props): JSX.Element {
  const listRef = useRef<HTMLDivElement | null>(null);
  const { activeIndex, content, pos, onAddTool } = props;

  // Scroll to top on re-invokation
  useEffect(() => {
    if (listRef.current != null && listRef.current.scrollTop !== 0) {
      listRef.current.scrollTo({
        top: 0,
      });
    }
  }, [pos]);

  const availableMenuItems = content.items.filter(
    (menuItem) => menuItem.comingSoon == null
  );

  const suggestion = content?.suggestion;
  const suggestionItem = suggestion?.item;

  return (
    <div
      className={`${styles.wrapper} ${pos != null ? styles.active : ''}`}
      style={
        pos != null
          ? {
              left: `${pos[0] / 10}rem`,
              top: `${pos[1] / 10}rem`,
            }
          : {}
      }
    >
      <AssistantCard
        content={content}
        onAddTool={onAddTool}
        isActive={
          suggestionItem?.title === availableMenuItems[activeIndex]?.title
        }
      />
      {availableMenuItems.length ? (
        <div className={styles.list} ref={listRef}>
          <ul className={styles.menu}>
            {content.items.map((item, index) => {
              const output = [];

              // If it's a new group, add a header
              const prevItem = content.items[index - 1];
              if (
                !content.isFiltered &&
                (prevItem == null || item.category !== prevItem.category)
              ) {
                output.push(
                  <li key={item.category}>
                    <h2>{item.category}</h2>
                  </li>
                );
              }

              if (item.title !== suggestionItem?.title) {
                output.push(
                  <SlashMenuItem
                    key={item.title}
                    isActive={
                      item.title === availableMenuItems[activeIndex].title
                    }
                    item={item}
                    onAddTool={onAddTool}
                  />
                );
              }

              return output;
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

interface AssistantCardProps {
  content: SlashMenuContent;
  onAddTool: (item: MenuItem) => void;
  isActive: boolean;
}

function AssistantCard(props: AssistantCardProps): JSX.Element {
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const debounceRef = useRef<number | null>(null);

  const { content, onAddTool, isActive } = props;
  const suggestion = content?.suggestion;
  const item = suggestion?.item;

  // Fake debounce to increase perceived intelligence
  // We use `useLayoutEffect()` to avoid a flash of non-loading content
  useLayoutEffect(() => {
    // Clear any existing timeout
    if (debounceRef.current != null) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    setSuggestionLoading(true);

    debounceRef.current = window.setTimeout(() => {
      setSuggestionLoading(false);

      if (debounceRef.current != null) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    }, 350);
  }, [suggestion]);

  let cardContent = null;
  if (suggestion == null) {
    cardContent = (
      <p className={styles.assistantEmpty}>
        {content.items.length
          ? 'Ask any question or search for tools!'
          : 'Nothing found. Try something else?'}
      </p>
    );
  } else if (suggestionLoading) {
    cardContent = (
      <div className={styles.assistantLoading}>
        <div className={styles.spinner}>
          <div className={styles.bounce1} />
          <div className={styles.bounce2} />
          <div className={styles.bounce3} />
        </div>
      </div>
    );
  } else if (suggestion != null && suggestion.text == null) {
    cardContent = (
      <p className={styles.assistantText}>
        Sorry, I don't know how to respond to that!
      </p>
    );
  } else {
    cardContent = (
      <>
        <p className={styles.assistantText}>{suggestion.text}</p>
        {item != null ? (
          <div className={styles.assistantItem}>
            <button
              type="button"
              className={`${styles.item} ${isActive ? styles.active : ''}`}
              onClick={() => onAddTool(item)}
            >
              <div className={styles.icon}>{item.icon}</div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </button>
          </div>
        ) : null}
      </>
    );
  }

  return <div className={styles.assistant}>{cardContent}</div>;
}

interface MenuItemProps {
  isActive: boolean;
  item: MenuItem;
  onAddTool: (item: MenuItem) => void;
}

function SlashMenuItem(props: MenuItemProps): JSX.Element {
  const ref = useRef<HTMLLIElement>(null);
  const { isActive, item, onAddTool } = props;

  useEffect(() => {
    if (!isActive || ref.current == null) {
      return;
    }
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [isActive]);

  const content = (
    <>
      <div className={styles.icon}>{item.icon}</div>
      <div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </>
  );

  return (
    <li className={styles.listItem} ref={ref}>
      {item.comingSoon ? (
        <div className={`${styles.item} ${styles.comingSoon}`}>{content}</div>
      ) : (
        <button
          className={`${styles.item} ${isActive ? styles.active : ''}`}
          type="button"
          onClick={() => onAddTool(item)}
        >
          {content}
        </button>
      )}
    </li>
  );
}

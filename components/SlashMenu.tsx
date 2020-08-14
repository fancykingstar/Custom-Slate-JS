import { useRef, useEffect } from 'react';
import {
  MenuItem,
  SlashMenuContent,
} from 'components/editor/SlashMenu/useSlashMenu';
import styles from './SlashMenu.module.scss';

interface Props {
  activeIndex: number;
  content: SlashMenuContent;
  onAddTool: (item: MenuItem) => void;
}

export default function SlashMenu(props: Props): JSX.Element {
  const { activeIndex, content, onAddTool } = props;

  const availableMenuItems = content.items.filter(
    (menuItem) => menuItem.comingSoon == null
  );

  const suggestion = content?.suggestion;
  const suggestionItem = suggestion?.item;

  return (
    <div className={styles.wrapper}>
      <AssistantCard
        content={content}
        onAddTool={onAddTool}
        isActive={
          suggestionItem?.title === availableMenuItems[activeIndex]?.title
        }
      />
      {availableMenuItems.length ? (
        <div className={styles.list}>
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
  const { content, onAddTool, isActive } = props;

  const suggestion = content?.suggestion;
  const item = suggestion?.item;

  return (
    <div className={styles.assistant}>
      {suggestion != null ? (
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
      ) : (
        <p className={styles.assistantEmpty}>Explore the tools below!</p>
      )}
    </div>
  );
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
      block: 'center',
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

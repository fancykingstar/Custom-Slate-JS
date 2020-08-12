import { useRef, useEffect } from 'react';
import { MenuItem } from 'components/editor/SlashMenu/useSlashMenu';
import styles from './SlashMenu.module.scss';

interface Props {
  activeIndex: number;
  items: MenuItem[];
  onAddTool: (item: MenuItem) => void;
}

export default function SlashMenu(props: Props): JSX.Element {
  const { activeIndex, items, onAddTool } = props;

  const availableMenuItems = items.filter(
    (menuItem) => menuItem.comingSoon == null
  );

  return (
    <div className={styles.wrapper}>
      {availableMenuItems.length ? (
        <ul className={styles.menu}>
          {items.map((item, index) => {
            const output = [];

            // If it's a new group, add a header
            const prevItem = items[index - 1];
            if (prevItem == null || item.category !== prevItem.category) {
              output.push(
                <li key={item.category}>
                  <h2>{item.category}</h2>
                </li>
              );
            }

            output.push(
              <SlashMenuItem
                key={item.title}
                isActive={item.title === availableMenuItems[activeIndex].title}
                item={item}
                onAddTool={onAddTool}
              />
            );
            return output;
          })}
        </ul>
      ) : (
        <p className={styles.empty}>Nothing found</p>
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
      <div className={styles.itemContent}>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </>
  );

  return (
    <li ref={ref}>
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

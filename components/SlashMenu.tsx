import { useRef, useEffect } from 'react';
import styles from './SlashMenu.module.scss';

interface Props {
  activeIndex: number;
  onAddTool: (item: MenuItem) => void;
}

enum Category {
  Planning = 'Planning',
  Thinking = 'Thinking',
  Comparing = 'Comparing',
}

export enum SlashTitle {
  Categorizer = 'Categorizer',
  Choices = 'Choices',
  Comparison = 'Comparison of Choices',
  Goals = 'Goals',
  Inversion = 'Inversion',
  ProsCons = 'Pros / Cons',
  SecondOrder = '2nd Order Thinking',
}

export interface MenuItem {
  category: Category;
  title: string;
  description: string;
  icon: string;
  comingSoon?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    category: Category.Planning,
    title: SlashTitle.Choices,
    description: 'What are my options?',
    icon: '🌈',
  },
  {
    category: Category.Planning,
    title: SlashTitle.Goals,
    description: "What's the point?",
    icon: '⭐️',
  },
  {
    category: Category.Planning,
    title: SlashTitle.Categorizer,
    description: 'Know how to treat this decision',
    icon: '🍎',
    comingSoon: true,
  },
  {
    category: Category.Thinking,
    title: SlashTitle.Inversion,
    description: 'Flip your point of view',
    icon: '⏳',
    comingSoon: true,
  },
  {
    category: Category.Thinking,
    title: SlashTitle.SecondOrder,
    description: 'Look beyond immediate effects',
    icon: '2️⃣',
    comingSoon: true,
  },
  {
    category: Category.Comparing,
    title: SlashTitle.Comparison,
    description: 'Compare choices by criteria',
    icon: '🛒',
    comingSoon: true,
  },
  {
    category: Category.Comparing,
    title: SlashTitle.ProsCons,
    description: 'Simply compare each choice',
    icon: '🧾',
    comingSoon: true,
  },
];

export default function SlashMenu(props: Props): JSX.Element {
  const { activeIndex, onAddTool } = props;

  return (
    <div className={styles.wrapper}>
      <ul className={styles.menu}>
        {MENU_ITEMS.map((item, index) => {
          const output = [];

          // If it's a new group, add a header
          const prevItem = MENU_ITEMS[index - 1];
          if (prevItem == null || item.category !== prevItem.category) {
            output.push(
              <li key={item.category}>
                <h2>{item.category}</h2>
              </li>
            );
          }

          const availableMenuItems = MENU_ITEMS.filter(
            (menuItem) => menuItem.comingSoon == null
          );

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

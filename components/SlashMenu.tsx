import { useRef, useEffect } from 'react';
import styles from './SlashMenu.module.scss';

interface Props {
  activeIndex: number;
}

enum Category {
  Planning = 'Planning',
  Thinking = 'Thinking',
  Comparing = 'Comparing',
}

interface MenuItem {
  category: Category;
  title: string;
  description: string;
  icon: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    category: Category.Planning,
    title: 'Choice',
    description: 'Duis id quam fringilla, vehicula quam non, posuere tortor.',
    icon: '🌈',
  },
  {
    category: Category.Planning,
    title: 'Goals',
    description: 'Duis id quam fringilla, vehicula quam non, posuere tortor.',
    icon: '⭐️',
  },
  {
    category: Category.Planning,
    title: 'Categorizer',
    description: 'Duis id quam fringilla, vehicula quam non, posuere tortor.',
    icon: '🍊',
  },
  {
    category: Category.Thinking,
    title: 'Inversion',
    description: 'Duis id quam fringilla, vehicula quam non, posuere tortor.',
    icon: '⏳',
  },
  {
    category: Category.Thinking,
    title: '2nd-Order Comparing',
    description: 'Duis id quam fringilla, vehicula quam non, posuere tortor.',
    icon: '2️⃣',
  },
  {
    category: Category.Comparing,
    title: 'Comparison of Choices',
    description: 'Duis id quam fringilla, vehicula quam non, posuere tortor.',
    icon: '🛒',
  },
  {
    category: Category.Comparing,
    title: 'Pros/Cons',
    description: 'Duis id quam fringilla, vehicula quam non, posuere tortor.',
    icon: '🧾',
  },
];

export default function SlashMenu(props: Props): JSX.Element {
  const { activeIndex } = props;

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

          output.push(
            <SlashMenuItem
              key={item.title}
              isActive={activeIndex === index}
              item={item}
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
}

function SlashMenuItem(props: MenuItemProps): JSX.Element {
  const ref = useRef<HTMLLIElement>(null);
  const { isActive, item } = props;

  useEffect(() => {
    if (!isActive || ref.current == null) {
      return;
    }
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [isActive]);

  return (
    <li ref={ref}>
      <button
        className={`${styles.item} ${isActive ? styles.active : ''}`}
        type="button"
        onClick={() => {
          // TODO: Add tool `Element` into doc
          // console.log(item);
        }}
      >
        <div className={styles.icon}>{item.icon}</div>
        <div className={styles.itemContent}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      </button>
    </li>
  );
}

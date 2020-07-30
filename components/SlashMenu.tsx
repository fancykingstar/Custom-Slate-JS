import styles from './SlashMenu.module.scss';

interface MenuGroup {
  title: string;
  children: MenuItem[];
}

interface MenuItem {
  title: string;
  description: string;
  icon: string;
}

const MENU_GROUPS: MenuGroup[] = [
  {
    title: 'Basic',
    children: [
      {
        title: 'Choice',
        description:
          'Duis id quam fringilla, vehicula quam non, posuere tortor.',
        icon: '🌈',
      },
      {
        title: 'Goals',
        description:
          'Duis id quam fringilla, vehicula quam non, posuere tortor.',
        icon: '⭐️',
      },
    ],
  },
  {
    title: 'Group Alpha',
    children: [
      {
        title: 'Inversion',
        description:
          'Duis id quam fringilla, vehicula quam non, posuere tortor.',
        icon: '⏳',
      },
      {
        title: '2nd-Order Thinking',
        description:
          'Duis id quam fringilla, vehicula quam non, posuere tortor.',
        icon: '2️⃣',
      },
      {
        title: 'Categorizer',
        description:
          'Duis id quam fringilla, vehicula quam non, posuere tortor.',
        icon: '🍊',
      },
    ],
  },
  {
    title: 'Group Beta',
    children: [
      {
        title: 'Comparison of Choices',
        description:
          'Duis id quam fringilla, vehicula quam non, posuere tortor.',
        icon: '🛒',
      },
      {
        title: 'Pros/Cons',
        description:
          'Duis id quam fringilla, vehicula quam non, posuere tortor.',
        icon: '🧾',
      },
    ],
  },
];

export default function SlashMenu(): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <ul className={styles.menu}>
        {MENU_GROUPS.map((group) => (
          <li key={group.title}>
            <h2>{group.title}</h2>
            <ul className={styles.submenu}>
              {group.children.map((item) => (
                <li key={item.title}>
                  <div className={styles.icon}>{item.icon}</div>
                  <div className={styles.itemContent}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

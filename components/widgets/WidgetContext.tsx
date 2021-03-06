import { createContext, useMemo, useState } from 'react';

export enum WidgetType {
  Timer,
  Todo,
  Insights,
}

type WidgetItem = TimerWidgetItem | TodoWidgetItem | InsightsWidgetItem;

export interface TimerWidgetItem {
  id: string;
  type: WidgetType.Timer;
  // Duration of timer in seconds
  duration: number;
  title: string;
  buttons?: WidgetButton[];
}

export interface TodoWidgetItem {
  id: string;
  type: WidgetType.Todo;
}

export interface InsightsWidgetItem {
  id: string;
  type: WidgetType.Insights;
  title: React.ReactNode;
}

interface WidgetButton {
  label: string;
  onClick: () => void;
}

export const WidgetContext = createContext({
  widgets: [] as WidgetItem[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addWidget: (item: WidgetItem) => {
    // No-op
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeWidget: (id: string) => {
    // No-op
  },
});

interface Props {
  children: React.ReactNode;
}

export default function WidgetHandler(props: Props): JSX.Element {
  const [widgets, setWidgets] = useState<WidgetItem[]>([]);

  const addWidget = (item: WidgetItem): void => {
    if (item.type === WidgetType.Insights) {
      const itemIndex = widgets.findIndex(
        (widget) => widget.type === item.type
      );
      if (itemIndex === -1) {
        setWidgets([item, ...widgets]);
      }
      return;
    }
    setWidgets([...widgets, item]);
  };

  const removeWidget = (id: string): void => {
    const newWidgets = widgets.slice();
    const itemIndex = newWidgets.findIndex((widget) => widget.id === id);
    if (itemIndex == null) {
      throw new Error(`Failed to find widget to remove with id: ${id}`);
    }

    newWidgets.splice(itemIndex, 1);
    setWidgets(newWidgets);
  };

  const value = useMemo(
    () => ({
      widgets,
      addWidget,
      removeWidget,
    }),
    [widgets, addWidget, removeWidget]
  );
  const { children } = props;

  return (
    <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>
  );
}

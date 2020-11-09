import { useState, useEffect, useRef, useContext } from 'react';
import { Editor, Node, Text } from 'slate';
import { useEditor } from 'slate-react';
import { useTransition, animated } from 'react-spring';
import { Store } from 'store/store';
import { v4 as uuidv4 } from 'uuid';

import BasicButton from 'components/buttons/BasicButton';
import {
  InsightsWidgetItem,
  TimerWidgetItem,
  WidgetContext,
  WidgetType,
} from 'components/widgets/WidgetContext';
import { Star } from 'components/icons/Icons';
import styles from './WidgetSidebar.module.scss';

export default function WidgetSidebar(): JSX.Element {
  const { widgets, addWidget, removeWidget } = useContext(WidgetContext);
  const transitions = useTransition(widgets, (widget) => widget.id, {
    from: { opacity: 0, transform: 'translate3d(2.4rem, 0, 0)' },
    enter: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
    leave: { opacity: 0, transform: 'translate3d(2.4rem, 0, 0)' },
  });

  const editor = useEditor();

  useEffect(() => {
    const nodes = Editor.nodes(editor, {
      at: [],
      match: (n: Node) =>
        Text.isText(n) && n.star === true && n.text.trim() !== '',
    });
    const stars = Array.from(nodes).map((n) => String(n[0].text));
    const itemIndex = widgets.findIndex(
      (widget) => widget.type === WidgetType.Insights
    );
    if (stars.length > 0 && itemIndex === -1) {
      addWidget({
        id: uuidv4().toString(),
        type: WidgetType.Insights,
        title: '⭐️',
      });
    }
  }, []);

  return (
    <div className={styles.sidebar}>
      {transitions.map((value) => {
        const { item, props, key } = value;

        switch (item.type) {
          case WidgetType.Timer:
            return (
              <animated.div key={key} style={props}>
                <TimerWidget
                  visible
                  item={item}
                  dismiss={() => removeWidget(item.id)}
                />
              </animated.div>
            );
          case WidgetType.Insights:
            return (
              <animated.div key={key} style={props}>
                <InsightsWidget visible item={item} />
              </animated.div>
            );
          default:
        }

        return null;
      })}
    </div>
  );
}

interface TimerWidgetProps {
  visible: boolean;
  item: TimerWidgetItem;
  dismiss: () => void;
}

interface InsightsWidgetProps {
  visible: boolean;
  item: InsightsWidgetItem;
}

function TimerWidget(props: TimerWidgetProps): JSX.Element {
  const { visible, item, dismiss } = props;

  const interval = useRef<number | null>(null);
  const [seconds, setSeconds] = useState(item.duration);

  useEffect(() => {
    interval.current = window.setInterval(() => {
      setSeconds((prev) => {
        return prev > 0 && visible ? prev - 1 : prev;
      });
    }, 1000);

    return () => {
      if (interval.current != null) {
        window.clearInterval(interval.current);
        interval.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (seconds < 1) {
      if (interval.current != null) {
        window.clearInterval(interval.current);
        interval.current = null;
      }
      dismiss();
    }
  }, [seconds]);

  const formattedMinutes = Math.floor(seconds / 60);
  const formattedSeconds = seconds - formattedMinutes * 60;

  return (
    <div className={`${styles.timerWrapper} ${visible ? styles.visible : ''}`}>
      <button type="button" className={styles.closeButton} onClick={dismiss}>
        Close
      </button>
      <h3>{item.title}</h3>
      <p className={styles.timeRemaining}>
        {formattedMinutes}:
        {formattedSeconds === 0 || formattedSeconds < 10
          ? `0${formattedSeconds}`
          : formattedSeconds}
      </p>
      {item.buttons?.map((button) => (
        <BasicButton
          key={button.label}
          className={styles.timerButton}
          onClick={button.onClick}
        >
          {button.label}
        </BasicButton>
      ))}
    </div>
  );
}

function InsightsWidget(props: InsightsWidgetProps): JSX.Element {
  const { visible, item } = props;
  const [stars, setStars] = useState<string[]>([]);
  const editor = useEditor();
  const { state } = useContext(Store);
  const { docs, activeDocId } = state;
  const doc = docs.find((el) => el.id === activeDocId);

  useEffect(() => {
    const nodes = Editor.nodes(editor, {
      at: [],
      match: (n: Node) =>
        Text.isText(n) && n.star === true && n.text.trim() !== '',
    });
    setStars(Array.from(nodes).map((n) => String(n[0].text)));
  }, [doc]);

  return (
    <div>
      {stars.length === 0 ? null : (
        <div
          className={`${styles.timerWrapper} ${visible ? styles.visible : ''}`}
        >
          <div className={styles.icon}>{item.title}</div>
          <div className={styles.insights}>
            {stars.map((insight, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={i}>
                <Star size="12" fill="gray" stroke="gray" />
                <span className={styles.insight}>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

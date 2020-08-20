import { useState, useEffect, useRef, useContext } from 'react';
import BasicButton from 'components/buttons/BasicButton';
import {
  TimerWidgetItem,
  WidgetContext,
  WidgetType,
} from 'components/widgets/WidgetContext';
import { useTransition, animated } from 'react-spring';
import styles from './WidgetSidebar.module.scss';

export default function WidgetSidebar(): JSX.Element {
  const { widgets, removeWidget } = useContext(WidgetContext);
  const transitions = useTransition(widgets, (widget) => widget.id, {
    from: { opacity: 0, transform: 'translate3d(2.4rem, 0, 0)' },
    enter: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
    leave: { opacity: 0, transform: 'translate3d(2.4rem, 0, 0)' },
  });

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

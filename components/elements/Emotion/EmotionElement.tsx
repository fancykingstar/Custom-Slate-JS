import { useCallback, useState } from 'react';
import { RenderElementProps } from 'slate-react';
import { dragHandleProps } from 'components/editor/drag';
import ToolWrapper from 'components/editor/ToolWrapper';
import { IconToolEmotion } from 'components/icons/IconTool';
import styles from './EmotionElement.module.scss';

export enum EmotionElement {
  Wrapper = 'emotion-wrapper',
}

enum PrimaryEmotion {
  Joy,
  Surprise,
  Sadness,
  Anger,
  Fear,
  Love,
}

enum SecondaryEmotion {
  // Joy
  Euphoric,
  Excited,
  Optimistic,
  Proud,
  Cheerful,
  Happy,
  Content,
  Peaceful,

  // Surprise
  Moved,
  Overcome,
  Amazed,
  Confused,
  Stunned,

  // Sadness
  Gloomy,
  Lonely,
  Shameful,
  Disappointed,
  Unhappy,
  Hurt,

  // Anger
  Disgusted,
  Jealous,
  Irritable,
  Exasperated,
  Enraged,

  // Fear
  Horrified,
  Nervous,
  Insecure,
  Terrified,
  Scared,

  // Love
  Grateful,
  Sentimental,
  Affectionate,
  Romantic,
  Enchanted,
}

enum TertiaryEmotion {
  // Joy
  Jubilant,
  Elated,
  Zealous,
  Enthusiastic,
  Hopeful,
  Eager,
  Illustrious,
  Triumphant,
  Playful,
  Amused,
  Delighted,
  Jovial,
  Pleased,
  Satisfied,
  Serene,
  Tranquil,

  // Surprise
  Touched,
  Stimulated,
  Astounded,
  Speechless,
  Awed,
  Astonished,
  Perplexed,
  Disillusioned,
  Bewildered,
  Shocked,

  // Sadness
  Depressed,
  Hopeless,
  Neglected,
  Isolated,
  Guilty,
  Regretful,
  Displeased,
  Dismayed,
  Disheartened,
  Miserable,
  Disturbed,
  Agonized,

  // Anger
  Revolted,
  Contemptuous,
  Envious,
  Resentful,
  Aggravated,
  Annoyed,
  Frustrated,
  Agitated,
  Hostile,
  Hateful,

  // Fear
  Dreadful,
  Mortified,
  Anxious,
  Worried,
  Inadequate,
  Inferior,
  Hysterical,
  Panicked,
  Helpless,
  Frightened,

  // Love
  Thankful,
  Appreciative,
  Nostalgic,
  Tender,
  Compassionate,
  Warmhearted,
  Enamored,
  Passionate,
  Rapturous,
  Enthralled,
}

interface ForPrimary {
  [primary: string]: ForSecondary;
}

interface ForSecondary {
  [secondary: string]: TertiaryEmotion[];
}

function getAddPri(
  checkedPri: PrimaryEmotion[],
  setCheckedPri: (checkedPri: PrimaryEmotion[]) => void,
  addToBag: (toAdd: string) => void
): (toAdd: PrimaryEmotion) => void {
  return (toAdd: PrimaryEmotion) => {
    const checked = new Set(checkedPri);
    if (!checked.has(toAdd)) {
      checked.add(toAdd);
      setCheckedPri(Array.from(checked));
      addToBag(PrimaryEmotion[toAdd]);
    }
  };
}

function getRemovePri(
  checkedPri: PrimaryEmotion[],
  setCheckedPri: (checkedPri: PrimaryEmotion[]) => void,
  removeFromBag: (toRemove: string) => void
): (toRemove: PrimaryEmotion) => void {
  return (toRemove: PrimaryEmotion) => {
    const checked = new Set(checkedPri);
    if (checked.has(toRemove)) {
      checked.delete(toRemove);
      setCheckedPri(Array.from(checked));
      removeFromBag(PrimaryEmotion[toRemove]);
    }
  };
}

function getAddSec(
  checkedSec: SecondaryEmotion[],
  setCheckedSec: (checkedSec: SecondaryEmotion[]) => void,
  addToBag: (toAdd: string) => void
): (toAdd: SecondaryEmotion, parentEmotion: PrimaryEmotion) => void {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (toAdd: SecondaryEmotion, parentEmotion: PrimaryEmotion) => {
    const checked = new Set(checkedSec);
    if (!checked.has(toAdd)) {
      checked.add(toAdd);
      setCheckedSec(Array.from(checked));
      addToBag(SecondaryEmotion[toAdd]);
    }
  };
}

function getRemoveSec(
  checkedSec: SecondaryEmotion[],
  setCheckedSec: (checkedSec: SecondaryEmotion[]) => void,
  removeFromBag: (toRemove: string) => void
): (toRemove: SecondaryEmotion, parentEmotion: PrimaryEmotion) => void {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (toRemove: SecondaryEmotion, parentEmotion: PrimaryEmotion) => {
    const checked = new Set(checkedSec);
    if (checked.has(toRemove)) {
      checked.delete(toRemove);
      setCheckedSec(Array.from(checked));
      removeFromBag(SecondaryEmotion[toRemove]);
    }
  };
}

function getAddTer(
  checkedTer: TertiaryEmotion[],
  setCheckedTer: (checkedTer: TertiaryEmotion[]) => void,
  addToBag: (toAdd: string) => void
): (toAdd: TertiaryEmotion, parentEmotion: SecondaryEmotion) => void {
  return (toAdd: TertiaryEmotion) => {
    const checked = new Set(checkedTer);
    if (!checked.has(toAdd)) {
      checked.add(toAdd);
      setCheckedTer(Array.from(checked));
      addToBag(TertiaryEmotion[toAdd]);
    }
  };
}

function getRemoveTer(
  checkedTer: TertiaryEmotion[],
  setCheckedTer: (checkedTer: TertiaryEmotion[]) => void,
  removeFromBag: (toRemove: string) => void
): (toRemove: TertiaryEmotion, parentEmotion: SecondaryEmotion) => void {
  return (toRemove: TertiaryEmotion) => {
    const checked = new Set(checkedTer);
    if (checked.has(toRemove)) {
      checked.delete(toRemove);
      setCheckedTer(Array.from(checked));
      removeFromBag(TertiaryEmotion[toRemove]);
    }
  };
}

export function EmotionWrapperElement(
  props: RenderElementProps & dragHandleProps
): JSX.Element {
  const { attributes, children } = props;

  const [bag, setBag] = useState<string[]>([]);
  const addToBag = useCallback(
    (toAdd: string) => {
      const b = new Set(bag);
      if (!b.has(toAdd)) {
        b.add(toAdd);
        setBag(Array.from(b));
      }
    },
    [bag]
  );
  const removeFromBag = useCallback(
    (toRemove: string) => {
      const b = new Set(bag);
      if (b.has(toRemove)) {
        b.delete(toRemove);
        setBag(Array.from(b));
      }
    },
    [bag]
  );

  const [checkedPri, setCheckedPri] = useState<PrimaryEmotion[]>([]);
  const addPri = getAddPri(checkedPri, setCheckedPri, addToBag);
  const removePri = getRemovePri(checkedPri, setCheckedPri, removeFromBag);

  const getPrimaryElement = (
    emotion: PrimaryEmotion,
    secondaries: JSX.Element[]
  ) => {
    return (
      <PrimaryElement
        emotion={emotion}
        checkedPri={checkedPri}
        addPri={addPri}
        removePri={removePri}
      >
        {secondaries}
      </PrimaryElement>
    );
  };

  const [checkedSec, setCheckedSec] = useState<SecondaryEmotion[]>([]);
  const addSec = getAddSec(checkedSec, setCheckedSec, addToBag);
  const removeSec = getRemoveSec(checkedSec, setCheckedSec, removeFromBag);

  const getSecondaryElement = (
    emotion: SecondaryEmotion,
    parentEmotion: PrimaryEmotion,
    tertiaries: JSX.Element[]
  ) => {
    return (
      <SecondaryElement
        emotion={emotion}
        parentEmotion={parentEmotion}
        checkedSec={checkedSec}
        addSec={addSec}
        removeSec={removeSec}
        key={emotion}
      >
        {tertiaries}
      </SecondaryElement>
    );
  };

  const [checkedTer, setCheckedTer] = useState<TertiaryEmotion[]>([]);
  const addTer = getAddTer(checkedTer, setCheckedTer, addToBag);
  const removeTer = getRemoveTer(checkedTer, setCheckedTer, removeFromBag);

  const getTertiaryElement = (
    emotion: TertiaryEmotion,
    parentEmotion: SecondaryEmotion
  ) => {
    return (
      <TertiaryElement
        emotion={emotion}
        parentEmotion={parentEmotion}
        addTer={addTer}
        removeTer={removeTer}
        key={emotion}
      />
    );
  };

  const getSecondarySlice = (
    primaryEmotion: PrimaryEmotion,
    secondaryEmotion: SecondaryEmotion,
    tertiaryEmotion1: TertiaryEmotion,
    tertiaryEmotion2: TertiaryEmotion
  ) => {
    return getSecondaryElement(secondaryEmotion, primaryEmotion, [
      getTertiaryElement(tertiaryEmotion1, secondaryEmotion),
      getTertiaryElement(tertiaryEmotion2, secondaryEmotion),
    ]);
  };

  return (
    <ToolWrapper
      {...props}
      attributes={attributes}
      name="Emotion"
      icon={<IconToolEmotion />}
    >
      <div className={styles.grid} contentEditable={false}>
        <div className={styles.sectionWrapper}>
          <div className={styles.section}>
            <p className={styles.question}>
              For this decision, what emotions am I feeling?
            </p>
            <div className={styles.emotions}>
              {getPrimaryElement(PrimaryEmotion.Joy, [
                getSecondarySlice(
                  PrimaryEmotion.Joy,
                  SecondaryEmotion.Euphoric,
                  TertiaryEmotion.Jubilant,
                  TertiaryEmotion.Elated
                ),
                getSecondarySlice(
                  PrimaryEmotion.Joy,
                  SecondaryEmotion.Excited,
                  TertiaryEmotion.Zealous,
                  TertiaryEmotion.Enthusiastic
                ),
                getSecondarySlice(
                  PrimaryEmotion.Joy,
                  SecondaryEmotion.Optimistic,
                  TertiaryEmotion.Hopeful,
                  TertiaryEmotion.Eager
                ),
                getSecondarySlice(
                  PrimaryEmotion.Joy,
                  SecondaryEmotion.Proud,
                  TertiaryEmotion.Illustrious,
                  TertiaryEmotion.Triumphant
                ),
                getSecondarySlice(
                  PrimaryEmotion.Joy,
                  SecondaryEmotion.Cheerful,
                  TertiaryEmotion.Playful,
                  TertiaryEmotion.Amused
                ),
                getSecondarySlice(
                  PrimaryEmotion.Joy,
                  SecondaryEmotion.Happy,
                  TertiaryEmotion.Delighted,
                  TertiaryEmotion.Jovial
                ),
                getSecondarySlice(
                  PrimaryEmotion.Joy,
                  SecondaryEmotion.Content,
                  TertiaryEmotion.Pleased,
                  TertiaryEmotion.Satisfied
                ),
                getSecondarySlice(
                  PrimaryEmotion.Joy,
                  SecondaryEmotion.Peaceful,
                  TertiaryEmotion.Serene,
                  TertiaryEmotion.Tranquil
                ),
              ])}
              {getPrimaryElement(PrimaryEmotion.Surprise, [
                getSecondarySlice(
                  PrimaryEmotion.Surprise,
                  SecondaryEmotion.Moved,
                  TertiaryEmotion.Touched,
                  TertiaryEmotion.Stimulated
                ),
                getSecondarySlice(
                  PrimaryEmotion.Surprise,
                  SecondaryEmotion.Overcome,
                  TertiaryEmotion.Astounded,
                  TertiaryEmotion.Speechless
                ),
                getSecondarySlice(
                  PrimaryEmotion.Surprise,
                  SecondaryEmotion.Amazed,
                  TertiaryEmotion.Awed,
                  TertiaryEmotion.Astonished
                ),
                getSecondarySlice(
                  PrimaryEmotion.Surprise,
                  SecondaryEmotion.Confused,
                  TertiaryEmotion.Perplexed,
                  TertiaryEmotion.Disillusioned
                ),
                getSecondarySlice(
                  PrimaryEmotion.Surprise,
                  SecondaryEmotion.Stunned,
                  TertiaryEmotion.Bewildered,
                  TertiaryEmotion.Shocked
                ),
              ])}
              {getPrimaryElement(PrimaryEmotion.Sadness, [
                getSecondarySlice(
                  PrimaryEmotion.Sadness,
                  SecondaryEmotion.Gloomy,
                  TertiaryEmotion.Depressed,
                  TertiaryEmotion.Hopeless
                ),
                getSecondarySlice(
                  PrimaryEmotion.Sadness,
                  SecondaryEmotion.Lonely,
                  TertiaryEmotion.Neglected,
                  TertiaryEmotion.Isolated
                ),
                getSecondarySlice(
                  PrimaryEmotion.Sadness,
                  SecondaryEmotion.Shameful,
                  TertiaryEmotion.Guilty,
                  TertiaryEmotion.Regretful
                ),
                getSecondarySlice(
                  PrimaryEmotion.Sadness,
                  SecondaryEmotion.Disappointed,
                  TertiaryEmotion.Displeased,
                  TertiaryEmotion.Dismayed
                ),
                getSecondarySlice(
                  PrimaryEmotion.Sadness,
                  SecondaryEmotion.Unhappy,
                  TertiaryEmotion.Disheartened,
                  TertiaryEmotion.Miserable
                ),
                getSecondarySlice(
                  PrimaryEmotion.Sadness,
                  SecondaryEmotion.Hurt,
                  TertiaryEmotion.Disturbed,
                  TertiaryEmotion.Agonized
                ),
              ])}
              {getPrimaryElement(PrimaryEmotion.Anger, [
                getSecondarySlice(
                  PrimaryEmotion.Anger,
                  SecondaryEmotion.Disgusted,
                  TertiaryEmotion.Revolted,
                  TertiaryEmotion.Contemptuous
                ),
                getSecondarySlice(
                  PrimaryEmotion.Anger,
                  SecondaryEmotion.Jealous,
                  TertiaryEmotion.Envious,
                  TertiaryEmotion.Resentful
                ),
                getSecondarySlice(
                  PrimaryEmotion.Anger,
                  SecondaryEmotion.Irritable,
                  TertiaryEmotion.Aggravated,
                  TertiaryEmotion.Annoyed
                ),
                getSecondarySlice(
                  PrimaryEmotion.Anger,
                  SecondaryEmotion.Exasperated,
                  TertiaryEmotion.Frustrated,
                  TertiaryEmotion.Agitated
                ),
                getSecondarySlice(
                  PrimaryEmotion.Anger,
                  SecondaryEmotion.Enraged,
                  TertiaryEmotion.Hostile,
                  TertiaryEmotion.Hateful
                ),
              ])}
              {getPrimaryElement(PrimaryEmotion.Fear, [
                getSecondarySlice(
                  PrimaryEmotion.Fear,
                  SecondaryEmotion.Horrified,
                  TertiaryEmotion.Dreadful,
                  TertiaryEmotion.Mortified
                ),
                getSecondarySlice(
                  PrimaryEmotion.Fear,
                  SecondaryEmotion.Nervous,
                  TertiaryEmotion.Anxious,
                  TertiaryEmotion.Worried
                ),
                getSecondarySlice(
                  PrimaryEmotion.Fear,
                  SecondaryEmotion.Insecure,
                  TertiaryEmotion.Inadequate,
                  TertiaryEmotion.Inferior
                ),
                getSecondarySlice(
                  PrimaryEmotion.Fear,
                  SecondaryEmotion.Terrified,
                  TertiaryEmotion.Hysterical,
                  TertiaryEmotion.Panicked
                ),
                getSecondarySlice(
                  PrimaryEmotion.Fear,
                  SecondaryEmotion.Scared,
                  TertiaryEmotion.Helpless,
                  TertiaryEmotion.Frightened
                ),
              ])}
              {getPrimaryElement(PrimaryEmotion.Love, [
                getSecondarySlice(
                  PrimaryEmotion.Love,
                  SecondaryEmotion.Grateful,
                  TertiaryEmotion.Thankful,
                  TertiaryEmotion.Appreciative
                ),
                getSecondarySlice(
                  PrimaryEmotion.Love,
                  SecondaryEmotion.Sentimental,
                  TertiaryEmotion.Nostalgic,
                  TertiaryEmotion.Tender
                ),
                getSecondarySlice(
                  PrimaryEmotion.Love,
                  SecondaryEmotion.Affectionate,
                  TertiaryEmotion.Compassionate,
                  TertiaryEmotion.Warmhearted
                ),
                getSecondarySlice(
                  PrimaryEmotion.Love,
                  SecondaryEmotion.Romantic,
                  TertiaryEmotion.Enamored,
                  TertiaryEmotion.Passionate
                ),
                getSecondarySlice(
                  PrimaryEmotion.Love,
                  SecondaryEmotion.Enchanted,
                  TertiaryEmotion.Rapturous,
                  TertiaryEmotion.Enthralled
                ),
              ])}
            </div>
          </div>
        </div>
        <div className={styles.suggestion}>
          <h3 className={styles.suggestionLabel}>My Emotions</h3>
          <Emotions bag={bag} />
        </div>
      </div>
      {children}
    </ToolWrapper>
  );
}

interface PrimaryElementProps {
  emotion: PrimaryEmotion;

  checkedPri: PrimaryEmotion[];
  addPri: (pri: PrimaryEmotion) => void;
  removePri: (pri: PrimaryEmotion) => void;

  children: React.ReactNode;
}

function PrimaryElement(props: PrimaryElementProps): JSX.Element | null {
  const { emotion, checkedPri, addPri, removePri, children } = props;

  const isChecked = new Set(checkedPri).has(emotion);

  const getEmoji = (e: PrimaryEmotion) => {
    switch (e) {
      case PrimaryEmotion.Joy:
        return '😊';
      case PrimaryEmotion.Surprise:
        return '❗';
      case PrimaryEmotion.Sadness:
        return '😢';
      case PrimaryEmotion.Anger:
        return '🌪️';
      case PrimaryEmotion.Fear:
        return '👹';
      case PrimaryEmotion.Love:
        return '❤️';
      default:
        return null;
    }
  };

  return (
    <>
      <label className={styles.button}>
        <input
          className={styles.input}
          type="checkbox"
          name="primary"
          value={emotion}
          onChange={(e) => {
            if (e.target.checked) {
              addPri(emotion);
            } else {
              removePri(emotion);
            }
          }}
        />
        <span>
          {getEmoji(emotion)} {PrimaryEmotion[emotion]}
        </span>
      </label>
      <div>{isChecked ? children : null}</div>
    </>
  );
}

interface SecondaryElementProps {
  emotion: SecondaryEmotion;
  parentEmotion: PrimaryEmotion;

  checkedSec: SecondaryEmotion[];
  addSec: (sec: SecondaryEmotion, parentEmotion: PrimaryEmotion) => void;
  removeSec: (sec: SecondaryEmotion, parentEmotion: PrimaryEmotion) => void;

  children: React.ReactNode;
}

function SecondaryElement(props: SecondaryElementProps): JSX.Element | null {
  const {
    emotion,
    parentEmotion,
    checkedSec,
    addSec,
    removeSec,
    children,
  } = props;

  const isChecked = new Set(checkedSec).has(emotion);

  return (
    <div className={styles.secondary}>
      <label className={styles.button}>
        <input
          className={styles.input}
          type="checkbox"
          name="secondary"
          value={emotion}
          onChange={(e) => {
            if (e.target.checked) {
              addSec(emotion, parentEmotion);
            } else {
              removeSec(emotion, parentEmotion);
            }
          }}
        />
        <span>{SecondaryEmotion[emotion]}</span>
      </label>
      <div>{isChecked ? children : null}</div>
    </div>
  );
}

interface TertiaryElementProps {
  emotion: TertiaryEmotion;
  parentEmotion: SecondaryEmotion;

  addTer: (ter: TertiaryEmotion, parentEmotion: SecondaryEmotion) => void;
  removeTer: (ter: TertiaryEmotion, parentEmotion: SecondaryEmotion) => void;
}

function TertiaryElement(props: TertiaryElementProps): JSX.Element | null {
  const { emotion, parentEmotion, addTer, removeTer } = props;

  return (
    <div className={styles.tertiary}>
      <label className={styles.button}>
        <input
          className={styles.input}
          type="checkbox"
          name="tertiary"
          value={emotion}
          onChange={(e) => {
            if (e.target.checked) {
              addTer(emotion, parentEmotion);
            } else {
              removeTer(emotion, parentEmotion);
            }
          }}
        />
        <span>{TertiaryEmotion[emotion]}</span>
      </label>
    </div>
  );
}

interface EmotionsProps {
  bag: string[];
}

function Emotions(props: EmotionsProps): JSX.Element | null {
  const { bag } = props;

  return (
    <div className={styles.emotionsOutput}>
      {bag.map((word) => {
        return (
          <div className={styles.bagWord} key={word}>
            {word}
          </div>
        );
      })}
    </div>
  );
}

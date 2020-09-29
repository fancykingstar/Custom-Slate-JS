import { Editor, Element, NodeEntry, Path, Transforms } from 'slate';

import { reduceDisabled } from 'components/editor/Sensitivity';
import { stringifyTitleEntry } from 'components/editor/queries';

export enum Magic {
  Disabled = 'disabled',
  Off = 'off',
  Ready = 'ready',
  Started = 'started',
}

export function isMagical(
  element: Element,
  entries: NodeEntry<Element>[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readyToGenerate: () => [boolean, any]
): Magic {
  if (element.magicStarted) {
    return Magic.Started;
  }

  const [ready] = readyToGenerate();

  if (ready) {
    const disabled: boolean = entries.reduce(reduceDisabled, false);
    if (disabled) {
      return Magic.Disabled;
    }
    return Magic.Ready;
  }

  return Magic.Off;
}

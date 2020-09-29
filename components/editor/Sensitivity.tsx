import nlp from 'compromise';
import {
  Editor,
  Element,
  Node,
  NodeEntry,
  Path,
  Text,
  Transforms,
} from 'slate';
import stemmer from 'stemmer';

import { ContextType } from 'components/context';
import { Author } from 'components/editor/author';
import { getFirstTextChild } from 'components/editor/queries';
import { classifySensitive } from 'components/intelligence/generator';
import { sensitiveStems } from 'components/intelligence/sensitiveWords';

export enum Sensitivity {
  Ok = 'ok',
  Sensitive = 'sensitive',
  Unknown = 'unknown',
}

export interface SensitivityContext {
  sensitivity: Sensitivity;
  text: string;
}

export type SensitivityNode = Node & {
  sensitivityContext?: SensitivityContext;
};

const jsonOptions = {
  normal: true,
  reduced: true,
  text: true,
  trim: true,
  terms: {
    clean: true,
    normal: true,
    offset: true,
    text: true,
  },
};

function containsSensitiveWords(s: string): boolean {
  const doc = nlp(s);
  const phrases = doc.terms().json(jsonOptions);

  for (let i = 0; i < phrases.length; i += 1) {
    const phrase = phrases[i];
    for (let j = 0; j < phrase.terms.length; j += 1) {
      const term = phrase.terms[j];
      const stem = stemmer(term.clean);
      if (sensitiveStems.has(stem)) {
        return true;
      }
    }
  }

  return false;
}

function getCachedSensitivity(node: SensitivityNode): Sensitivity {
  if (!node.sensitivityContext) {
    return Sensitivity.Unknown;
  }

  const sensitivityContext = node.sensitivityContext as SensitivityContext;
  const textNode = getFirstTextChild(node as Node);

  if (textNode == null) {
    return Sensitivity.Unknown;
  }

  if (textNode.text.trim() === sensitivityContext.text) {
    return sensitivityContext.sensitivity;
  }

  return Sensitivity.Unknown;
}

function cacheSensitivityContext(
  editor: Editor,
  sensitivityContext: SensitivityContext,
  path: Path
): void {
  Transforms.setNodes(editor, { sensitivityContext }, { at: path });
}

export function checkAndGenerateSensitivity(
  editor: Editor,
  context: ContextType,
  text: string,
  path: Path
): Promise<Sensitivity> {
  const [node] = Editor.node(editor, path);

  const cachedSensitivity = getCachedSensitivity(node as SensitivityNode);
  if (cachedSensitivity !== Sensitivity.Unknown) {
    return Promise.resolve(cachedSensitivity);
  }

  return new Promise((resolve, reject) => {
    classifySensitive(context, text).then(
      (val: boolean) => {
        const sensitivity = val ? Sensitivity.Sensitive : Sensitivity.Ok;
        cacheSensitivityContext(editor, { sensitivity, text }, path);

        resolve(sensitivity);
      },
      (err) => {
        resolve(Sensitivity.Unknown);
      }
    );
  });
}

export function reduceDisabled(
  prevDisabled: boolean,
  nodeEntry: NodeEntry<Element>
): boolean {
  if (prevDisabled) {
    return true;
  }

  const [node] = nodeEntry;
  const textNode = getFirstTextChild(node);
  if (textNode == null) {
    // Aggressively disable generation if doc structure is unexpected.
    return true;
  }

  const text = textNode.text.trim();
  if (containsSensitiveWords(text)) {
    return true;
  }

  if (getCachedSensitivity(node as SensitivityNode) === Sensitivity.Sensitive) {
    return true;
  }

  return false;
}

export async function reduceSensitivity(
  editor: Editor,
  context: ContextType,
  prev: Promise<Sensitivity> | null,
  nodeEntry: NodeEntry<Element>
): Promise<Sensitivity> {
  const handleCurrent = async () => {
    const [node, path] = nodeEntry;

    const textNode = getFirstTextChild(node);
    if (textNode == null) {
      return Promise.resolve(Sensitivity.Unknown);
    }

    const text = textNode.text.trim();
    if (text === '') {
      return Promise.resolve(Sensitivity.Ok);
    }

    return checkAndGenerateSensitivity(editor, context, text, path);
  };

  if (prev == null) {
    return handleCurrent();
  }

  return prev.then((prevSensitivity) => {
    if (prevSensitivity !== Sensitivity.Ok) {
      return Promise.resolve(prevSensitivity);
    }

    return handleCurrent();
  });
}

function magicOn(editor: Editor, path: Path): void {
  Transforms.setNodes(editor, { magicStarted: true }, { at: path });
}

function magicOff(editor: Editor, path: Path): void {
  Transforms.setNodes(editor, { magicStarted: false }, { at: path });
}

export function generateString(
  editor: Editor,
  context: ContextType,
  path: Path,
  entries: NodeEntry<Element>[],
  generator: () => Promise<string>
): void {
  const parentPath = path.slice(0, path.length - 1);

  magicOn(editor, parentPath);

  entries
    .reduce(
      reduceSensitivity.bind(null, editor, context),
      Promise.resolve(Sensitivity.Ok)
    )
    .then(
      (sensitivity) => {
        if (sensitivity !== Sensitivity.Ok) {
          magicOff(editor, parentPath);
          return;
        }

        generator().then(
          (generated: string) => {
            const trimmed = generated.trim();
            magicOff(editor, parentPath);
            Transforms.setNodes(
              editor,
              { text: '', author: Author.Deca, original: trimmed },
              { at: path }
            );
            Transforms.insertText(editor, trimmed, { at: path });
          },
          (err) => {
            magicOff(editor, parentPath);
          }
        );
      },
      (err) => {
        magicOff(editor, parentPath);
      }
    );
}

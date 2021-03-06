import {
  Ancestor,
  Descendant,
  Editor,
  Element,
  Node,
  NodeEntry,
  Path,
  Range,
  Location,
  Text,
} from 'slate';

import { ReservedElement } from 'components/elements/ReservedElement';

/**
 * Returns nodes of the requested type at the current selection.
 */
export function getNodesWithType(
  editor: Editor,
  type: string
): NodeEntry<Node>[] {
  const { selection } = editor;
  if (selection == null) {
    return [];
  }

  let newSelection = selection;
  if (Range.isRange(selection)) {
    newSelection = Editor.unhangRange(editor, selection);
  }

  const nodes = Editor.nodes(editor, {
    match: (n) => n.type === type,
    at: newSelection,
  });
  return Array.from(nodes);
}

/**
 * Returns all nodes of the requested type.
 */
export function getAllNodesWithType(
  editor: Editor,
  type: string
): NodeEntry<Node>[] {
  return Array.from(
    Editor.nodes(editor, {
      at: [],
      match: (n: Node) => n.type === type,
    })
  );
}

/**
 * Returns title string.
 */
export function getTitleEntry(editor: Editor): NodeEntry<Element> | null {
  const entries: NodeEntry<Node>[] = Array.from(
    Editor.nodes(editor, {
      at: [],
      match: (n: Node) => n.type === ReservedElement.Title,
    })
  );

  if (!entries.length) {
    return null;
  }

  return entries[0] as NodeEntry<Element>;
}

export function stringifyTitleEntry(titleEntry: NodeEntry<Element>): string {
  if (titleEntry == null) {
    return '';
  }

  const [node] = titleEntry;
  if (!node.children.length || !Text.isText(node.children[0])) {
    return '';
  }

  return node.children[0].text;
}

/**
 * Returns all non-empty text nodes in the editor.
 */
export function getAllTextNodes(editor: Editor): NodeEntry<Node>[] {
  const nodes = Editor.nodes(editor, {
    at: [],
    match: (n: Node) => Text.isText(n) && n.text !== '',
  });
  return Array.from(nodes);
}

/**
 * Returns true if node at location is the given type.
 */
export function nodeIsType(editor: Editor, type: string): boolean {
  const [match] = getNodesWithType(editor, type);
  return match != null;
}

/**
 * Gets the nearest block ancestor (parent, grandparent, etc.) above the current selection.
 */
export function getBlockAbove(editor: Editor): NodeEntry<Ancestor> {
  return (
    Editor.above(editor, {
      match: (n) => Editor.isBlock(editor, n),
    }) || [editor, []]
  );
}

/**
 * Returns true if an ancestor (parent, grandparent, etc.) are empty (no text or inline children).
 */
export function isAncestorEmpty(editor: Editor, ancestor: Ancestor): boolean {
  return (
    !Node.string(ancestor).length &&
    !ancestor.children.some((n) => Editor.isInline(editor, n))
  );
}

/**
 * Returns true if the nearest block ancestor (parent, grandparent, etc.) is empty.
 */
export function isBlockAboveEmpty(editor: Editor): boolean {
  const blockEntry = getBlockAbove(editor);
  const [block] = blockEntry;
  return isAncestorEmpty(editor, block);
}

/**
 * Get the block above (parent to) a location by a given type.
 */
export function getAboveWithType(
  editor: Editor,
  type: string
): NodeEntry<Node> | undefined {
  if (editor.selection == null) {
    return undefined;
  }

  return Editor.above(editor, {
    match: (n) => n.type === type,
    at: editor.selection,
  });
}

/**
 * Returns true if the current selection's focus is at the start of the current location.
 */
export function isSelectionAtBlockStart(editor: Editor): boolean {
  const [, path] = getBlockAbove(editor);
  if (editor.selection == null) {
    return false;
  }

  return Editor.isStart(editor, editor.selection.focus, path);
}

/**
 * Returns true if the given Slate 'Range' is a root node.
 *
 * A location is at root if its path is only two indices long (e.g., [0, 0])
 */
export function isRangeAtRoot(range: Range): boolean {
  return range.anchor.path.length === 2 || range.focus.path.length === 2;
}

/**
 * Get sibling nodes after a given node (located by a path).
 */
export function getNextSiblingNodes(
  ancestor: NodeEntry<Ancestor>,
  path: Path
): Descendant[] {
  const [node, nodePath] = ancestor;
  const leafIndex = path[nodePath.length];

  const siblingNodes: Descendant[] = [];
  if (leafIndex + 1 < node.children.length) {
    for (let i = leafIndex + 1; i < node.children.length; i += 1) {
      siblingNodes.push(node.children[i]);
    }
  }

  return siblingNodes;
}

/**
 * Returns true if the content after the current selection is empty.
 */
export function isBlockTextEmptyAfterSelection(editor: Editor): boolean {
  if (editor.selection == null) {
    return false;
  }

  const caret = editor.selection.focus;
  const parent = Editor.parent(editor, editor.selection);
  if (parent == null) {
    return false;
  }
  const [, parentPath] = parent;

  // Check if there's content after the caret in the current node
  if (!Editor.isEnd(editor, caret, parentPath)) {
    return false;
  }

  // Get the encompassing block (e.g., the paragraph)
  const blockAbove = Editor.above(editor, {
    match: (n) => Editor.isBlock(editor, n),
  });
  if (blockAbove == null) {
    return false;
  }

  // If there are nested siblings to the list item, check if they have content
  const siblingNodes = getNextSiblingNodes(blockAbove, caret.path);
  if (siblingNodes.length) {
    const siblingWithText = siblingNodes.find((n) => n.text != null);
    if (siblingWithText != null) {
      return false;
    }
  }

  return true;
}

/**
 * Returns true if given path is the first child of the parent.
 */
export function isFirstChild(path: Path): boolean {
  return path[path.length - 1] === 0;
}

/**
 * Returns true in first tuple item if the slate tree from selection
 * matches the given sequence.
 */
export function doesSlateTreeMatchSequence(
  editor: Editor,
  sequence: string[]
): [boolean, NodeEntry[]] {
  const { selection } = editor;
  if (selection == null) {
    return [false, []];
  }

  const entries: NodeEntry[] = [];
  let matches = true;
  let path: Location = selection;

  if (isRangeAtRoot(path)) {
    return [false, entries];
  }

  sequence.forEach((type) => {
    const entry = Editor.parent(editor, path);
    const [node, nodePath] = entry;
    if (node.type !== type) {
      matches = false;
    }
    entries.push(entry);
    path = nodePath;
  });

  return [matches, entries];
}

/**
 * Returns true if the given node is an empty Element.
 */
export function isEmptyElement(node: Node): boolean {
  if (!Element.isElement(node)) {
    return false;
  }

  const children = node.children as Node[];

  return (
    children.length === 1 && Text.isText(children[0]) && children[0].text === ''
  );
}

export function getFirstTextChild(node: Node): Text | null {
  if (!Element.isElement(node) || !node.children.length) {
    return null;
  }

  const child = node.children[0];
  if (!Text.isText(child)) {
    return null;
  }

  return child;
}

export function getFirstTextString(nodeEntry: NodeEntry<Node>): string {
  const [node] = nodeEntry;
  const child = getFirstTextChild(node);
  if (child == null) {
    return '';
  }

  return child.text.trim();
}

/**
 * Returns true if the given path points to a top-level node.
 */
export function isTopLevelPath(path: Path): boolean {
  return path.length === 2;
}

/**
 * Returns true if the selection is in the given element types and the text is empty.
 */
export function isTypeAndEmpty(
  editor: Editor,
  wrapperType: string,
  itemType: string
): [boolean, Path | null] {
  const { selection } = editor;
  if (selection == null || isRangeAtRoot(selection)) {
    return [false, null];
  }

  // Do nothing if we're not in the Goals tool
  const wrapperEntry = Editor.above(editor, {
    match: (n) => n.type === wrapperType,
  });
  if (wrapperEntry == null) {
    return [false, null];
  }

  const path = selection.focus?.path;
  if (!path || !path.length) {
    return [false, null];
  }

  const [currentNode] = Editor.node(editor, path);

  if (!currentNode || !Text.isText(currentNode) || currentNode.text !== '') {
    return [false, null];
  }

  const parentPath = path.slice(0, path.length - 1);
  const [parentNode] = Editor.node(editor, parentPath);

  if (!parentNode || parentNode.type !== itemType) {
    return [false, null];
  }

  return [true, path];
}

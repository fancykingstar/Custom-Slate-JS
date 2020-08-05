import { Node } from 'slate';
import { ListElements, BasicElement } from 'components/elements/Element';

/**
 * Returns true if the given node is a list element.
 */
export default function isList(node: Node): boolean {
  if (node.type == null) {
    return false;
  }

  return ListElements.includes(node.type as BasicElement);
}

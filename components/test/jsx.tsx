import { createHyperscript } from 'slate-hyperscript';
import { BaseElement } from '../Element';

export default createHyperscript({
  elements: {
    block: {},
    inline: { inline: true },
    ol: { type: BaseElement.OrderedList },
    ul: { type: BaseElement.UnorderedList },
    li: { type: BaseElement.ListItem },
    p: { type: BaseElement.Paragraph, children: [{ text: '' }] },
  },
});

import { createHyperscript } from 'slate-hyperscript';
import { BasicElement } from '../elements/Element';
import { ChoicesElement } from '../elements/Choices/ChoicesElement';

export default createHyperscript({
  elements: {
    block: {},
    inline: { inline: true },
    ol: { type: BasicElement.OrderedList },
    ul: { type: BasicElement.UnorderedList },
    li: { type: BasicElement.ListItem },
    p: { type: BasicElement.Paragraph },
    choicesWrapper: { type: ChoicesElement.Wrapper },
    choicesItem: { type: ChoicesElement.Item },
    choicesItemTitle: { type: ChoicesElement.ItemTitle },
  },
});

import { createHyperscript } from 'slate-hyperscript';
import { BasicElement } from 'components/elements/Element';
import { ChoicesElement } from 'components/elements/Choices/ChoicesElement';
import { CriteriaElement } from 'components/elements/Criteria/CriteriaElement';
import { GoalsElement } from 'components/elements/Goals/GoalsElement';

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
    goalsWrapper: { type: GoalsElement.Wrapper },
    goalsItem: { type: GoalsElement.Item },
    goalsItemTitle: { type: GoalsElement.ItemTitle },
    criteriaWrapper: { type: CriteriaElement.Wrapper },
    criteriaItem: { type: CriteriaElement.Item },
    criteriaItemTitle: { type: CriteriaElement.ItemTitle },
  },
});

import { createHyperscript } from 'slate-hyperscript';
import { BasicElement, ReservedElement } from 'components/elements/Element';
import { ChoicesElement } from 'components/elements/Choices/ChoicesElement';
import { CriteriaElement } from 'components/elements/Criteria/CriteriaElement';
import { GoalsElement } from 'components/elements/Goals/GoalsElement';
import { InversionElement } from 'components/elements/Inversion/InversionElement';
import { SimulationElement } from 'components/elements/Simulation/SimulationElement';

export default createHyperscript({
  elements: {
    block: {},
    inline: { inline: true },
    ol: { type: BasicElement.OrderedList },
    ul: { type: BasicElement.UnorderedList },
    li: { type: BasicElement.ListItem },
    p: { type: BasicElement.Paragraph },
    title: { type: ReservedElement.Title },
    choicesWrapper: { type: ChoicesElement.Wrapper },
    choicesItem: { type: ChoicesElement.Item },
    choicesItemTitle: { type: ChoicesElement.ItemTitle },
    goalsWrapper: { type: GoalsElement.Wrapper },
    goalsItem: { type: GoalsElement.Item },
    goalsItemTitle: { type: GoalsElement.ItemTitle },
    criteriaWrapper: { type: CriteriaElement.Wrapper },
    criteriaItem: { type: CriteriaElement.Item },
    criteriaItemTitle: { type: CriteriaElement.ItemTitle },
    inversionWrapper: { type: InversionElement.Wrapper },
    inversionItem: { type: InversionElement.Item },
    inversionItemTitle: { type: InversionElement.ItemTitle },
    inversionSublist: { type: InversionElement.ItemSublist },
    inversionSublistItem: { type: InversionElement.ItemSublistItem },
    inversionSublistItemParagraph: {
      type: InversionElement.ItemSublistItemParagraph,
    },
    simulation: { type: SimulationElement.Tool },
    simulationChoice: { type: SimulationElement.Choice },
    simulationItem: { type: SimulationElement.Item },
  },
});

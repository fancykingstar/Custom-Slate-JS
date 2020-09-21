import { createHyperscript } from 'slate-hyperscript';
import { BasicElement } from 'components/elements/Element';
import { ReservedElement } from 'components/elements/ReservedElement';
import { ChoicesType } from 'components/elements/Choices/ChoicesType';
import { DataElement } from 'components/elements/Data/DataElement';
import { ConclusionElement } from 'components/elements/Conclusion/ConclusionElement';
import { GoalsElement } from 'components/elements/Goals/GoalsElement';
import { InversionElement } from 'components/elements/Inversion/InversionElement';
import { PeopleElement } from 'components/elements/People/PeopleElement';
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
    choicesWrapper: { type: ChoicesType.Wrapper },
    choicesItem: { type: ChoicesType.Item },
    choicesItemTitle: { type: ChoicesType.ItemTitle },
    conclusionWrapper: { type: ConclusionElement.Wrapper },
    conclusionItem: { type: ConclusionElement.Item },
    conclusionItemTitle: { type: ConclusionElement.ItemTitle },
    data: { type: DataElement.Tool },
    dataCategory: { type: DataElement.Category },
    dataItem: { type: DataElement.Item },
    goalsWrapper: { type: GoalsElement.Wrapper },
    goalsItem: { type: GoalsElement.Item },
    goalsItemTitle: { type: GoalsElement.ItemTitle },
    inversionWrapper: { type: InversionElement.Wrapper },
    inversionItem: { type: InversionElement.Item },
    inversionItemTitle: { type: InversionElement.ItemTitle },
    inversionSublist: { type: InversionElement.ItemSublist },
    inversionSublistItem: { type: InversionElement.ItemSublistItem },
    inversionSublistItemParagraph: {
      type: InversionElement.ItemSublistItemParagraph,
    },
    people: { type: PeopleElement.Tool },
    peopleTeam: { type: PeopleElement.Team },
    peopleItem: { type: PeopleElement.Item },
    simulation: { type: SimulationElement.Tool },
    simulationChoice: { type: SimulationElement.Choice },
    simulationItem: { type: SimulationElement.Item },
  },
});

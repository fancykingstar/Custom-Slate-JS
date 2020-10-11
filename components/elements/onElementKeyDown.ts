import { Editor } from 'slate';

import { ContextType } from 'components/context';
import onKeyDownList from 'components/elements/List/onKeyDownList';
import onKeyDownChoices from 'components/elements/Choices/onKeyDownChoices';
import onKeyDownData from 'components/elements/Data/onKeyDownData';
import onKeyDownConclusion from 'components/elements/Conclusion/onKeyDownConclusion';
import onKeyDownGoals from 'components/elements/Goals/onKeyDownGoals';
import onKeyDownInversion from 'components/elements/Inversion/onKeyDownInversion';
import onKeyDownIssueTree from 'components/elements/IssueTree/onKeyDownIssueTree';
import onKeyDownPeople from 'components/elements/People/onKeyDownPeople';
import onKeyDownSimulation from 'components/elements/Simulation/onKeyDownSimulation';

export default function onElementKeyDown(
  editor: Editor,
  context: ContextType | null,
  event: KeyboardEvent
): void {
  if (onKeyDownList(editor, event)) {
    return;
  }
  if (onKeyDownChoices(editor, context, event)) {
    return;
  }
  if (onKeyDownConclusion(editor, event)) {
    return;
  }
  if (onKeyDownData(editor, event)) {
    return;
  }
  if (onKeyDownGoals(editor, context, event)) {
    return;
  }
  if (onKeyDownInversion(editor, event)) {
    return;
  }
  if (onKeyDownIssueTree(editor, event)) {
    return;
  }
  if (onKeyDownPeople(editor, event)) {
    return;
  }
  onKeyDownSimulation(editor, event);
}

import { Editor } from 'slate';
import onKeyDownList from 'components/elements/List/List';
import onKeyDownChoices from 'components/elements/Choices/Choices';
import onKeyDownCriteria from 'components/elements/Criteria/Criteria';
import onKeyDownGoals from 'components/elements/Goals/Goals';
import onKeyDownInversion from 'components/elements/Inversion/onKeyDownInversion';
import onKeyDownSimulation from 'components/elements/Simulation/onKeyDownSimulation';

export default function onElementKeyDown(
  editor: Editor,
  event: KeyboardEvent
): void {
  if (onKeyDownList(editor, event)) {
    return;
  }
  if (onKeyDownChoices(editor, event)) {
    return;
  }
  if (onKeyDownCriteria(editor, event)) {
    return;
  }
  if (onKeyDownGoals(editor, event)) {
    return;
  }
  if (onKeyDownInversion(editor, event)) {
    return;
  }
  onKeyDownSimulation(editor, event);
}

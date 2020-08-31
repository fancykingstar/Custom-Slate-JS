import { Editor } from 'slate';
import onKeyDownList from 'components/elements/List/onKeyDownList';
import onKeyDownChoices from 'components/elements/Choices/onKeyDownChoices';
import onKeyDownConclusion from 'components/elements/Conclusion/onKeyDownConclusion';
import onKeyDownGoals from 'components/elements/Goals/onKeyDownGoals';
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
  if (onKeyDownConclusion(editor, event)) {
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

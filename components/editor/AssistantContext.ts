import { createContext } from 'react';
import { Editor } from 'slate';

export type AssistantAction = (editor: Editor) => void;

interface AssistantContextType {
  actions: AssistantAction[];
  setActions: (actions: AssistantAction[]) => void;
}

const AssistantContext = createContext<AssistantContextType>({
  actions: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setActions: (actions: AssistantAction[]) => {
    // No-op.
  },
});

export default AssistantContext;

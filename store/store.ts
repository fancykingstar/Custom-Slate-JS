/* eslint-disable no-case-declarations */
import { createContext, Dispatch } from 'react';
import { Node } from 'slate';
import { v4 as uuidv4 } from 'uuid';

import { BasicElement } from 'components/elements/Element';
import { ReservedElement } from 'components/elements/ReservedElement';

export enum DocStatus {
  Incomplete,
  Complete,
}

export interface Doc {
  id: string;
  title: string;
  lastUpdated: number;
  creationDate: number;
  content: Node[];
  status: DocStatus;
}

export enum Action {
  initState = 'initState',
  setSidebarVisible = 'setSidebarVisible',
  setActiveDocId = 'setActiveDocId',
  setDoc = 'setDoc',
  createNewDoc = 'createNewDoc',
  setShowStarBar = 'showStarBar',
}

type ActionType =
  | { type: Action.initState; state: State }
  | { type: Action.setSidebarVisible; visible: boolean }
  | { type: Action.setActiveDocId; docId: string }
  | {
      type: Action.setDoc;
      docId: string;
      content?: Node[];
      status?: DocStatus;
    }
  | {
      type: Action.createNewDoc;
    }
  | { type: Action.setShowStarBar; showStarBar: boolean };

export interface State {
  sidebarVisible: boolean;
  activeDocId: string | null;
  docs: Doc[];
  showStarBar: boolean;
}

export function reducer(state: State, action: ActionType): State {
  let newState = state;

  switch (action.type) {
    case Action.initState:
      return action.state;
    case Action.setSidebarVisible:
      newState = {
        ...newState,
        sidebarVisible: action.visible,
      };
      break;
    case Action.setActiveDocId:
      newState = {
        ...newState,
        activeDocId: action.docId,
      };
      break;
    case Action.setDoc:
      const { docs } = state;
      const docIndex = docs.findIndex((doc) => doc.id === action.docId);
      const docsCopy = [...docs];

      // If the doc exists, update it
      if (docIndex > -1) {
        const newTitle = (action.content?.[0]?.children as Node[])?.[0]
          ?.text as string;

        docsCopy[docIndex] = {
          ...docsCopy[docIndex],
          title: newTitle ?? docsCopy[docIndex].title,
          lastUpdated: Date.now(),
          content: action.content ?? docsCopy[docIndex].content,
          status: action.status ?? docsCopy[docIndex].status,
        };
      }

      newState = {
        ...newState,
        docs: docsCopy,
      };
      break;
    case Action.createNewDoc:
      const newId = uuidv4().toString();
      newState = {
        ...newState,
        activeDocId: newId,
        docs: [
          ...state.docs,
          {
            id: newId,
            title: '',
            lastUpdated: Date.now(),
            creationDate: Date.now(),
            content: [
              {
                type: ReservedElement.Title,
                children: [{ text: '' }],
              },
              {
                type: BasicElement.Paragraph,
                children: [{ text: '' }],
              },
            ],
            status: DocStatus.Incomplete,
          },
        ],
      };
      break;
    case Action.setShowStarBar:
      newState = {
        ...newState,
        showStarBar: action.showStarBar,
      };
      break;
    default:
      // No-op
      break;
  }

  // Naively store full copy of reducer state in localstorage
  window.localStorage.setItem('state', JSON.stringify(newState));
  return newState;
}

export const Store = createContext<{
  state: State;
  dispatch: Dispatch<ActionType>;
}>({
  state: {} as State,
  dispatch: () => {
    // No-op
  },
});

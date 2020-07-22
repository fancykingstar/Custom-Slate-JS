import React, { useMemo, useState } from 'react'
import { createEditor, Node } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, withReact } from 'slate-react'
import {
  DEFAULTS_BOLD,
  DEFAULTS_HEADING,
  DEFAULTS_PARAGRAPH,
  DEFAULTS_ITALIC,
  DEFAULTS_UNDERLINE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from '@udecode/slate-plugins'
import {
  BoldPlugin,
  EditablePlugins,
  ExitBreakPlugin,
  HeadingPlugin,
  ItalicPlugin,
  ParagraphPlugin,
  UnderlinePlugin,
} from '@udecode/slate-plugins'
import {
  HeadingToolbar,
  ToolbarElement,
  SlateDocument,
  pipe,
} from '@udecode/slate-plugins'
import {
  Looks3,
  Looks4,
  Looks5,
  Looks6,
  LooksOne,
  LooksTwo,
} from '@styled-icons/material'

const headingTypes = [
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
]

const initialValue: Node[] = [
  {
    type: DEFAULTS_PARAGRAPH.p.type,
    children: [
      {
        text: 'This text is bold, italic and underlined.',
        [DEFAULTS_BOLD.bold.type]: true,
        [DEFAULTS_ITALIC.italic.type]: true,
        [DEFAULTS_UNDERLINE.underline.type]: true,
      },
    ],
  }
]

const plugins = [
  ExitBreakPlugin({
    rules: [
      {
        hotkey: 'enter',
        query: {
          start: true,
          end: true,
          allow: headingTypes,
        },
      },
    ],
  }),
  ParagraphPlugin(),
  BoldPlugin(),
  HeadingPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
]

const withPlugins = [withReact, withHistory] as const

export const Editor = () => {
  const [value, setValue] = useState(initialValue)

  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), [])

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={newValue => setValue(newValue as SlateDocument)}
    >
      <HeadingToolbar>
        <ToolbarElement type={DEFAULTS_HEADING.h1.type} icon={<LooksOne />} />
        <ToolbarElement type={DEFAULTS_HEADING.h2.type} icon={<LooksTwo />} />
        <ToolbarElement type={DEFAULTS_HEADING.h3.type} icon={<Looks3 />} />
      </HeadingToolbar>
      <EditablePlugins plugins={plugins} placeholder="Enter some text..." />
    </Slate>
  )
}

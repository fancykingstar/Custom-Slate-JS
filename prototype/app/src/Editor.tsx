import React, { useMemo, useState } from 'react'
import { createEditor, Node } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, withReact } from 'slate-react'
import {
  DEFAULTS_PARAGRAPH,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
} from '@udecode/slate-plugins'
import {
  BoldPlugin,
  EditablePlugins,
  ItalicPlugin,
  ParagraphPlugin,
  UnderlinePlugin,
} from '@udecode/slate-plugins'
import {
  HeadingToolbar,
  ToolbarMark,
  SlateDocument,
  pipe,
} from '@udecode/slate-plugins'
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
} from '@styled-icons/material'

const initialValue: Node[] = [
  {
    type: DEFAULTS_PARAGRAPH.p.type,
    children: [
      {
        text: '',
      },
    ],
  }
]

const plugins = [
  ParagraphPlugin(),
  BoldPlugin(),
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
      onChange={newValue => {
        console.log(JSON.stringify(newValue))
        setValue(newValue as SlateDocument)
      }}
    >
      <HeadingToolbar>
        <ToolbarMark type={MARK_BOLD} icon={<FormatBold />} />
        <ToolbarMark type={MARK_ITALIC} icon={<FormatItalic />} />
        <ToolbarMark type={MARK_UNDERLINE} icon={<FormatUnderlined />} />
      </HeadingToolbar>
      <EditablePlugins
        plugins={plugins}
        placeholder="Start writing or press /"
        autoFocus
      />
    </Slate>
  )
}

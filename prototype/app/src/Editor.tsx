import React, { useMemo, useState } from 'react'
import { createEditor, Node } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, withReact } from 'slate-react'
import {
  DEFAULTS_BOLD,
  DEFAULTS_PARAGRAPH,
  DEFAULTS_ITALIC,
  DEFAULTS_UNDERLINE,
  BoldPlugin,
  EditablePlugins,
  HeadingPlugin,
  ItalicPlugin,
  ParagraphPlugin,
  UnderlinePlugin,
  SlateDocument,
  pipe,
} from '@udecode/slate-plugins'

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
  ParagraphPlugin(),
  BoldPlugin(),
  HeadingPlugin(),
  ItalicPlugin(),
  UnderlinePlugin()
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
      <EditablePlugins plugins={plugins} placeholder="Enter some text..." />
    </Slate>
  )
}

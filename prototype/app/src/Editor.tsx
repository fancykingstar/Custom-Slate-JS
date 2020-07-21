import React, { useMemo, useState } from 'react'
import { createEditor, Node } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, withReact } from 'slate-react'
import {
  ParagraphPlugin,
  BoldPlugin,
  EditablePlugins,
  ItalicPlugin,
  UnderlinePlugin,
  pipe,
} from '@udecode/slate-plugins'
import {
  DEFAULTS_ALIGN,
  DEFAULTS_BLOCKQUOTE,
  DEFAULTS_BOLD,
  DEFAULTS_CODE,
  DEFAULTS_CODE_BLOCK,
  DEFAULTS_HEADING,
  DEFAULTS_HIGHLIGHT,
  DEFAULTS_IMAGE,
  DEFAULTS_ITALIC,
  DEFAULTS_LINK,
  DEFAULTS_LIST,
  DEFAULTS_MEDIA_EMBED,
  DEFAULTS_MENTION,
  DEFAULTS_PARAGRAPH,
  DEFAULTS_SEARCH_HIGHLIGHT,
  DEFAULTS_STRIKETHROUGH,
  DEFAULTS_SUBSUPSCRIPT,
  DEFAULTS_TABLE,
  DEFAULTS_TODO_LIST,
  DEFAULTS_UNDERLINE,
  SlateDocument,
} from '@udecode/slate-plugins'

const options = {
  ...DEFAULTS_PARAGRAPH,
  ...DEFAULTS_MENTION,
  ...DEFAULTS_BLOCKQUOTE,
  ...DEFAULTS_CODE_BLOCK,
  ...DEFAULTS_LINK,
  ...DEFAULTS_IMAGE,
  ...DEFAULTS_MEDIA_EMBED,
  ...DEFAULTS_TODO_LIST,
  ...DEFAULTS_TABLE,
  ...DEFAULTS_LIST,
  ...DEFAULTS_HEADING,
  ...DEFAULTS_ALIGN,
  // marks
  ...DEFAULTS_BOLD,
  ...DEFAULTS_ITALIC,
  ...DEFAULTS_UNDERLINE,
  ...DEFAULTS_STRIKETHROUGH,
  ...DEFAULTS_CODE,
  ...DEFAULTS_SUBSUPSCRIPT,
  ...DEFAULTS_HIGHLIGHT,
  ...DEFAULTS_SEARCH_HIGHLIGHT,
}

const initialValue: Node[] = [
  {
    type: options.p.type,
    children: [
      {
        text: 'This text is bold, italic and underlined.',
        [options.bold.type]: true,
        [options.italic.type]: true,
        [options.underline.type]: true,
      },
    ],
  }
]

const plugins = [ParagraphPlugin(), BoldPlugin(), ItalicPlugin(), UnderlinePlugin()]

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

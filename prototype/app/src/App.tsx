import React, { useMemo, useState } from 'react'
import { Node, createEditor } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'

const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState<Node[]>([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ])

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable
        onKeyDown={event => {
          if (event.key === '/') {
            event.preventDefault()
            editor.insertText("menu")
          }
        }}
      />
    </Slate>
  )
}

export default App

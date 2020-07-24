import React, { useCallback, useMemo, useState } from 'react'
import { Editor, Node, Text, Transforms, createEditor } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'

const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState<Node[]>([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ])

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={value => {
        console.log(JSON.stringify(value))
        setValue(value)
      }}
    >
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={event => {
          if (event.ctrlKey) {
            switch (event.key) {
              case 'b': {
                event.preventDefault()
                Transforms.setNodes(
                  editor,
                  { bold: true },
                  { match: n => Text.isText(n), split: true }
                )
                break
              }
            }
          } else {
            if (event.key === '/') {
              event.preventDefault()
              editor.insertText("menu")
            } else if (event.key === '`') {
              event.preventDefault()
              const [match] = Editor.nodes(editor, {
                match: n => n.type === 'code',
              })
              Transforms.setNodes(
                editor,
                { type: match ? 'paragraph' : 'code' },
                { match: n => Editor.isBlock(editor, n) }
              )
            }
          }
        }}
      />
    </Slate>
  )
}

const CodeElement = (props: any) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>
}

const Leaf = (props: any) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  )
}

export default App

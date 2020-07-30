import { useMemo, useState } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Node } from 'slate';
import styles from './Editor.module.scss';
import SlashMenu from './SlashMenu';

export default function Editor(): JSX.Element {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Node[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);

  return (
    <div className={styles.wrapper}>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      >
        <SlashMenu />
        <Editable autoFocus placeholder="Enter some text..." />
      </Slate>
    </div>
  );
}

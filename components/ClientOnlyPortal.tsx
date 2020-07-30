import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  children: React.ReactNode;
}

export default function ClientOnlyPortal(props: Props): JSX.Element | null {
  const ref = useRef<Element | null>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.body;
    setMounted(true);
  });

  return mounted != null && ref.current != null
    ? createPortal(props.children, ref.current)
    : null;
}

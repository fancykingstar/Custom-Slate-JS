interface IconProps {
  size: string;
}

export function Clock(): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="feather feather-clock"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6L12 12 16 14" />
    </svg>
  );
}

export function ChevronUp(): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="feather feather-chevron-up"
      viewBox="0 0 24 24"
    >
      <path d="M18 15L12 9 6 15" />
    </svg>
  );
}

export function ChevronDown(): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="feather feather-chevron-down"
      viewBox="0 0 24 24"
    >
      <path d="M6 9L12 15 18 9" />
    </svg>
  );
}

export function CloseX(props: IconProps): JSX.Element {
  const { size } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="feather feather-x"
      viewBox="0 0 24 24"
    >
      <path d="M18 6L6 18" />
      <path d="M6 6L18 18" />
    </svg>
  );
}

export function Star(props: IconProps): JSX.Element {
  const { size } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="feather feather-star"
      viewBox="0 0 24 24"
    >
      <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z" />
    </svg>
  );
}

export function Target(): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="feather feather-target"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function Zap(): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.2rem"
      height="1.2rem"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="feather feather-zap"
      viewBox="0 0 24 24"
    >
      <path d="M13 2L3 14 12 14 11 22 21 10 12 10 13 2z" />
    </svg>
  );
}

export function ZapOff(): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.2rem"
      height="1.2rem"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="feather feather-zap-off"
      viewBox="0 0 24 24"
    >
      <path d="M12.41 6.75L13 2 10.57 4.92" />
      <path d="M18.57 12.91L21 10 15.66 10" />
      <path d="M8 8L3 14 12 14 11 22 16 16" />
      <path d="M1 1L23 23" />
    </svg>
  );
}

export function Drag(): JSX.Element {
  return (
    <svg viewBox="-1 -0.5 3 3" height="16px" width="16px">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g fill="#000000">
          <circle cx="0" cy="0" r="0.2" />
          <circle cx="0" cy="1" r="0.2" />
          <circle cx="0" cy="2" r="0.2" />
          <circle cx="1" cy="0" r="0.2" />
          <circle cx="1" cy="1" r="0.2" />
          <circle cx="1" cy="2" r="0.2" />
        </g>
      </g>
    </svg>
  );
}

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

export function EyeSlash(): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="far"
      data-icon="eye-slash"
      className="svg-inline--fa fa-eye-slash fa-w-20"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512"
      width="16px"
      height="16px"
    >
      <path
        fill="currentColor"
        d="M634 471L36 3.51A16 16 0 0 0 13.51 6l-10 12.49A16 16 0 0 0 6 41l598 467.49a16 16 0 0 0 22.49-2.49l10-12.49A16 16 0 0 0 634 471zM296.79 146.47l134.79 105.38C429.36 191.91 380.48 144 320 144a112.26 112.26 0 0 0-23.21 2.47zm46.42 219.07L208.42 260.16C210.65 320.09 259.53 368 320 368a113 113 0 0 0 23.21-2.46zM320 112c98.65 0 189.09 55 237.93 144a285.53 285.53 0 0 1-44 60.2l37.74 29.5a333.7 333.7 0 0 0 52.9-75.11 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64c-36.7 0-71.71 7-104.63 18.81l46.41 36.29c18.94-4.3 38.34-7.1 58.22-7.1zm0 288c-98.65 0-189.08-55-237.93-144a285.47 285.47 0 0 1 44.05-60.19l-37.74-29.5a333.6 333.6 0 0 0-52.89 75.1 32.35 32.35 0 0 0 0 29.19C89.72 376.41 197.08 448 320 448c36.7 0 71.71-7.05 104.63-18.81l-46.41-36.28C359.28 397.2 339.89 400 320 400z"
      />
    </svg>
  );
}

export function Eye(): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="far"
      data-icon="eye"
      className="svg-inline--fa fa-eye fa-w-18"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      width="16px"
      height="16px"
    >
      <path
        fill="currentColor"
        d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z"
      />
    </svg>
  );
}

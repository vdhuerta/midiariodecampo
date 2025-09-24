import React from 'react';

const ScaleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.036.243c-2.132 0-4.14-.818-5.62-2.24l-2.743-2.743a3.375 3.375 0 00-4.771 0l-2.743 2.743A5.988 5.988 0 013 17.25a5.988 5.988 0 01-2.036-.243c-.483-.174-.711-.703-.59-1.202L3 5.491a48.416 48.416 0 013-.52m0 0c1.01.143 2.01.317 3 .52m0 0c.264.052.527.105.794.158m-9.294 0c.267-.053.53-.106.794-.158"
    />
  </svg>
);

export default ScaleIcon;
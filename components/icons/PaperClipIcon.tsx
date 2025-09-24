
import React from 'react';

const PaperClipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3.375 3.375 0 1112.81 8.42l-7.693 7.693a1.125 1.125 0 01-1.59-1.59l7.692-7.693a.375.375 0 00-.53-  .53l-7.693 7.693a2.625 2.625 0 103.712 3.712l7.693-7.693-1.59-1.59z"
    />
  </svg>
);

export default PaperClipIcon;

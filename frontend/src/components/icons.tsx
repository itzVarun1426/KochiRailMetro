import React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <rect width="256" height="256" fill="none" />
      <path
        d="M88,144V64a32,32,0,0,1,64,0v80"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <line
        x1="88"
        y1="104"
        x2="152"
        y2="104"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <path
        d="M208,184a87.9,87.9,0,0,0-80-88H88a88,88,0,0,0,0,176H184"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <circle cx="92" cy="184" r="16" />
      <circle cx="160" cy="184" r="16" />
    </svg>
  );
}

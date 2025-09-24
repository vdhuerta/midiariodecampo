
import React from 'react';

interface TagProps {
  label: string;
}

const Tag: React.FC<TagProps> = ({ label }) => {
  return (
    <span className="bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-1 rounded-full">
      {label}
    </span>
  );
};

export default Tag;
'use client';

import parse from 'html-react-parser';

interface JobDescriptionProps {
  description: string;
}

export function JobDescription({ description }: JobDescriptionProps) {
  return <>{parse(description)}</>;
}

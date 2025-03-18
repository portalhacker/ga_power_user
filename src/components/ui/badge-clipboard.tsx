'use client';

import { useCallback, useState } from 'react';

import { Link } from 'lucide-react';

import { Badge, BadgeProps } from './badge';

function BadgeClipboard({ className, variant, ...props }: BadgeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (props.children) {
      navigator.clipboard
        .writeText(props.children.toString())
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Re-enable after 2 seconds
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
        });
    }
  }, [props.children]);

  return (
    <Badge
      className={`${className} hover:scale-110 ${
        copied ? 'bg-muted-foreground' : ''
      }`}
      variant={variant}
      onClick={!copied ? handleCopy : undefined} // Disable click when copied
      style={{
        cursor: copied ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
      {...props}
    >
      <Link size={16} />
      {copied ? 'Copied!' : props.children}
    </Badge>
  );
}

export default BadgeClipboard;

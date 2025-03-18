'use client';

import { useCallback } from 'react';

import { Link } from 'lucide-react';

import { toast } from 'sonner';
import { Badge, BadgeProps } from './badge';

function BadgeClipboard({ className, variant, ...props }: BadgeProps) {
  const handleCopy = useCallback(() => {
    if (props.children) {
      navigator.clipboard
        .writeText(props.children.toString())
        .then(() => {
          toast.success('Copied to clipboard ');
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
        });
    }
  }, [props.children]);

  return (
    <Badge
      className={`${className} hover:scale-110`}
      variant={variant}
      onClick={handleCopy}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
      {...props}
    >
      <Link size={16} />
      {props.children}
    </Badge>
  );
}

export default BadgeClipboard;

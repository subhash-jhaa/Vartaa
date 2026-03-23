'use client';

import React, { useEffect, useRef } from 'react';

export interface DropdownMenuItem {
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  onClose: () => void;
}

export default function DropdownMenu({ items, onClose }: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        right: 0,
        background: '#0d0d0d',
        border: '1px solid #1e1e1e',
        borderRadius: '8px',
        padding: '4px',
        minWidth: '180px',
        zIndex: 100,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {items.map((item, index) => {
        if (item.divider) {
          return (
            <div
              key={`divider-${index}`}
              style={{
                height: '1px',
                background: '#1a1a1a',
                margin: '4px 0',
              }}
            />
          );
        }

        return (
          <div
            key={`item-${index}`}
            onClick={item.onClick}
            className="dropdown-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '5px',
              fontSize: '13px',
              color: 'var(--obsidian-text-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
              position: 'relative',
            }}
          >
            {item.icon && (
              <span style={{ 
                width: '14px', 
                height: '14px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--obsidian-text-faint)',
              }}>
                {React.cloneElement(item.icon as React.ReactElement<{ size?: number }>, { size: 14 })}
              </span>
            )}
            <span>{item.label}</span>

            <style jsx>{`
              .dropdown-item:hover {
                background: #111;
                color: ${item.danger ? '#f87171' : 'var(--obsidian-text)'} !important;
              }
              .dropdown-item:hover :global(svg) {
                color: ${item.danger ? '#f87171' : 'var(--obsidian-text)'} !important;
              }
            `}</style>
          </div>
        );
      })}
    </div>
  );
}

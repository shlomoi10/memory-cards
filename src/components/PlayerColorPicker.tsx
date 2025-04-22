import React, { useState, useRef, useEffect } from 'react';
import './PlayerColorPicker.css';

interface PlayerColorPickerProps {
  value: string;
  options: string[];
  onChange: (color: string) => void;
  ariaLabel: string;
}

export default function PlayerColorPicker({ value, options, onChange, ariaLabel }: PlayerColorPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="player-color-picker" ref={ref}>
      <div
        className={`player-color-circle selected`}
        style={{ borderColor: value, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        tabIndex={0}
        aria-label={ariaLabel}
        onClick={() => setOpen(o => !o)}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={value} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.58 16.09-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91M11 11H9v2H8v-2H6v-1h2V8h1v2h2zm4-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1" />
        </svg>
      </div>
      {open && (
        <div className="player-color-palette">
          {options.map(color => (
            <div
              key={color}
              className={`player-color-circle${color === value ? ' selected' : ''}`}
              style={{ borderColor: color, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              tabIndex={0}
              aria-label={`בחר צבע ${color}`}
              onClick={() => { onChange(color); setOpen(false); }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.58 16.09-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91M11 11H9v2H8v-2H6v-1h2V8h1v2h2zm4-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1" />
              </svg>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

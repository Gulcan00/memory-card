import { useRef, useState } from 'react';

import '../styles/RadioGroup.css';

const BUTTONS = [
  { label: 'Easy', value: '8' },
  { label: 'Medium', value: '16' },
  { label: 'Hard', value: '24' },
];

export default function RadioGroup({ selected, onChange }) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const labelsRef = useRef([]);

  const handleKeyDown = (e) => {
    let newIndex;
    switch (e.code) {
      case 'ArrowUp':
      case 'ArrowLeft': {
        e.preventDefault();
        if (focusedIndex === 0) {
          newIndex = BUTTONS.length - 1;
        } else {
          newIndex = focusedIndex - 1;
        }
        break;
      }
      case 'ArrowDown':
      case 'ArrowRight': {
        e.preventDefault();
        if (focusedIndex === BUTTONS.length - 1) {
          newIndex = 0;
        } else {
          newIndex = focusedIndex + 1;
        }
        break;
      }
      case 'Space':
      case 'Enter': {
        e.preventDefault();
        onChange({ target: { value: BUTTONS[focusedIndex].value } });
        return;
      }
    }

    setFocusedIndex(newIndex);
    if (labelsRef.current[newIndex]) {
      labelsRef.current[newIndex].focus();
    } else {
      setFocusedIndex(0);
    }
  };

  return (
    <fieldset>
      <legend className="visually-hidden">Select difficulty:</legend>
      {BUTTONS.map((button, index) => (
        <label
          key={button.label}
          id={button.label}
          className={`btn ${selected === button.value ? 'active' : ''}`}
          tabIndex={index === focusedIndex ? '0' : '-1'}
          onKeyDown={handleKeyDown}
          ref={(el) => (labelsRef.current[index] = el)}
        >
          {button.label}
          <input
            className="visually-hidden"
            type="radio"
            name="difficulty"
            id={button.label}
            value={button.value}
            onChange={onChange}
            checked={selected === button.value}
            tabIndex={-1}
          />
        </label>
      ))}
    </fieldset>
  );
}

import React from 'react';

export function getAreaChartDefs(index, stroke = '#858294') {
  const id = `diagonalHatch-${index}`;

  return (
    <defs>
      <pattern
        id={id}
        patternUnits="userSpaceOnUse"
        width="5"
        height="5"
        patternTransform="rotate(-45)"
      >
        <line
          x1="5"
          y="0"
          x2="5"
          y2="5"
          style={{ stroke, strokeWidth: '5' }}
        />
      </pattern>
    </defs>
  );
}

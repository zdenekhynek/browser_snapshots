import COLORS from './colors';

export default function(metric, index) {
  let style = {};
  let stroke = '';
  let fill = 'none';

  if (metric === 'pollution') {
    stroke = COLORS[index];
    style = { stroke, fill };
  } else if (metric === 'temperature') {
    fill = `url(#diagonalHatch-${index})`;
    style = { fill };
  } else {
    fill = COLORS[index];
    style = { fill };
  }

  return style;
}

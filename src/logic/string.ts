export function createDateString(initialDateString) {
  const date = new Date(initialDateString);
  const monthIndex = date.getMonth();
  const months = [
    'jan',
    'fev',
    'mar',
    'abr',
    'mai',
    'jun',
    'jul',
    'ago',
    'set',
    'out',
    'dez',
  ];
  const day = date.getDate();
  const month = months[monthIndex];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

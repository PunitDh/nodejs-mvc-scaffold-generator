export function randomInteger(min, max, step = 1) {
  return (
    Math.floor((Math.random() * (max - min + 1) + min) * (step || 1)) /
    (step || 1)
  );
}

export function randomChoice(choices) {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

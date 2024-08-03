export function getSpeed(startTime: number, inputParagraph: string) {
  const numCharsTyped = inputParagraph.split("").length;

  // Calculate the time elapsed in minutes
  const timeElapsedMinutes = (Date.now() - startTime) / 1000 / 60;

  // Calculate words per minute (WPM) Divide the number of characters by 5 (average word length) 
  const wpm = numCharsTyped / 5 / timeElapsedMinutes;

//   console.log(`WPM: ${wpm}`);
  return wpm;
}

export function getAccuracy(score: number, inputParagraph: string) {
  const numCharsTyped = inputParagraph.split("").length;
  return (score / numCharsTyped) * 100;
}

export function getScore(inputParagraph: string, paragraph: string) {
  const characterTyped = inputParagraph.split("");
  const characterParagraph = paragraph.split("");

  let score = 0;
  for (let i = 0; i < characterTyped.length; i++) {
    if (characterTyped[i] === characterParagraph[i]) {
      score++;
    }
  }
  return score;
}

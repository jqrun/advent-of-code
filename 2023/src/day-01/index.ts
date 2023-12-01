import { readFileSync } from 'node:fs';

const stringToDigitMap = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
};

function parseFile(path: string): string[] {
  return readFileSync(path, 'utf-8').split('\n');
}

function sumCalibrationValues(lines: string[]): number {
  let sum = 0;

  for (const line of lines) {
    const digits = line.match(/\d/g);
    sum += Number(String(digits?.[0]) + digits?.slice(-1)[0]);
  }

  return sum;
}

function sumCalibrationValuesAndStrings(lines: string[]): number {
  const linesConvertedToDigits = lines.map((line) => {
    const converted = Array(line.length).fill(null);
    charLoop: for (let i = 0; i < line.length; i++) {
      for (const [str, digit] of Object.entries(stringToDigitMap)) {
        if (line.charAt(i) === digit || line.startsWith(str, i)) {
          converted[i] = digit;
          continue charLoop;
        }
      }
    }
    return converted.filter(Boolean).join('');
  });
  return sumCalibrationValues(linesConvertedToDigits);
}

const example1Input = parseFile('./src/day-01/example1.txt');
const example2Input = parseFile('./src/day-01/example2.txt');
const puzzleInput = parseFile('./src/day-01/puzzle.txt');

console.log(sumCalibrationValues(example1Input));
console.log(sumCalibrationValues(puzzleInput));

console.log(sumCalibrationValuesAndStrings(example2Input));
console.log(sumCalibrationValuesAndStrings(puzzleInput));

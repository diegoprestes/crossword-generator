import { words } from './words';

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
}

export const getRandomWordOfSize = (wordList: string[], wordSize: number) => {
  const unusedWords = getUnusedWords(wordList);  
  let properLengthWords = unusedWords.filter(val => val.length >= wordSize);
  
  return properLengthWords[getRandomInt(properLengthWords.length)];
}

export const getUnusedWords = (usedWords: string[]) => {
  return words.filter(val => !usedWords.includes(val));
}

export const getRandomWord = (usedWords: string[]) => {
  let wordsList = getUnusedWords(usedWords);
  return wordsList[getRandomInt(wordsList.length)];
}
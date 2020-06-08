import {
  attemptsToFitWords,
  gridsToMake,
  gridSize,
  maxNumberOfFails,
} from './CrosswordConstants';
import Word from './Word';
import CrosswordPuzzle from './CrosswordPuzzle';
import { getRandomWord, getRandomWordOfSize } from './CrosswordUtils';

export class CrosswordGenerator {
  usedWords: string[] = [];
  generatedGrids: CrosswordPuzzle[] = [];
  goodStartingLetters: Set<string> = new Set();

  constructor() {
    this.bindEvents();
    this.renderGrid();
  }

  private bindEvents() {
    const generateButton = document.querySelector('.generate-button') as HTMLButtonElement;
    generateButton.addEventListener('click', () => {
      this.createCrosswordPuzzle();
    });
  }

  private renderGrid() {
    const grid = document.querySelector('#grid') as HTMLDivElement;

    let slots = '';
    for (let row = 0; row < gridSize; row++) {
      for (let column = 0; column < gridSize; column++) {
        slots += `<div id="${row}_${column}" class="slot"></div>`;
      }
    }

    grid.innerHTML = slots;
  }

  private createCrosswordPuzzle() {
    this.generateGrids();
    const bestGrid = this.getBestGrid();
    this.displayCrosswordPuzzle(bestGrid);
  }

  private generateGrids() {
    this.generatedGrids = [];

    for (let index = 0; index < gridsToMake; index++) {
      let puzzle = new CrosswordPuzzle();
      let word = new Word(getRandomWordOfSize(this.usedWords, 9));
      puzzle.update(word);
      this.addUsedWord(word.text);

      let continuousFails = 0;
      for (let attempts = 0; attempts < attemptsToFitWords; attempts++) {
        let placed = this.attemptToPlaceWordOnGrid(puzzle, word);
        if (placed) {
          continuousFails = 0;
        } else {
          continuousFails++;
        }
        if (continuousFails > maxNumberOfFails) {
          break;
        }
      }

      this.generatedGrids.push(puzzle);
      if (puzzle.getIntersections() >= 4) {
        break;
      }

      this.usedWords = [];
    }
  }

  private getBestGrid() {
    let bestGrid = this.generatedGrids[0];
    
    for (let grid of this.generatedGrids) {
      if (grid.getIntersections() >= bestGrid.getIntersections()) {
        bestGrid = grid;
      }
    }

    return bestGrid;
  }

  private displayCrosswordPuzzle(puzzle: CrosswordPuzzle) {
    for (let row = 0; row < gridSize; row++) {
      for (let column = 0; column < gridSize; column++) {
        const slot = document.getElementById(`${row}_${column}`) as HTMLDivElement;

        if (puzzle.isLetter(row, column)) {
          slot.innerHTML = puzzle.grid[row][column];
          slot.style.borderBottom = '1px solid #9a8e9a';
          slot.style.borderRight = '1px solid #9a8e9a';
          slot.style.backgroundColor = 'rgb(102, 178, 255)';
        } else {
          slot.innerHTML = '';
          slot.style.border = '1px solid #e9e9e9';
          slot.style.backgroundColor = '#e9e9e9';
        }
      }
    }
  }

  private attemptToPlaceWordOnGrid(puzzle: CrosswordPuzzle, word: Word) {
    let text = this.getWordToTry();

    for (let row = 0; row < gridSize; row++) {
      for (let column = 0; column < gridSize; column++) {
        word.text = text;
        word.row = row;
        word.column = column;
        word.isVertical = Math.random() >= 0.5;

        if (puzzle.isLetter(row, column) && puzzle.update(word)) {
          this.addUsedWord(word.text);
          return true;
        }
      }
    }

    return false;
  }

  private getWordToTry() {
    let word = getRandomWord(this.usedWords);
    let goodWord = this.isGoodWord(word);
    while(!goodWord) {
      word = getRandomWord(this.usedWords);
      goodWord = this.isGoodWord(word);
    }
    return word;
  }

  private isGoodWord(word: string) {
    let goodWord = false;

    for (let letter of this.goodStartingLetters) {
      if (letter === word.charAt(0)) {
        goodWord = true;
        break;
      }
    }

    return goodWord;
  }

  private addUsedWord(text: string) {
    this.usedWords.push(text);

    text.split('').forEach(char => this.goodStartingLetters.add(char));
  }
}

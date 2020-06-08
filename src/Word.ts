export default class Word {
  constructor(
    public text: string = '',
    public row: number = 0,
    public column: number = 0,
    public isVertical: boolean = false
  ) {}
}

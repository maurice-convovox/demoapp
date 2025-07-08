declare class VanillaOTP {
  constructor(selector: string | Element, updateToSelector?: string | Element | null);
  setEmptyChar(char: string): void;
  getValue(): string;
  setValue(value: string): void;

  _setInputValue(index: number, value: string): void;
  _saveInputValue(index: number, value?: string): void;
  _updateValue(): void;

  container: Element | null;
  updateTo: Element | null;
  inputs: Array<Element>;
  emptyChar: string;
}

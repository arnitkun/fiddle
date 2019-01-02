export class EditorMock {
  public layout = jest.fn();
  public hasTextFocus = jest.fn();
  public setValue = jest.fn();
  public getValue = jest.fn().mockReturnValue('editor-value');
  public onDidChangeModelContent = jest.fn();
  public updateOptions = jest.fn();

  constructor(public readonly name: string) {}
}

export class EditorsMock {
  public main = new EditorMock('main');
  public renderer = new EditorMock('renderer');
  public html = new EditorMock('html');
}

export enum ToolName {
  Categorizer = 'Categorizer',
  Choices = 'Choices',
  Conclusion = 'Conclusion',
  Comparison = 'Comparison',
  Data = 'Data',
  Emotion = 'Emotion',
  Goals = 'Goals',
  Inversion = 'Inversion',
  IssueTree = 'IssueTree',
  People = 'People',
  ProCon = 'ProCon',
  Simulation = 'Simulation',
}

export function trackInsertTool(toolName: ToolName): void {
  // @ts-ignore
  heap.track(`InsertTool-${toolName}`);
}

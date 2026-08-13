export interface PromptBlock {
  label: string;
  example: string;
}

export interface PromptTemplate {
  useCase: string; // e.g., 'Promotional Posters'
  blocks: PromptBlock[];
  copyTemplate: string; // The full string to copy to clipboard
}

export interface PromptWorkshop {
  toolId: string;
  templates: PromptTemplate[];
}

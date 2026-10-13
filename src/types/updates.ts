export interface ToolUpdate {
  id: string;
  toolName: string;
  type: 'feature' | 'pricing' | 'launch';
  summary: string;
  date: string;
  read: boolean;
}

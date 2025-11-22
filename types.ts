export enum DesignType {
  POSTER = 'Poster',
  NAMECARD = 'Name Card',
  BANNER = 'Web Banner',
  SOCIAL = 'Social Media Post'
}

export type BackgroundPattern = 'solid' | 'dots' | 'grid' | 'lines' | 'gradient' | 'mesh';

export interface DecorativeElement {
  id: string;
  type: 'circle' | 'blob' | 'square';
  style: Record<string, any>;
}

export interface GeneratedDesign {
  headline: string;
  subheadline: string;
  bodyText: string;
  accentColor: string;
  backgroundColor: string;
  backgroundPattern: BackgroundPattern;
  textColor?: string;
  emojiIcon: string;
  layoutStyle: 'minimal' | 'bold' | 'creative' | 'modern';
  decorativeElements: DecorativeElement[];
}

export interface DesignState {
  textInput: string;
  selectedType: DesignType;
  isGenerating: boolean;
  currentDesign: GeneratedDesign | null;
}
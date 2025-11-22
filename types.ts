export enum DesignType {
  POSTER = 'Poster',
  NAMECARD = 'Name Card',
  BANNER = 'Web Banner',
  SOCIAL = 'Social Media Post'
}

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
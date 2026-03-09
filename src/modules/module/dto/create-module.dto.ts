export class CreateModuleDto {
  number!: number;
  name!: string;
  cartel?: string;
  mediaType?: 'audio' | 'video' | 'none';
  mediaUrl?: string;
  images?: string[];
  position?: { x: number; y: number };
}

export class CreateModuleDto {
  number!: number;
  name!: string;
  cartel?: string;
  mediaType?: 'audio' | 'video' | 'image' | 'none';
  mediaUrl?: string;
  images?: string[];
}

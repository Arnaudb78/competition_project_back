export class CreateModuleDto {
  number!: number;
  name!: string;
  cartel?: string;
  mediaType?: 'audio' | 'video' | 'image' | 'none';
  mediaUrl?: string;
  images?: string[];
  mapX?: number;
  mapY?: number;
}

export class UpdateModuleDto {
  number?: number;
  name?: string;
  cartel?: string;
  mediaType?: 'audio' | 'video' | 'image' | 'none';
  mediaUrl?: string;
  images?: string[];
  mapX?: number | null;
  mapY?: number | null;
}

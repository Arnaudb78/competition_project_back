export class CreateClipDto {
  videoUrl!: string;
  thumbnailUrl?: string;
  title!: string;
  author!: string;
  isVisible?: boolean;
}

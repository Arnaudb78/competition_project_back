export class CreateReplayDto {
  title!: string;
  description?: string;
  languages?: string[];
  videoUrl!: string;
  thumbnailUrl?: string;
  isVisible?: boolean;
}

export class AddCommentDto {
  author!: string;
  text!: string;
}

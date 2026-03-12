export class CreateChallengeDto {
  name!: string;
  description?: string;
  imageUrl?: string;
  isVisible?: boolean;
}

export class UpdateChallengeDto {
  name?: string;
  description?: string;
  imageUrl?: string | null;
  isVisible?: boolean;
}

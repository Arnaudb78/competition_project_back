export class CreateGroupDto {
  participants!: string[]; // liste de prénoms
}

export class UpdateScoreDto {
  participantName!: string;
  points!: number; // points à ajouter
}

export class CompleteModuleDto {
  moduleId!: number;
}

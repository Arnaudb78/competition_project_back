export class ParticipantDto {
  name!: string;
  age!: number;
}

export class CreateGroupDto {
  participants!: ParticipantDto[];
}

export class UpdateScoreDto {
  participantName!: string;
  points!: number; // points à ajouter
}

export class CompleteModuleDto {
  moduleId!: number;
}

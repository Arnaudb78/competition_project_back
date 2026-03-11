export class AnswerDto {
  text!: string;
  isCorrect!: boolean;
}

export class CreateQuestionDto {
  text!: string;
  ageGroup!: 'child' | 'adult';
  answers!: AnswerDto[];
}

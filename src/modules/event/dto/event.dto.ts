export class CreateEventDto {
  title!: string;
  description?: string;
  date!: string;
  time?: string;
  location?: string;
  price?: number;
  imageUrl?: string;
  organizer?: string;
  isVisible?: boolean;
  maxCapacity?: number;
}

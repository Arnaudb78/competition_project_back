import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  findAll() {
    return this.eventModel.find({ isVisible: true }).sort({ date: 1 });
  }

  findAllAdmin() {
    return this.eventModel.find().sort({ date: 1 });
  }

  async findOne(id: string) {
    const event = await this.eventModel.findById(id);
    if (!event) throw new NotFoundException('Événement introuvable');
    return event;
  }

  create(dto: CreateEventDto) {
    return this.eventModel.create(dto);
  }

  async update(id: string, dto: Partial<CreateEventDto>) {
    const event = await this.eventModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!event) throw new NotFoundException('Événement introuvable');
    return event;
  }

  async remove(id: string) {
    const event = await this.eventModel.findByIdAndDelete(id);
    if (!event) throw new NotFoundException('Événement introuvable');
    return event;
  }

  async toggleRegister(id: string, accountId: string) {
    const event = await this.eventModel.findById(id);
    if (!event) throw new NotFoundException('Événement introuvable');

    const already = event.participants.includes(accountId);

    if (!already) {
      if (event.maxCapacity && event.participants.length >= event.maxCapacity) {
        throw new Error('Événement complet');
      }
      event.participants.push(accountId);
    } else {
      event.participants = event.participants.filter((p) => p !== accountId);
    }

    await event.save();
    return event;
  }
}

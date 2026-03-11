import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { ReplayService } from './replay.service';
import { CreateReplayDto } from './dto/replay.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('replays')
export class ReplayController {
  constructor(private readonly replayService: ReplayService) {}

  @Get()
  findAll() {
    return this.replayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.replayService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateReplayDto) {
    return this.replayService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateReplayDto>) {
    return this.replayService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.replayService.remove(id);
  }
}

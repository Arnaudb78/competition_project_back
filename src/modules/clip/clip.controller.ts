import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, Req,
} from '@nestjs/common';
import { ClipService } from './clip.service';
import { CreateClipDto } from './dto/clip.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtAccountGuard } from '../auth/guards/jwt-account.guard';

@Controller('clips')
export class ClipController {
  constructor(private readonly clipService: ClipService) {}

  @Get()
  findAll() {
    return this.clipService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clipService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateClipDto) {
    return this.clipService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateClipDto>) {
    return this.clipService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clipService.remove(id);
  }

  // Toggle like — authentifié en tant qu'account (user de l'app)
  @UseGuards(JwtAccountGuard)
  @Patch(':id/like')
  toggleLike(@Param('id') id: string, @Req() req: { user: { sub: string } }) {
    return this.clipService.toggleLike(id, req.user.sub);
  }
}

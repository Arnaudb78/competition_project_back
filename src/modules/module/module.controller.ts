import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  // ─── Routes publiques (jeu / visite) ──────────────────────────────────────

  @Get()
  findAllPublic() {
    return this.moduleService.findAllPublic();
  }

  // ─── Routes admin (JWT requis) ─────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAll() {
    return this.moduleService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateModuleDto) {
    return this.moduleService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  reorder(@Body() body: { ids: string[] }) {
    return this.moduleService.reorder(body.ids);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateModuleDto>) {
    return this.moduleService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moduleService.remove(id);
  }

  // Doit rester en dernier — capture tout ce qui n'a pas matché avant
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moduleService.findOne(id);
  }
}

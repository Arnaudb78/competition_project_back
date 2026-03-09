import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';

@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  create(@Body() dto: CreateModuleDto) {
    return this.moduleService.create(dto);
  }

  @Get()
  findAllPublic() {
    return this.moduleService.findAllPublic();
  }

  @Get('all')
  findAll() {
    return this.moduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moduleService.findOne(id);
  }

  @Patch('positions')
  updatePositions(
    @Body() body: { positions: { id: string; x: number; y: number }[] },
  ): Promise<any> {
    return this.moduleService.updatePositions(body.positions);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateModuleDto>) {
    return this.moduleService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moduleService.remove(id);
  }
}

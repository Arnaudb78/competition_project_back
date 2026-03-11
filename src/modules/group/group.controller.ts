import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto, UpdateScoreDto, CompleteModuleDto } from './dto/create-group.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  // Toutes les routes sont publiques (pas de JWT — visiteurs non authentifiés)

  @Post()
  create(@Body() dto: CreateGroupDto) {
    return this.groupService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Patch(':id/score')
  addScore(@Param('id') id: string, @Body() dto: UpdateScoreDto) {
    return this.groupService.addScore(id, dto);
  }

  @Patch(':id/module')
  completeModule(@Param('id') id: string, @Body() dto: CompleteModuleDto) {
    return this.groupService.completeModule(id, dto);
  }

  @Patch(':id/end')
  endVisit(@Param('id') id: string) {
    return this.groupService.endVisit(id);
  }
}

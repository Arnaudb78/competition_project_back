import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto, UpdateChallengeDto } from './dto/create-challenge.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtAccountGuard } from '../auth/guards/jwt-account.guard';

@Controller('challenges')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  // ─── Routes publiques ──────────────────────────────────────────────────────

  @Get()
  findAllPublic() {
    return this.challengeService.findAllPublic();
  }

  // ─── Routes admin (JWT requis) ─────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAll() {
    return this.challengeService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateChallengeDto) {
    return this.challengeService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChallengeDto) {
    return this.challengeService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.challengeService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/questions')
  addQuestionPair(
    @Param('id') id: string,
    @Body() body: { childQuestionId: string; adultQuestionId: string },
  ) {
    return this.challengeService.addQuestionPair(
      id,
      body.childQuestionId,
      body.adultQuestionId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/questions/:index')
  removeQuestionPair(
    @Param('id') id: string,
    @Param('index') index: string,
  ) {
    return this.challengeService.removeQuestionPair(id, parseInt(index, 10));
  }

  // ─── Routes compte (JwtAccountGuard) ──────────────────────────────────────

  @UseGuards(JwtAccountGuard)
  @Get('completions')
  getMyCompletions(@Request() req: any) {
    return this.challengeService.findCompletionsByAccount(req.user._id);
  }

  @UseGuards(JwtAccountGuard)
  @Post(':id/complete')
  complete(
    @Param('id') id: string,
    @Body() body: { score: number },
    @Request() req: any,
  ) {
    return this.challengeService.complete(id, req.user._id, body.score);
  }

  // Doit rester en dernier — capture tout ce qui n'a pas matché avant
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.challengeService.findOne(id);
  }
}

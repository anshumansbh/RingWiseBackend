import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TtsService } from './tts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/entities/user.entity';

@Controller('api/tts')
@UseGuards(JwtAuthGuard)
export class TtsController {
  constructor(private ttsService: TtsService) {}

  @Post('generate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async generate(@Body() body: { text: string; audio_file_id: string }, @Request() req) {
    // Note: TTS generation happens on Android device
    // This endpoint just stores the metadata
    const tts = await this.ttsService.create(
      body.text,
      body.audio_file_id,
      req.user.id,
    );
    return {
      message: 'TTS announcement created. Audio should be generated on Android device and uploaded.',
      tts,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ttsService.findOne(id);
  }
}


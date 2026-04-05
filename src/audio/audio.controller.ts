import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AudioService } from './audio.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/entities/user.entity';

@Controller('api/audio')
@UseGuards(JwtAuthGuard)
export class AudioController {
  constructor(private audioService: AudioService) {}

  @Get('list')
  async findAll() {
    return this.audioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.audioService.findOne(id);
  }

  @Post('upload')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type. Only audio files are allowed.'), false);
        }
      },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File, @Request() req) {
    // TODO: Calculate duration using audio library
    const duration = 0;
    
    const audioFile = await this.audioService.create(
      file.originalname,
      file.path,
      file.size,
      duration,
      req.user.id,
    );

    return {
      message: 'Audio file uploaded successfully',
      audioFile,
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    await this.audioService.delete(id);
    return { message: 'Audio file deleted successfully' };
  }
}


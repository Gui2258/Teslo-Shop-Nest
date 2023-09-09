import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/filefilter.helper';
import { fileNamer } from './helpers/filenamer.helper';
import { ConfigService } from '@nestjs/config';



@Controller('files')
export class FilesController {

  constructor(
    private readonly filesService : FilesService,

    private readonly configService : ConfigService,
  ){}

  @Get('product/:imageName')
  findProductImage(
    @Res() resp : Response,
    @Param('imageName') imageName : string)
    {
      const path = this.filesService.getStaticProductImage(imageName);

      resp.sendFile(path);
    }

  @Post('product')
  @UseInterceptors(FileInterceptor(
    'file',
    {fileFilter : fileFilter,
     storage : diskStorage({destination: './static/products', filename : fileNamer}),
    },))
  uploadFile(@UploadedFile() file : Express.Multer.File){

    if(!file)
      throw new BadRequestException(`Make sure that the file is a image`);

    const secureURL = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return {secureURL};

  }

}

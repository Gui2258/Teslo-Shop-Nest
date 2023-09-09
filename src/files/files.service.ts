import { join } from 'path';
import { existsSync } from 'fs';

import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {

  getStaticProductImage(imagename : string){

    const path = join(__dirname,'../../static/products', imagename);

    if(!existsSync(path))
      throw new BadRequestException(`No product found with image ${imagename}`);

    return path;
  }
}

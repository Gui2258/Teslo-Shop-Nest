import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes( 
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
   );

   const config = new DocumentBuilder()
   .setTitle('Teslo RESTFul Api')
   .setDescription('Teslo Shop endpoints')
   .setVersion('0.1')
   .build();
 const document = SwaggerModule.createDocument(app, config);
 SwaggerModule.setup('docs', app, document);

 await app.listen(process.env.PORT, "0.0.0.0");
 console.log(`Application is running on: ${await app.getUrl()}`);

}
bootstrap();

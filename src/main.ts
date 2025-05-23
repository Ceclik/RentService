import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API for smart platform for real estate rental management')
    .setDescription(
      'This web application is designed for property owners and tenants. ' +
        'The platform allows owners to easily manage their properties, and ' +
        'renters to find suitable housing options, sign contracts and pay rent. ' +
        'The application includes functions for managing reservations, payments, ' +
        'communication between parties, and integration with maps and external ' +
        'services.',
    )
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  await app.listen(PORT, () =>
    console.log(`Server is listening on port: ${PORT}`),
  );
}

bootstrap();

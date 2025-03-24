import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));

  app.enableCors({ origin: '*' });
  await app.listen(3001, () => {
    console.log('Server is running on port http://localhost:3001');
  });
}
bootstrap();

import { Module } from '@nestjs/common';
import { ControllersController } from './controllers.controller';
import { ControllersService } from './controllers.service';

@Module({

  controllers: [ControllersController],

  providers: [ControllersService]
})
export class UserModule {}

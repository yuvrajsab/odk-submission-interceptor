import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { DietWeeklyModule } from './diet-weekly/diet-weekly.module';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { DietMonthlyModule } from './diet-monthly/diet-monthly.module';
import { QueueService } from './service/queue.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.getOrThrow('REDIS_HOST'),
          port: configService.getOrThrow('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    DietWeeklyModule,
    DietMonthlyModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, QueueService],
})
export class AppModule {}

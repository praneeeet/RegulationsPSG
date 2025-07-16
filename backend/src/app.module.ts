import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './modules/course.module';
import { SemesterModule } from './modules/semester.module';
import { HodModule } from './modules/hod.module';
import { DeanModule } from './modules/dean.module';
import { SubmissionModule } from './modules/submission.module';
import { ProgramCoordinatorModule } from './modules/programme-coordinator.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
    AuthModule,
    CourseModule,
    SemesterModule,
    HodModule,
    DeanModule,
    SubmissionModule,
    ProgramCoordinatorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
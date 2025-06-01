import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoriesService } from './repositories.service';
import { RepositoriesController } from './repositories.controller';
import { Repository } from './entities/repository.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Repository, User])],
  providers: [RepositoriesService],
  controllers: [RepositoriesController],
})
export class RepositoriesModule {} 
import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';
import { UpdateRepositoryDto } from './dto/update-repository.dto';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('repositories')
@UseGuards(AuthGuard)
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@AuthUser() user: User, @Body() body: { repoPath: string }) {
    return this.repositoriesService.create({ path: body.repoPath }, user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@AuthUser() user: User) {
    return this.repositoriesService.findAll(user.id);
  }

  @Post(':id/update')
  @HttpCode(HttpStatus.OK)
  update(@AuthUser() user: User, @Param('id') id: string, @Body() updateRepositoryDto: UpdateRepositoryDto) {
    return this.repositoriesService.update(id, updateRepositoryDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@AuthUser() user: User, @Param('id') id: string) {
    return this.repositoriesService.remove(id, user.id);
  }
} 
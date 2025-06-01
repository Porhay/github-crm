import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('repositories')
@UseGuards(JwtAuthGuard)
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Post()
  create(@Request() req, @Body() body: { repoPath: string }) {
    return this.repositoriesService.create(req.user, body.repoPath);
  }

  @Get()
  findAll(@Request() req) {
    return this.repositoriesService.findAll(req.user);
  }

  @Post(':id/update')
  update(@Request() req, @Param('id') id: string) {
    return this.repositoriesService.update(req.user, id);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.repositoriesService.remove(req.user, id);
  }
} 
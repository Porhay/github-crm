import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User as UserEntity } from '../users/entities/user.entity';
import { Repository as RepositoryEntity } from './entities/repository.entity';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';
import axios from 'axios';

@Injectable()
export class RepositoriesService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RepositoryEntity)
    private repositoriesRepository: Repository<RepositoryEntity>,
  ) {}

  private async getPublicRepository(owner: string, repo: string): Promise<any> {
    try {
      const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'User-Agent': 'nest-app',
          // ...(process.env.GITHUB_TOKEN && { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` }),
        },
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException('Repository not found');
      }
      throw error;
    }
  }

  async create(createRepositoryDto: CreateRepositoryDto, userId: string): Promise<RepositoryEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [owner, name] = createRepositoryDto.path.split('/');
    const data = await this.getPublicRepository(owner, name);

    const repository = this.repositoriesRepository.create({
      owner,
      name,
      url: data.html_url,
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      githubCreatedAt: new Date(data.created_at),
      user,
    });

    return this.repositoriesRepository.save(repository);
  }

  async findAll(userId: string): Promise<RepositoryEntity[]> {
    return this.repositoriesRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findOne(id: string, userId: string): Promise<RepositoryEntity> {
    const repository = await this.repositoriesRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    return repository;
  }

  async update(id: string, updateRepositoryDto: UpdateRepositoryDto, userId: string): Promise<RepositoryEntity> {
    const repository = await this.repositoriesRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    const [owner, name] = updateRepositoryDto.path.split('/');
    const data = await this.getPublicRepository(owner, name);

    Object.assign(repository, {
      owner,
      name,
      url: data.html_url,
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      githubCreatedAt: new Date(data.created_at),
    });

    return this.repositoriesRepository.save(repository);
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.repositoriesRepository.delete({
      id,
      user: { id: userId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Repository not found');
    }
  }
} 
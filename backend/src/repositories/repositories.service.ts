import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Octokit } from 'octokit';
import { Repository as RepositoryEntity } from './entities/repository.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RepositoriesService {
  private octokit: Octokit;

  constructor(
    @InjectRepository(RepositoryEntity)
    private repositoriesRepository: Repository<RepositoryEntity>,
  ) {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_API_TOKEN,
    });
  }

  async create(user: User, repoPath: string): Promise<RepositoryEntity> {
    const [owner, name] = repoPath.split('/');
    
    try {
      const { data: repo } = await this.octokit.rest.repos.get({
        owner,
        repo: name,
      });

      const repository = this.repositoriesRepository.create({
        owner: repo.owner.login,
        name: repo.name,
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        openIssues: repo.open_issues_count,
        githubCreatedAt: new Date(repo.created_at).getTime(),
        user,
      });

      return this.repositoriesRepository.save(repository);
    } catch (error) {
      throw new NotFoundException('Repository not found');
    }
  }

  async findAll(user: User): Promise<RepositoryEntity[]> {
    return this.repositoriesRepository.find({
      where: { user: { id: user.id } },
    });
  }

  async update(user: User, id: string): Promise<RepositoryEntity> {
    const repository = await this.repositoriesRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    const { data: repo } = await this.octokit.rest.repos.get({
      owner: repository.owner,
      repo: repository.name,
    });

    repository.stars = repo.stargazers_count;
    repository.forks = repo.forks_count;
    repository.openIssues = repo.open_issues_count;

    return this.repositoriesRepository.save(repository);
  }

  async remove(user: User, id: string): Promise<void> {
    const result = await this.repositoriesRepository.delete({
      id,
      user: { id: user.id },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Repository not found');
    }
  }
} 
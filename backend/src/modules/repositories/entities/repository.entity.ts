import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('repositories')
export class Repository {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  stars: number;

  @Column()
  forks: number;

  @Column()
  openIssues: number;

  @Column({ name: 'github_created_at', type: 'timestamp' })
  githubCreatedAt: Date;

  @ManyToOne(() => User, user => user.repositories)
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 
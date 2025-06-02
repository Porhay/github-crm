'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { authService } from '@/services/auth.service';
import '@/styles/main.scss';

interface Repository {
  id: string;
  owner: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  githubCreatedAt: number;
}

export default function RepositoriesPage() {
  const router = useRouter();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [newRepoPath, setNewRepoPath] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const isAuthenticated = authService.isAuthenticated();

      if (!isAuthenticated) {
        router.replace('/auth/login');
        return;
      }

      await fetchRepositories();
    };

    checkAuthAndFetch();
  }, [router]);

  const fetchRepositories = async () => {
    try {
      const response = await fetch('http://localhost:3001/repositories', {
        headers: {
          'Authorization': `Bearer ${authService.getAccessToken()}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const data = await response.json();
      setRepositories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load repositories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRepository = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3001/repositories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getAccessToken()}`,
        },
        credentials: 'include',
        body: JSON.stringify({ repoPath: newRepoPath }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add repository');
      }

      setNewRepoPath('');
      fetchRepositories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add repository');
    }
  };

  const handleUpdateRepository = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/repositories/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authService.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update repository');
      }

      fetchRepositories();
    } catch (err) {
      setError('Failed to update repository');
    }
  };

  const handleDeleteRepository = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/repositories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authService.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete repository');
      }

      fetchRepositories();
    } catch (err) {
      setError('Failed to delete repository');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="repositories-page">
      <Navigation />
      <div className="repositories-page__container">
        <div className="repositories-page__card">
          <h1 className="repositories-page__title">GitHub Repositories</h1>

          <form onSubmit={handleAddRepository} className="repositories-page__form">
            <input
              type="text"
              value={newRepoPath}
              onChange={(e) => setNewRepoPath(e.target.value)}
              placeholder="Enter repository path (e.g., facebook/react)"
              required
            />
            <button type="submit">
              Add Repository
            </button>
          </form>

          {error && (
            <div className="repositories-page__error">
              {error}
            </div>
          )}

          <div className="repositories-page__table-container">
            <table className="repositories-page__table">
              <thead>
                <tr>
                  <th>Owner</th>
                  <th>Name</th>
                  <th>URL</th>
                  <th>Stars</th>
                  <th>Forks</th>
                  <th>Open Issues</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {repositories.map((repo) => (
                  <tr key={repo.id}>
                    <td>{repo.owner}</td>
                    <td>{repo.name}</td>
                    <td>
                      <a href={repo.url} target="_blank" rel="noopener noreferrer">
                        {repo.url}
                      </a>
                    </td>
                    <td>{repo.stars}</td>
                    <td>{repo.forks}</td>
                    <td>{repo.openIssues}</td>
                    <td>
                      {new Date(repo.githubCreatedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        onClick={() => handleUpdateRepository(repo.id)}
                        className="update"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteRepository(repo.id)}
                        className="delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 
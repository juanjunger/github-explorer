import { http, HttpResponse } from 'msw'

const GITHUB_API = 'https://api.github.com'

/**
 * Default MSW handlers — override per-test with `server.use(...)`
 * when you need a specific scenario (404, network error, custom payload, etc).
 */
export const handlers = [
  http.get(`${GITHUB_API}/search/users`, ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q') ?? ''

    if (query.includes('naoencontrado')) {
      return HttpResponse.json({
        total_count: 0,
        items: [],
      })
    }

    return HttpResponse.json({
      total_count: 2,
      items: [
        {
          id: 1,
          login: 'mockuser',
          avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
          html_url: 'https://github.com/mockuser',
        },
        {
          id: 2,
          login: 'mockuser-dev',
          avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
          html_url: 'https://github.com/mockuser-dev',
        },
      ],
    })
  }),

  http.get(`${GITHUB_API}/users/:username`, ({ params }) => {
    const { username } = params
    return HttpResponse.json({
      login: username,
      avatar_url: `https://avatars.githubusercontent.com/u/0?v=4`,
      bio: 'Mock user bio',
      followers: 42,
      following: 7,
      public_repos: 3,
    })
  }),

  http.get(`${GITHUB_API}/users/:username/repos`, () => {
    return HttpResponse.json([
      {
        id: 1,
        name: 'awesome-repo',
        description: 'A great repository',
        stargazers_count: 100,
        language: 'TypeScript',
        html_url: 'https://github.com/mock/awesome-repo',
        updated_at: '2025-01-01T00:00:00Z',
        owner: { login: 'mock' },
      },
    ])
  }),

  http.get(`${GITHUB_API}/repos/:owner/:repo`, ({ params }) => {
    return HttpResponse.json({
      id: 1,
      name: params.repo,
      description: 'A mocked repo',
      stargazers_count: 100,
      language: 'TypeScript',
      html_url: `https://github.com/${String(params.owner)}/${String(params.repo)}`,
      updated_at: '2025-01-01T00:00:00Z',
      owner: { login: params.owner },
    })
  }),
]

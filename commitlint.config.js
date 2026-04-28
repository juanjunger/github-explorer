/**
 * Conventional Commits enforcement.
 * Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.
 * Subject case is "any" to keep Portuguese commit messages natural.
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
  },
}

// .remarkrc.js
exports.plugins = [
  require('remark-frontmatter'),
  [
    require('remark-retext'),
    require('unified')().use({
      plugins: [
        require('retext-english'),
        require('retext-syntax-urls'),
        [require('retext-sentence-spacing'), { preferred: 1 }],
        require('retext-repeated-words'),
        require('retext-usage'),
      ],
    }),
  ],
  require('remark-preset-lint-consistent'),
  require('remark-preset-lint-recommended'),
  require('remark-preset-lint-markdown-style-guide'),
];
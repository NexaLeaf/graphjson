// @ts-check

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'GraphJSON',
  tagline: 'Type-safe GraphQL query building for TypeScript',
  url: 'https://nexaleaf.github.io',
  baseUrl: '/graphjson/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'NexaLeaf',
  projectName: 'graphjson',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/NexaLeaf/graphjson/tree/main/apps/docs/',
        },
        blog: false,
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          filename: 'sitemap.xml',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'GraphJSON',
        items: [
          { to: '/', label: 'Docs', position: 'left' },
          {
            href: 'https://github.com/NexaLeaf/graphjson',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'Getting Started', to: '/getting-started' },
              { label: 'JSON DSL Reference', to: '/json-dsl-reference' },
              { label: 'API Reference', to: '/api-reference' },
            ],
          },
          {
            title: 'Community',
            items: [{ label: 'GitHub', href: 'https://github.com/NexaLeaf/graphjson' }],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} NexaLeaf`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;

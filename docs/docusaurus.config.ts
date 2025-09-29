import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Airnub Docs',
  tagline: 'Monorepo architecture, Supabase, CI, and operations',
  favicon: 'img/logo.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://airnub.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/airnub-site/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'airnub', // Usually your GitHub org/user name.
  projectName: 'airnub-site', // Usually your repo name.

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/airnub/airnub-site/tree/main/docs/docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Airnub Docs',
      items: [
        {type: 'doc', docId: 'architecture', position: 'left', label: 'Architecture'},
        {type: 'doc', docId: 'development', position: 'left', label: 'Development'},
        {type: 'doc', docId: 'supabase', position: 'left', label: 'Supabase'},
        {type: 'doc', docId: 'ci', position: 'left', label: 'CI & Contribution'},
        {type: 'doc', docId: 'remote-operations', position: 'left', label: 'Remote Ops'},
        {href: 'https://github.com/airnub/airnub-site', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Guides',
          items: [
            {label: 'Architecture & Rendering', to: '/docs/architecture'},
            {label: 'Local Development', to: '/docs/development'},
            {label: 'Supabase', to: '/docs/supabase'},
            {label: 'CI & Contribution Workflow', to: '/docs/ci'},
            {label: 'Remote Operations', to: '/docs/remote-operations'},
          ],
        },
        {
          title: 'Airnub',
          items: [
            {label: 'Main Site', href: 'https://airnub.io'},
            {label: 'Speckit Microsite', href: 'https://speckit.airnub.io'},
            {label: 'GitHub', href: 'https://github.com/airnub/airnub-site'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Airnub Technologies Limited. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

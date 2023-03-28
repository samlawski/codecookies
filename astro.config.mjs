import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import { rehypeHeadingIds } from '@astrojs/markdown-remark'

import remarkToc from 'remark-toc'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

// https://astro.build/config
export default defineConfig({
  site: 'https://codecookies.xyz',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [[remarkToc, { heading: 'Contents' }]],
    rehypePlugins: [rehypeHeadingIds, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
  }
});
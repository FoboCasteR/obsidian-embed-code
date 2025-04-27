import { loadPrism, Plugin, TFile } from 'obsidian';

export default class EmbedCodePlugin extends Plugin {
  async onload() {
    this.registerMarkdownPostProcessor(async (el, {sourcePath}) => {
      const Prism = await loadPrism();
      const embeds = Array.from(el.querySelectorAll('span.internal-embed'));

      for (const embed of embeds) {
        const src = embed.getAttribute('src');

        if (src == null) continue;

        const file = this.app.metadataCache.getFirstLinkpathDest(src, sourcePath);

        if (file instanceof TFile && file.extension in Prism.languages) {
          const content = await this.app.vault.cachedRead(file);
          const pre = document.createElement('pre');
          const code = document.createElement('code');

          code.className = `language-${file.extension}`;
          code.textContent = content;
          pre.appendChild(code);
          embed.replaceWith(pre);

          Prism.highlightElement(code);
        }
      }
    });
  }
}

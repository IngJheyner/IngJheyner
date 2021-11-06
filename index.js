const fs = require('fs').promises;

const Parser = require('rss-parser');
const parser = new Parser();

const LATEST_ARTICLE_PLACEHOLDER = '%{{latest_article}}%'

;(async() => {
    const markdownTemplate = await fs.readFile('./README.md.tpl', {encoding: 'utf-8'});
    const {items} = await parser.parseURL('https://midu.dev/index.xml');
    const [{title, link}] = items;
    const latestArticleMarkdown = `[${title}](${link})`;
    const newMarkdown = markdownTemplate.replace(LATEST_ARTICLE_PLACEHOLDER, latestArticleMarkdown);
    await fs.writeFile('./README.md', newMarkdown);
})();
const fs = require('fs').promises;

const Parser = require('rss-parser');
const parser = new Parser();

const LATEST_NOTICIE_PLACEHOLDER = '%{{latest_article}}%'

const getLatestNoticieFromBlog = () =>
  parser.parseURL("https://computerhoy.com/rss_all/all/rss.xml").then((data) => data.items);

const generateCastingHTML = ({ title, link, enclosure }) => `
<div id="noticie-technology__items">
    <h4><a href='${link}'>${title}</a></h4>
    <a href='${link}' target='_blank'>
        <img width='30%' src='${enclosure.url}' alt='${title}' />
    </a>
</div>
`;

;(async() => {

    const [template, noticie] = await Promise.all([
        fs.readFile('./README.md.tpl', {encoding: 'utf-8'}),
        getLatestNoticieFromBlog(),
    ]);

    //const {items} = await parser.parseURL('https://computerhoy.com/rss_all/all/rss.xml');
    //const [{title, link}] = items;

    const latestNoticieMarkdown = noticie
        .slice(0, 5)
        .map(({ title, link, enclosure }) => { return generateCastingHTML({title, link, enclosure}); })
        .join('\n');

    const newMarkdown = template.replace(LATEST_NOTICIE_PLACEHOLDER, latestNoticieMarkdown);
    await fs.writeFile('./README.md', newMarkdown);
})();
#!/usr/bin/env node

const URL = require('url');
const AssetGraph = require('assetgraph');

const [inputUrl, ...args] = process.argv.slice(2);

async function crawlFonts(url) {
  const root = URL.parse(url).origin;
  const graph = new AssetGraph({ root });

  graph.on('warn', function (){});

  await graph.loadAssets(url);

  await graph.populate({
    followRelations: {
      $or: [
        {
          to: {
            type: 'Css'
          }
        },
        {
          type: { $in: [
            'HttpRedirect',
            'HtmlStyle',
            'CssImport',
            'CssFontFaceSrc'
          ] }
        }
      ]
    }
  });

  const fontFaceRelations = graph.findRelations({
    type: 'CssFontFaceSrc'
  });

  for (const relation of fontFaceRelations) {
    console.log(relation.node.toString());
  }
}

crawlFonts(inputUrl);

// module.exports = crawlFonts;

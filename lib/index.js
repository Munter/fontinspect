const log = require('debug')('fontinspect');
const URL = require('url');
const AssetGraph = require('assetgraph');
const prettyBytes = require('pretty-bytes');
const groupBy = require('lodash.groupby');

async function fontInspect(url) {
  const root = URL.parse(url).origin;
  const graph = new AssetGraph({ root });

  graph.on('warn', function(err) {
    log(err);
  });

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
          type: {
            $in: ['HttpRedirect', 'HtmlStyle', 'CssImport', 'CssFontFaceSrc']
          }
        }
      ]
    }
  });

  const { fontInfo } = await graph.subsetFonts({
    onlyInfo: true
  });

  if (!fontInfo.length) {
    console.log('[]');
    process.exit();
  }

  for (const { htmlAsset, fontUsages } of fontInfo) {
    let sumSmallestOriginalSize = 0;
    let maxUsedCodePoints = 0;
    let maxOriginalCodePoints = 0;
    for (const fontUsage of fontUsages) {
      sumSmallestOriginalSize += fontUsage.smallestOriginalSize;
      maxUsedCodePoints = Math.max(
        fontUsage.codepoints.used.length,
        maxUsedCodePoints
      );
      maxOriginalCodePoints = Math.max(
        fontUsage.codepoints.original.length,
        maxOriginalCodePoints
      );
    }
    const fontUsagesByFontFamily = groupBy(
      fontUsages,
      fontUsage => fontUsage.props['font-family']
    );
    const numFonts = Object.keys(fontUsagesByFontFamily).length;
    console.error(
      `${htmlAsset}: ${numFonts} font${numFonts === 1 ? '' : 's'} (${
        fontUsages.length
      } variant${fontUsages.length === 1 ? '' : 's'}) in use, ${prettyBytes(
        sumSmallestOriginalSize
      )} total.`
    );
    for (const fontFamily of Object.keys(fontUsagesByFontFamily).sort()) {
      console.error(`  ${fontFamily}:`);
      for (const fontUsage of fontUsagesByFontFamily[fontFamily]) {
        const variantShortName = `${fontUsage.props['font-weight']}${
          fontUsage.props['font-style'] === 'italic' ? 'i' : ' '
        }`;
        console.error(
          `    ${variantShortName}: ${String(
            fontUsage.codepoints.used.length
          ).padStart(String(maxUsedCodePoints).length)}/${String(
            fontUsage.codepoints.original.length
          ).padStart(
            String(maxOriginalCodePoints).length
          )} codepoints used (${Number(
            (fontUsage.codepoints.used.length /
              fontUsage.codepoints.original.length) *
              100
          ).toFixed(1)}%)`
        );
      }
    }
  }

  console.error(' ');

  const styleOrder = ['normal', 'italic', 'oblique'];
  const output = fontInfo[0].fontUsages
    .sort((a, b) => {
      if (a.props['font-family'] !== b.props['font-family']) {
        // Alphabetically by font-family
        return a.props['font-family'] > b.props['font-family'];
      }

      const aWeight = Number(a.props['font-weight']);
      const bWeight = Number(b.props['font-weight']);
      if (aWeight !== bWeight) {
        // Ascending by font-weight
        return aWeight > bWeight;
      }

      return (
        styleOrder.indexOf(a.props['font-style']) >
        styleOrder.indexOf(b.props['font-style'])
      );
    })
    .map(({ fontUrl, props, text, codepoints: { used }, texts }) => {
      return {
        fontUrl,
        props: {
          'font-family': props['font-family'],
          'font-weight': props['font-weight'],
          'font-style': props['font-style'],
          'font-stretch': props['font-stretch'],
          'font-display': props['font-display'],
          src: props['src']
        },
        characters: text,
        codepoints: used,
        textNodes: texts
      };
    });

  console.log(JSON.stringify(output, undefined, 2));
}

module.exports = fontInspect;

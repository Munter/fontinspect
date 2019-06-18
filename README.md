# fontinspect

Fontinspect is a command line tool that will trace the web font usage of a particular web page. It is a cut-down version of the engine that runs inside [subfont](https://www.npmjs.com/package/subfont), an automated font subsetter and loading optimizer.

This data-only version has been created to aid the [W3C Web Font Working Group]() with the data analysis for the 2018 chartered [Progressive Font Enrichment specification](https://www.w3.org/Fonts/WG/webfonts-2018.html).

## Installation

```
npm i -g fontinspect
```

## Usage

```
fontinspect https://exampleurl.com
```

## Output

The tool will output some status messages on `STDERR` and stream out the measured font usage on `STDOUT`.

**Example output**

```
$ bin/fontinspect https://www.zachleat.com/
```

```json
[
  {
    "fontUrl": "https://www.zachleat.com/web/css/fonts/lato/2.0/LatoLatin-Italic-subset.woff2",
    "props": {
      "font-family": "LatoItalic",
      "font-weight": "normal",
      "font-style": "italic",
      "font-stretch": "normal",
      "src": "url(/web/css/fonts/lato/2.0/LatoLatin-Italic-subset.woff2) format(\"woff2\"),url(/web/css/fonts/lato/2.0/LatoLatin-Italic-subset.zopfli.woff) format(\"woff\")"
    },
    "characters": " (),.FILOSTUabcdefghilmnorstuvwxy",
    "codepoints": [
      32,
      40,
      41,
      44,
      46,
      70,
      73,
      76,
      79,
      83,
      84,
      85,
      97,
      98,
      99,
      100,
      101,
      102,
      103,
      104,
      105,
      108,
      109,
      110,
      111,
      114,
      115,
      116,
      117,
      118,
      119,
      120,
      121
    ],
    "textNodes": [
      " Flash of Invisible Text (FOIT)",
      " Flash of Unstyled Text (FOUT)",
      " First stage, Lato subset embedded",
      " Second stage, all web fonts finished."
    ]
  }
]
```

## License

[ISC](https://tldrlegal.com/license/-isc-license)

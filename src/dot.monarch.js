export const monarch = {
  keywords: ["node", "edge", "graph", "digraph", "subgraph", "strict"],

  attributes: [
    "area",
    "arrowhead",
    "arrowsize",
    "arrowtail",
    "aspect",
    "bb",
    "bgcolor",
    "center",
    "charset",
    "clusterrank",
    "color",
    "colorscheme",
    "comment",
    "compound",
    "concentrate",
    "constraint",
    "Damping",
    "decorate",
    "defaultdist",
    "dim",
    "dimen",
    "dir",
    "diredgeconstraints",
    "distortion",
    "dpi",
    "edgehref",
    "edgetarget",
    "edgetooltip",
    "edgeURL",
    "epsilon",
    "esep",
    "fillcolor",
    "fixedsize",
    "fontcolor",
    "fontname",
    "fontnames",
    "fontpath",
    "fontsize",
    "forcelabels",
    "gradientangle",
    "group",
    "head_lp",
    "headclip",
    "headhref",
    "headlabel",
    "headport",
    "headtarget",
    "headtooltip",
    "headURL",
    "height",
    "href",
    "id",
    "image",
    "imagepath",
    "imagescale",
    "imagepos",
    "K",
    "label",
    "label_scheme",
    "labelangle",
    "labeldistance",
    "labelfloat",
    "labelfontcolor",
    "labelfontname",
    "labelfontsize",
    "labelhref",
    "labeljust",
    "labelloc",
    "labeltarget",
    "labeltooltip",
    "labelURL",
    "landscape",
    "layer",
    "layerlistsep",
    "layers",
    "layerselect",
    "layersep",
    "layout",
    "len",
    "levels",
    "levelsgap",
    "lhead",
    "lheight",
    "lp",
    "ltail",
    "lwidth",
    "margin",
    "maxiter",
    "mclimit",
    "mindist",
    "minlen",
    "mode",
    "model",
    "mosek",
    "nodesep",
    "nojustify",
    "normalize",
    "nslimit",
    "nslimit1",
    "ordering",
    "orientation",
    "orientation",
    "outputorder",
    "overlap",
    "overlap_scaling",
    "pack",
    "packmode",
    "pad",
    "page",
    "pagedir",
    "pencolor",
    "penwidth",
    "peripheries",
    "pin",
    "pos",
    "quadtree",
    "quantum",
    "rank",
    "rankdir",
    "ranksep",
    "ratio",
    "rects",
    "regular",
    "remincross",
    "repulsiveforce",
    "resolution",
    "root",
    "rotate",
    "rotation",
    "samehead",
    "sametail",
    "samplepoints",
    "scale",
    "searchsize",
    "sep",
    "shape",
    "shapefile",
    "showboxes",
    "sides",
    "size",
    "skew",
    "smoothing",
    "sortv",
    "splines",
    "start",
    "style",
    "stylesheet",
    "tail_lp",
    "tailclip",
    "tailhref",
    "taillabel",
    "tailport",
    "tailtarget",
    "tailtooltip",
    "tailURL",
    "target",
    "tooltip",
    "token",
    "truecolor",
    "URL",
    "vertices",
    "viewport",
    "voro_margin",
    "weight",
    "width",
    "xlabel",
    "xlp",
    "z",
  ],

  operators: ["->", "--"],

  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*\/\^%]+/,

  // C# style strings
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // identifiers and keywords
      [
        /[a-z_$][\w$]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@attributes": "attribute",
            "@default": "identifier",
          },
        },
      ],
      [/[A-Z][\w\$]*/, "type.identifier"], // to show class names nicely

      // whitespace
      { include: "@whitespace" },

      // delimiters and operators
      [/[{}()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],
      [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],

      // numbers
      [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/0[xX][0-9a-fA-F]+/, "number.hex"],
      [/\d+/, "number"],

      // delimiter: after number because of .\d floats
      [/[;,.]/, "delimiter"],

      // strings
      [/"([^"\\]|\\.)*$/, "string.invalid"], // non-teminated string
      [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],

      // characters
      [/'[^\\']'/, "string"],
      [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
      [/'/, "string.invalid"],
    ],

    comment: [
      [/[^\/*]+/, "comment"],
      [/\/\*/, "comment", "@push"], // nested comment
      ["\\*/", "comment", "@pop"],
      [/[\/*]/, "comment"],
    ],

    string: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
    ],

    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"],
    ],
  },
};

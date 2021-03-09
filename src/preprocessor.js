import * as dot from "./dot";

const reImageUrl = /(https?:\/\/.*\.(?:png|jpg))/gi;
export function extractImages(value) {
  const matches = value.matchAll(reImageUrl);
  if (!matches) return [];
  const matched = [];
  for (const match of matches) {
    matched.push(match[0]);
  }
  return matched;
}

function isNode(child) {
  return !!child.type;
}

function getNodeType(node) {
  return node.type;
}

function visit(ast, callbackMap) {
  function _visit(node, parent, key, index) {
    const nodeType = getNodeType(node);
    if (nodeType in callbackMap) {
      callbackMap[nodeType](node, parent, key, index);
    }

    for (const key of Object.keys(node)) {
      const child = node[key];
      if (Array.isArray(child)) {
        for (let j = 0; j < child.length; j++) {
          _visit(child[j], node, key, j);
        }
      } else if (isNode(child)) {
        _visit(child, node, key);
      }
    }
  }
  _visit(ast, null);
}

export function preprocess(value) {
  const ast = dot.parse(value);
  let output = value;
  visit(ast[0], {
    attr: (node) => {
      if (node.id == "token") {
        const location = node.location;
        const orig = value.substring(
          location.start.offset - 1,
          location.end.offset + 1
        );
        const proc = orig.replace(
          /token="(0x[a-fA-F0-9]{40})"/,
          'image="https://raw.githack.com/yearn/yearn-assets/master/icons/tokens/$1/logo-128.png"'
        );
        output = output.replace(orig, proc);
      }
    },
  });

  return output;
}

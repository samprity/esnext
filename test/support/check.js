import stripIndent from 'strip-indent';
import { convert } from '../../src/esnext';
import { deepEqual, strictEqual } from 'assert';

export default function check(input, output, options={}) {
  const result = convert(stripIndent(input).trim());
  strictEqual(result.code, stripIndent(output).trim());

  stripLocationInformation(result);

  deepEqual(result.warnings, options.warnings || []);

  if (options.metadata) {
    for (const key in options.metadata) {
      deepEqual(result.metadata[key], options.metadata[key]);
    }
  }

  if (options.ast) {
    deepEqual(result.ast, options.ast);
  }
}

function stripLocationInformation(node, seen=[]) {
  if (seen.indexOf(node) >= 0) {
    return;
  }
  seen.push(node);

  if (Array.isArray(node)) {
    node.forEach(child => stripLocationInformation(child, seen));
  } else if (node && typeof node === 'object') {
    delete node.loc;
    delete node.range;

    Object.getOwnPropertyNames(node)
      .forEach(name => stripLocationInformation(node[name], seen));
  }
}

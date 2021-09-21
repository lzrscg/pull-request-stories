import {
  ellipsis,
  emDash,
  InputRule,
  inputRules,
  smartQuotes,
  textblockTypeInputRule,
  wrappingInputRule,
} from "prosemirror-inputrules";
import { MarkType, NodeType, Schema } from "prosemirror-model";
import { Plugin } from "prosemirror-state";

// : (NodeType) → InputRule
// Given a blockquote node type, returns an input rule that turns `"> "`
// at the start of a textblock into a blockquote.
export function blockStrongRule(nodeType: NodeType): InputRule {
  return wrappingInputRule(/\*\*/, nodeType);
}

// : (NodeType) → InputRule
// Given a blockquote node type, returns an input rule that turns `"> "`
// at the start of a textblock into a blockquote.
export function blockEmRule(nodeType: NodeType): InputRule {
  return wrappingInputRule(/^\s*>\s$/, nodeType);
}

// : (NodeType) → InputRule
// Given a blockquote node type, returns an input rule that turns `"> "`
// at the start of a textblock into a blockquote.
export function blockQuoteRule(nodeType: NodeType): InputRule {
  return wrappingInputRule(/^\s*>\s$/, nodeType);
}

// : (NodeType) → InputRule
// Given a list node type, returns an input rule that turns a number
// followed by a dot at the start of a textblock into an ordered list.
export function orderedListRule(nodeType: NodeType): InputRule {
  return wrappingInputRule(
    /^(\d+)\.\s$/,
    nodeType,
    (match) => ({ order: +match[1] }),
    (match, node) => node.childCount + node.attrs.order == +match[1]
  );
}

// : (NodeType) → InputRule
// Given a list node type, returns an input rule that turns a bullet
// (dash, plush, or asterisk) at the start of a textblock into a
// bullet list.
export function bulletListRule(nodeType: NodeType): InputRule {
  return wrappingInputRule(/^\s*([-+*])\s$/, nodeType);
}

// : (NodeType) → InputRule
// Given a code block node type, returns an input rule that turns a
// textblock starting with three backticks into a code block.
export function codeBlockRule(nodeType: NodeType): InputRule {
  return textblockTypeInputRule(/^```$/, nodeType);
}

// : (NodeType, number) → InputRule
// Given a node type and a maximum level, creates an input rule that
// turns up to that number of `#` characters followed by a space at
// the start of a textblock into a heading whose level corresponds to
// the number of `#` signs.
export function headingRule(nodeType: NodeType, maxLevel: number): InputRule {
  return textblockTypeInputRule(
    new RegExp("^(#{1," + maxLevel + "})\\s$"),
    nodeType,
    (match) => ({ level: match[1].length })
  );
}

// https://discuss.prosemirror.net/t/input-rules-for-wrapping-marks/537/11
function markInputRule(
  regexp: RegExp,
  markType: MarkType,
  getAttrs?: Parameters<MarkType["create"]>
) {
  return new InputRule(regexp, (state, match, start, end) => {
    const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    const tr = state.tr;
    if (match[1]) {
      const textStart = start + match[0].indexOf(match[1]);
      const textEnd = textStart + match[1].length;
      if (textEnd < end) tr.delete(textEnd, end);
      if (textStart > start) tr.delete(start, textStart);
      end = start + match[1].length;
    }
    tr.addMark(start, end, markType.create(attrs));
    tr.removeStoredMark(markType); // Do not continue with mark.
    return tr;
  });
}

// : (Schema) → Plugin
// A set of input rules for creating the basic block quotes, lists,
// code blocks, and heading.
export function buildInputRules(schema: Schema): Plugin {
  const rules = smartQuotes.concat(ellipsis, emDash);
  let type: NodeType | MarkType;
  if ((type = schema.nodes.blockquote)) rules.push(blockQuoteRule(type));
  if ((type = schema.nodes.ordered_list)) rules.push(orderedListRule(type));
  if ((type = schema.nodes.bullet_list)) rules.push(bulletListRule(type));
  if ((type = schema.nodes.code_block)) rules.push(codeBlockRule(type));
  if ((type = schema.nodes.heading)) rules.push(headingRule(type, 6));
  if ((type = schema.marks.strong))
    rules.push(markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, type));
  if ((type = schema.marks.em))
    rules.push(markInputRule(/(?:^|[^*_])(?:\*|_)([^*_]+)(?:\*|_)$/, type));
  return inputRules({ rules });
}

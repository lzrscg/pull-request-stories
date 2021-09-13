import { Node, Schema } from "prosemirror-model";
import { Decoration, EditorView, NodeView } from "prosemirror-view";

// This is the type provided by Prosemirror
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NodeViews<S extends Schema = any> = {
  [name: string]: (
    node: Node<S>,
    view: EditorView<S>,
    getPos: (() => number) | boolean,
    decorations: Decoration[]
  ) => NodeView<S>;
} | null;

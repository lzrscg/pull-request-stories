import { Node as ProsemirrorNode, Schema } from "prosemirror-model";
import { Decoration, EditorView, NodeView } from "prosemirror-view";

// This is based on the type provided by Prosemirror
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default class CodeDiffView<S extends Schema = any>
  implements NodeView<S>
{
  public dom: Node | null;

  constructor(
    node: ProsemirrorNode<S>,
    view: EditorView<S>,
    getPos: (() => number) | boolean
  ) {
    const img = document.createElement("img");
    img.src = node.attrs.src;
    img.alt = node.attrs.alt;
    img.addEventListener("click", (e) => {
      e.preventDefault();
      const alt = prompt("New alt text:", "");
      if (alt && typeof getPos === "function")
        view.dispatch(
          view.state.tr.setNodeMarkup(getPos(), undefined, {
            src: node.attrs.src,
            alt,
          })
        );
    });
    this.dom = img;
  }

  // This is based on the type provided by Prosemirror
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static create<T extends Schema = any>(
    node: ProsemirrorNode<T>,
    view: EditorView<T>,
    getPos: (() => number) | boolean,
    decorations: Decoration[]
  ): CodeDiffView<T> {
    return new CodeDiffView(node, view, getPos);
  }

  public stopEvent(): boolean {
    return true;
  }
}

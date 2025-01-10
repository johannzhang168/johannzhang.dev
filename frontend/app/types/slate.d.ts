import { Text, BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

declare module "slate" {
  // Extend the Text interface to include custom properties
  interface Text {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    fontSize?: number;
    // Add more properties as needed
  }

  // Extend the Element interface to include block-level properties
  interface Element {
    type?: "paragraph" | "heading" | "list-item" | "block-quote";
    indentation?: number; // Indentation for the block
    children: Text[]; // Blocks contain children which are Text nodes
  }

  // Extend CustomTypes for Slate editor compatibility
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor; // Use Slate + React editor
    Element: Element; // Extend Element with block-level properties
    Text: Text; // Extend Text with inline formatting properties
  }
}

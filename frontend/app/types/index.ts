import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  fontColor?: string;
  font?: string;
};

export type CustomElement = {
  type: "paragraph";
  alignment?: "left"
  children: CustomText[];
  indentation?: number;
};

export type CustomDescendant = CustomElement | CustomText;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

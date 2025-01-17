import React, { useMemo, useState, useEffect } from "react";
import { Slate, Editable, withReact, useSlate, useSelected } from "slate-react";
import { createEditor, Editor, Transforms, Node, Text } from "slate";
import { CustomDescendant, CustomText, CustomElement } from "@app/types";
import { FaIndent, FaOutdent } from "react-icons/fa";

interface RichTextEditorProps {
  content: CustomDescendant[];
  onChange: (value: CustomDescendant[]) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [currentFontSize, setCurrentFontSize] = useState(20);
  const [currentFontFamily, setCurrentFontFamily] = useState("Sans-Serif");
  const [currentFontColor, setCurrentFontColor] = useState("#000000");

  const renderLeaf = ({ attributes, children, leaf }: any) => {
    let style: React.CSSProperties = {};

    if (leaf.bold) {
      style.fontWeight = "bold";
    }
    if (leaf.italic) {
      style.fontStyle = "italic";
    }
    if (leaf.underline) {
      style.textDecoration = "underline";
    }
    if (leaf.fontSize) {
      style.fontSize = `${leaf.fontSize}px`;
    } else {
      style.fontSize = "20px";
    }
    if (leaf.font) {
      style.fontFamily = leaf.font;
    }
    if (leaf.fontColor) {
      style.color = leaf.fontColor;
    }

    return (
      <span {...attributes} style={style}>
        {children}
      </span>
    );
  };

  const renderElement = ({ attributes, children, element }: any) => {
    const style = {
      paddingLeft: element.indentation ? `${element.indentation * 2}em` : "0em",
    };

    return (
      <div {...attributes} style={style}>
        {children}
      </div>
    );
  };

  useEffect(() => {
    const { selection } = editor;

    if (selection && Editor.string(editor, selection)) {
      const [match] = Editor.nodes(editor, {
        match: Text.isText,
        at: selection,
      });

      if (match) {
        const [node] = match;
        setCurrentFontSize(node.fontSize || 20);
        setCurrentFontFamily(node.font || "Sans-Serif");
      }
    }
  }, [editor.selection]);

  return (
    <Slate editor={editor} initialValue={content} onChange={(value) => onChange(value)}>
      <Toolbar
        currentFontSize={currentFontSize}
        currentFontFamily={currentFontFamily}
        currentFontColor={currentFontColor}
        setCurrentFontSize={setCurrentFontSize}
        setCurrentFontFamily={setCurrentFontFamily}
        setCurrentFontColor={setCurrentFontColor}
      />
      <Editable
        className="border p-2 rounded"
        spellCheck
        autoFocus
        renderLeaf={renderLeaf}
        renderElement={renderElement}
        style={{ minHeight: "50vh" }}
      />
    </Slate>

  );
};

const Toolbar: React.FC<{
  currentFontSize: number;
  currentFontFamily: string;
  currentFontColor: string;
  setCurrentFontSize: React.Dispatch<React.SetStateAction<number>>;
  setCurrentFontFamily: React.Dispatch<React.SetStateAction<string>>;
  setCurrentFontColor: React.Dispatch<React.SetStateAction<string>>;
}> = ({ currentFontSize, currentFontFamily, currentFontColor, setCurrentFontSize, setCurrentFontFamily, setCurrentFontColor }) => {
  const editor = useSlate();
  const isCustomElement = (node: any): node is CustomElement => {
    return typeof node === "object" && node.type !== undefined && Array.isArray(node.children);
  };
  const applyFontColor = (color: string) => {
    Editor.addMark(editor, "fontColor", color);
  };

  const applyFontSize = (size: number) => {
    Editor.addMark(editor, "fontSize", size);
  };

  const applyFontFamily = (font: string) => {
    console.log(font)
    Editor.addMark(editor, "font", font);
    
  };

  const isMarkActive = (format: keyof CustomText) => {
    const marks = Editor.marks(editor) as Partial<CustomText> | null;
    return marks ? marks[format] === true : false;
  };

  const toggleMark = (format: keyof CustomText) => {
    const isActive = isMarkActive(format);

    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const increaseIndentation = () => {
    const [match] = Editor.nodes(editor, {
      match: (n) => isCustomElement(n),
    });
  
    if (match) {
      const [node, path] = match;
  
      if (isCustomElement(node)) {
        const indentation = node.indentation || 0;
  
        Transforms.setNodes(
          editor,
          { indentation: indentation + 1 },
          { at: path }
        );
      }
    }
  };
  
  const decreaseIndentation = () => {
    const [match] = Editor.nodes(editor, {
      match: (n) => isCustomElement(n), 
    });
  
    if (match) {
      const [node, path] = match;
  
      if (isCustomElement(node)) {
        const indentation = node.indentation || 0;
  
        Transforms.setNodes(
          editor,
          { indentation: Math.max(indentation - 1, 0) },
          { at: path }
        );
      }
    }
  };
  

  return (
    <div className="toolbar flex space-x-2 mb-2">
      <button
        className={`p-2 border rounded ${isMarkActive("bold") ? "bg-blue-200" : "bg-gray-100"} hover:bg-gray-300`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark("bold");
        }}
      >
        <b>B</b>
      </button>
      <button
        className={`p-2 border rounded ${isMarkActive("italic") ? "bg-blue-200" : "bg-gray-100"} hover:bg-gray-300`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark("italic");
        }}
      >
        <i>I</i>
      </button>

      <button
        className={`p-2 border rounded ${isMarkActive("underline") ? "bg-blue-200" : "bg-gray-100"} hover:bg-gray-300`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark("underline");
        }}
      >
        <u>U</u>
      </button>

      
      <input
        type="text"
        className="w-20 text-center border rounded p-1"
        value={currentFontSize}
        onChange={(e) => {
          const value = e.target.value.trim();
          const size = Number(value);
          if (!isNaN(size) && size > 0) {
            applyFontSize(size);
            setCurrentFontSize(size);
          } else if (value === "") {
            setCurrentFontSize(0);
          }
        }}
        onBlur={(e) => {
          if (e.target.value.trim() === "" || isNaN(Number(e.target.value))) {
            setCurrentFontSize(20);
            applyFontSize(20);
          }
        }}
        placeholder="Font size"
      />

      <select
        className="border rounded p-1"
        value={currentFontFamily}
        onChange={(e) => {
          const font = e.target.value;
          applyFontFamily(font);
          setCurrentFontFamily(font);
        }}
      >
        <option value="Sans-Serif">Sans-Serif</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Arial">Arial</option>
        <option value="Courier New">Courier New</option>
        <option value="Georgia">Georgia</option>
        <option value="Verdana">Verdana</option>
      </select>

      <input
        type="color"
        value={currentFontColor}
        onChange={(e) => {
          const color = e.target.value;
          applyFontColor(color);
          setCurrentFontColor(color);
        }}
        className="w-[3vw]"
      />

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          increaseIndentation();
        }}
      >
        <FaIndent />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          decreaseIndentation();
        }}
      >
        <FaOutdent />
      </button>
    </div>
  );
};


export default RichTextEditor;

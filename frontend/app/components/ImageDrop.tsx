import React from "react";
import { useDropzone } from "react-dropzone";

interface ImageDropProps {
        onDrop: (file: File[]) => void;

}

const ImageDrop: React.FC<ImageDropProps> = ({onDrop}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { "image/*": [] },
      multiple: true,
    });

  return (
    <div
      {...getRootProps()}
      className={`p-4 border-dashed border-2 rounded ${
        isDragActive ? "border-blue-500" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here...</p>
      ) : (
        <p>Drag and drop images here, or click to select files</p>
      )}
    </div>
  );
}

export default ImageDrop;
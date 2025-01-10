import React, { useState } from "react";
import { CustomDescendant } from "@app/types";
import RichTextEditor from "@app/components/RichTextEditor";
import Toast from "react-hot-toast";
import ImageDrop from "@app/components/ImageDrop";
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";

const TextEditor: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<CustomDescendant[]>([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);
  const [uploading, setUploading] = useState<boolean>(false);
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const onDrop = async (files: File[]) => {
    setUploading(true);
    const validTypes: Set<string> = new Set([
      "image/heic",
      "image/jpeg",
      "image/png",
      "image/webp",
    ]);
  
    const processFile = async (fileOrBlob: Blob) => {
      const file = new File([fileOrBlob], "image.jpg", {
        type: fileOrBlob.type,
      });
      const options = {
        maxSizeMB: 3,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(file, options);
        const compressedUrl =
          await imageCompression.getDataUrlFromFile(compressedFile);
        return compressedUrl;
      } catch (error) {
        console.error("Error compressing image:", error);
        return null; 
      }
    };

    const processedFilesPromises = files.map(async (file) => {
      if (file.size > 5 * 1024 * 1024) {
        Toast.error("File Size Too Large! Max File Size 5MB");
        return null;
      }
      if (!validTypes.has(file.type)) {
        Toast.error("Unsupported File Type: " + file.type);
        return null;
      }
  
      if (file.type === "image/heic") {
        try {
          const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.7 });
          if (Array.isArray(result)) {
            const processedBlobs = await Promise.all(result.map((blob) => processFile(blob)));
            return processedBlobs.filter((url) => url !== null);
          } else {
            const processedBlob = await processFile(result);
            return processedBlob ? [processedBlob] : [];
          }
        } catch (error) {
          console.error("Error converting HEIC to JPEG:", error);
          return null;
        }
      } else {
        const processedFile = await processFile(file);
        return processedFile ? [processedFile] : [];
      }
    });
  
    const results = await Promise.all(processedFilesPromises);
  
    const flattenedResults = results.flat().filter((url) => url !== null);
  
    setImageURLs((prev) => [...prev, ...flattenedResults]);
  
    setUploading(false);
  };


  const handleContentChange = (updatedContent: CustomDescendant[]) => {
    setContent(updatedContent); 
  };

  const handleSubmit = async () => {
    const data = {
      title,
      image_urls: imageURLs,
      content,
      description
    };
    console.log(data);

    try {
      const imageUrls = []

      for(const image of data.image_urls) {

        const formData = new FormData();

        console.log(image);
        if (typeof image === "string" && image.startsWith("data:image")){
          const base64Data = image.split(",")[1];
          const contentType = image.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: contentType });
          const uuid = uuidv4();
          formData.append("file", blob, uuid);
        }
        console.log(formData)
        const response = await fetch(baseurl + "/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok){
          Toast.error("error");
          return;
        }
        const data = await response.json()
        imageUrls.push(data.url);
      }
      data.image_urls = imageUrls;
      const response = await fetch(baseurl + "/newsletters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {

        Toast.success("Newsletter submitted successfully!");
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="text-editor-container">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <textarea
        placeholder="Description (max 100 characters)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        maxLength={100}
        rows={3}
      />
      <div className="mb-4">
        <ImageDrop onDrop={onDrop}/>
        {uploading && <p>Uploading images...</p>}

        <div className="mt-2 overflow-x-auto">
          <div
            className="flex gap-1"
            style={{ width: `${Math.max(imageURLs.length * 100, 800)}px` }}
          >
            {imageURLs.map((url, index) => (
              <div key={index} className="relative flex-none" style={{ width: "100px", height: "100px" }}>
                <img src={url} alt={`Slide ${index + 1}`} className="h-full w-full object-cover" />
                <button
                  onClick={() =>
                    setImageURLs(imageURLs.filter((_, i) => i !== index))
                  }
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-full"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RichTextEditor content={content} onChange={handleContentChange} />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 rounded mt-4"
      >
        Submit Newsletter
      </button>
    </div>
  );
};

export default TextEditor;

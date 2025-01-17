import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { CustomDescendant } from "@app/types";
import RichTextEditor from "@app/components/RichTextEditor";
import Toast from "react-hot-toast";
import ImageDrop from "@app/components/ImageDrop";
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import NotFound from "./Empty";
import { useUser } from "@app/context/UserContext";



const EditNewsletter: React.FC = () => {
  const { newsletterId } = useParams<{ newsletterId: string }>();
  const [title, setTitle] = useState<string>("");
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [content, setContent] = useState<CustomDescendant[]>([]);
  const [description, setDescription] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [published, setPublished] = useState<boolean>(false);
  const [originalNewsletterPublished, setOriginalNewsletterPublished] = useState<boolean>(false);

  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const {currentUser} = useUser();

  if(!currentUser || currentUser.status != "ADMIN") {
    return(
      <NotFound/>
    );
  }

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const response = await fetch(`${baseurl}/newsletters/get/${newsletterId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch the newsletter");
        }

        const data = await response.json();
        const transformedContent = data.newsletter.Content.map((block: any) => ({
          type: block.Type.toLowerCase(), 
          alignment: block.Alignment || "", 
          indentation: block.Indentation || 0, 
          children: block.Children.map((span: any) => ({
            text: span.Text,
            bold: span.Bold || false,
            italic: span.Italic || false,
            underline: span.Underline || false,
            font: span.Font || "",
            fontSize: span.FontSize || 20,
            fontColor: span.FontColor || "#000000",
          })),
        }));
        setTitle(data.newsletter.Title);
        setDescription(data.newsletter.Description || "");
        setImageURLs(data.newsletter.ImageURLs || []);
        setContent(transformedContent|| []);
        setPublished(data.newsletter.Published || false);
        setOriginalNewsletterPublished(data.newsletter.Published || false);

        
      } catch (error) {
        console.error("Error fetching newsletter:", error);
        Toast.error("Failed to load the newsletter.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletter();
  }, [newsletterId]);

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
  
  const handleDelete = async () => {
    if (!newsletterId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this newsletter? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${baseurl}/newsletters/delete/${newsletterId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        Toast.success("Newsletter deleted successfully!");
        window.location.href = "/";
      } else {
        console.error("Error deleting newsletter:", response.statusText);
        Toast.error("Failed to delete the newsletter.");
      }
    } catch (error) {
      console.error("Error:", error);
      Toast.error("An error occurred while deleting the newsletter.");
    }
  };

  const handleContentChange = (updatedContent: CustomDescendant[]) => {
    setContent(updatedContent);
  };

  const handleSubmit = async () => {
    let data: { 
      title: string; 
      image_urls: string[]; 
      content: CustomDescendant[]; 
      description: string; 
      published?: boolean;
    } = {
      title,
      image_urls: imageURLs,
      content,
      description,
      published,
    };

    try {
      const imageUrls = []
      if(data.published === originalNewsletterPublished){
        delete data.published;
      }
      for(const image of data.image_urls) {

        const formData = new FormData();

        if (typeof image === "string" && image.startsWith("data:image")){
          const base64Data = image.split(",")[1];
          const contentType = image.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: contentType });
          const uuid = uuidv4();
          formData.append("file", blob, uuid);
          const response = await fetch(baseurl + "/upload", {
            method: "POST",
            body: formData,
            headers: {
              "X-Source-Page": "newsletters"
            },
          });
          
          if (!response.ok){
            Toast.error("error");
            return;
          }
          const data = await response.json()
          imageUrls.push(data.url);
        }  
        else{
          imageUrls.push(image);
        } 
      }

      data.image_urls = imageUrls;

      const response = await fetch(baseurl + `/newsletters/edit/${newsletterId}`, {
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-Source-Page": "newsletters",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Toast.success("Newsletter updated successfully!");
        navigate(`/blog/${newsletterId}`);
      } else {
        console.error("Error:", response.statusText);
        Toast.error("Failed to update the newsletter.");
      }
    } catch (error) {
      console.error("Error:", error);
      Toast.error("An error occurred while updating the newsletter.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className= "flex flex-col space-y-5">
      
      <div className="flex justify-end">
        <button className="bg-red-600 w-30 h-10 px-2 text-sm text-white rounded-lg hover:bg-red-900" onClick={handleDelete}>
          Delete Newsletter
        </button>
      </div>

      <label className="flex items-center space-x-2">
          <span className="text-sm">Published:</span>
          <input
            type="checkbox"
            checked={published}
            onChange={() => setPublished(!published)} // Toggle local state
            className="toggle-checkbox h-5 w-10 rounded-full"
          />
      </label>
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
              style={{ width: `${Math.max(imageURLs.length * 100, 800)}px` }} // Ensure at least 8 images fit in the container
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
          Update Newsletter
        </button>
      </div>
    </div>
    
  );
};

export default EditNewsletter;

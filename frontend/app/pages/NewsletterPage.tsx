import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CustomDescendant, CustomElement, CustomText } from "@app/types";
import NotFound from "./Empty";
import ImageSlideshow from "@app/components/ImageSlideshow";
import { useUser } from "@app/context/UserContext";

interface Newsletter {
  id: string;
  Title: string;
  ImageURLs: string[];
  Content: CustomElement[];
  Description: string;
  created_at: Date;
  updated_at: Date;
  Published: boolean;
  DatePublished: Date | null;
}



const NewsletterPage: React.FC = () => {
  const { newsletterId } = useParams<{ newsletterId: string }>();
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useUser();


  const baseurl = import.meta.env.VITE_API_BASE_URL
  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const response = await fetch(`${baseurl}/newsletters/get/${newsletterId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch the newsletter");
        }
        const data = await response.json();
        setNewsletter(data.newsletter);
      } catch (err) {
        setError("Failed to load the newsletter");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletter();
  }, [newsletterId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!newsletter || newsletter.Published === false) return <NotFound />;

  const isUpdated =
    new Date(newsletter.updated_at).getTime() !== new Date(newsletter.created_at).getTime();

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl md:lg:text-3xl font-semibold">{newsletter.Title}</h1>
        {currentUser && currentUser.status === "ADMIN" && (
          <button
            onClick={() => navigate(`/blog/edit/${newsletter.id}`)}
            className="bg-transparent text-black px-4 py-2 rounded border border-black hover:bg-gray-300"
          >
            Edit Blog
          </button>
        )}
      </div>
      <p className="text-gray-600 text-md md:lg:text-lg">
        {formatDate(newsletter.DatePublished || newsletter.created_at)}
        {isUpdated && (
          <>
            {" | "}Updated on: {formatDate(newsletter.updated_at)}
          </>
        )}
      </p>
      {newsletter.ImageURLs && newsletter.ImageURLs.length > 0 && (
        <div className="my-4">
          <ImageSlideshow images={newsletter.ImageURLs} />
        </div>
      )}
      <div className="mt-10">
        {newsletter.Content.map((block, index) => (
          <ContentBlockRenderer key={index} block={block} />
        ))}
      </div>
    </div>
  );
};

const toLowerCaseKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => toLowerCaseKeys(item));
  } else if (typeof obj === "object" && obj !== null) {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key.toLowerCase()] = toLowerCaseKeys(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
};

const ContentBlockRenderer: React.FC<{ block: CustomElement }> = ({ block }) => {
  const lowerCaseBlock = toLowerCaseKeys(block);

  const blockStyle: React.CSSProperties = {
    textAlign: lowerCaseBlock.alignment,
    paddingLeft: lowerCaseBlock.indentation
      ? `${lowerCaseBlock.indentation * 2}em`
      : "0em",
  };

  return (
    <div style={blockStyle} className="my-4">
      {lowerCaseBlock.children.map((span: any, index: number) => {
        const spanStyle: React.CSSProperties = {
          fontWeight: span.bold ? "bold" : "normal",
          fontStyle: span.italic ? "italic" : "normal",
          textDecoration: span.underline ? "underline" : "none",
          fontSize: span.fontsize ? `${span.fontsize}px` : "inherit",
          color: span.fontcolor || "inherit",
          fontFamily: span.font || "inherit",
        };

        return (
          <span key={index} style={spanStyle} className="break-words">
            {span.text}
          </span>
        );
      })}
    </div>
  );
};

export default NewsletterPage;

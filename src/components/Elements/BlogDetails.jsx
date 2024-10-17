import React from "react";
import Loader from "../UI/Loader";
import DOMPurify from "dompurify";

const BlogDetails = ({ title, snippet, content }) => {
  const sanitizedDescription = DOMPurify.sanitize(content);

  return (
    <div className="w-full mx-auto bg-white p-5 rounded-lg shadow-md font-sans">
      <header className="text-center mb-5 p-5 rounded-lg shadow-lg">
        <h3 className="text-3xl font-bold text-gray-800">{title}</h3>
      </header>
      <div className="flex justify-between">
        <div className="w-full">
          {title ? (
            <>
              <p className="text-gray-600 leading-relaxed mt-4">{snippet}</p>
              <p
                className="text-gray-600 leading-relaxed mt-4"
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              ></p>
            </>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;

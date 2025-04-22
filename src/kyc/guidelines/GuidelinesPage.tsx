import React, { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import {
  FaCamera,
  FaShareAlt,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Define proper TypeScript interfaces for the component props
interface MarkdownHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

interface MarkdownImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
}

interface MarkdownListProps extends React.HTMLAttributes<HTMLUListElement> {
  children?: ReactNode;
}

// Custom Heading Components with Accessibility Fixes
const MarkdownH1: React.FC<MarkdownHeadingProps> = ({ children, ...props }) => (
  <h1
    className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center"
    {...props}
  >
    {children || "Untitled"} {/* Fallback content for accessibility */}
  </h1>
);

const MarkdownH2: React.FC<MarkdownHeadingProps> = ({ children, ...props }) => {
  const childrenArray = React.Children.toArray(children);
  const firstChild = childrenArray[0];

  return (
    <h2
      className="text-xl md:text-2xl font-semibold text-gray-800 mt-8 mb-4 flex items-center"
      {...props}
    >
      {typeof firstChild === "string" && firstChild.startsWith("Step 1") && (
        <FaCamera className="mr-2 text-teal-600" aria-hidden="true" />
      )}
      {typeof firstChild === "string" && firstChild.startsWith("Step 2") && (
        <FaShareAlt className="mr-2 text-teal-600" aria-hidden="true" />
      )}
      {typeof firstChild === "string" && firstChild.startsWith("Step 3") && (
        <FaCheckCircle className="mr-2 text-teal-600" aria-hidden="true" />
      )}
      {children || "Untitled"} {/* Fallback content for accessibility */}
    </h2>
  );
};

const MarkdownUl: React.FC<MarkdownListProps> = (props) => (
  <ul className="list-disc list-inside space-y-3 text-gray-700" {...props} />
);

const MarkdownImg: React.FC<MarkdownImageProps> = (props) => (
  <div className="flex justify-center my-6">
    <img
      {...props}
      className="rounded-lg shadow-md"
      style={{ maxWidth: "100%", height: "auto", width: "70%" }}
      alt={props.alt ?? "Instruction Image"}
    />
  </div>
);

const GuidelinesPage: React.FC = () => {
  const navigate = useNavigate();

  const guidelines = `
---

## Step 1: Capture a High-Quality Photo

- Use WhatsApp's camera to take a photo of your document (e.g., front ID, back ID, selfie, or tax ID).
- **Tips for a great photo**:
  - Ensure the entire document is visible in the frame.
  - Make sure the text is sharp and easy to read.
  - Use bright, even lighting to avoid glare or shadows.

---

## Step 2: Share the Photo with Webank

![Step 1 Image](./share-via.jpeg)

- Open WhatsApp and locate the photo you just captured. 

**Follow these steps:**
  1. Press and hold the photo to select it.
  2. Tap the "Share" option.
  3. From the list of apps, choose "Webank."

![Step 2 Image](./choose-app.jpeg)

---

## Step 3: Confirm and Submit the Document

![Step 3 Image](./pic-options.jpeg)

**After clicking on Webank to share:**
  1. Select the appropriate document type (e.g., front ID, back ID, selfie ID, or tax ID).
  2. Submit the document to complete the upload process.

- **Why is this important?** Properly categorizing your document ensures it is processed accurately and efficiently.

---

## Pro Tips for a Successful Upload

- **Check Photo Clarity**: Ensure the photo is clear and all text is legible before sharing.
- **Hold Steady**: Keep your phone steady while taking the photo to avoid blurriness.
- **Retake if Necessary**: If the photo is blurry or unclear, retake it for better results.

---

**Ready to proceed?** Click the button below to move to the next step!
  `;

  const handleAdvance = () => {
    navigate("/kyc/imgs");
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Define custom components for ReactMarkdown with proper typing
  const markdownComponents: Components = {
    h1: MarkdownH1,
    h2: MarkdownH2,
    ul: MarkdownUl,
    img: MarkdownImg,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4 md:px-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 md:p-12 transition-all duration-300">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 transition duration-200 mb-6"
          aria-label="Go back"
        >
          <FaArrowLeft className="h-5 w-5" aria-hidden="true" />
          <span className="text-lg font-medium">Back</span>
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center justify-center">
            <FaCheckCircle className="mr-3 text-teal-600" aria-hidden="true" />{" "}
            Upload Guide
          </h1>
          <p className="mt-4 text-gray-600 text-lg md:text-xl">
            Welcome! This guide will help you upload your documents securely and
            efficiently. Follow these steps for a smooth process.
          </p>
        </div>

        <div className="prose prose-md text-gray-800 space-y-8 mx-auto">
          <ReactMarkdown components={markdownComponents}>
            {guidelines}
          </ReactMarkdown>
        </div>

        <button
          onClick={handleAdvance}
          className="mt-10 w-full bg-teal-600 text-white text-lg font-bold py-4 rounded-xl hover:bg-teal-700 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          Advance
        </button>
      </div>
    </div>
  );
};

export default GuidelinesPage;

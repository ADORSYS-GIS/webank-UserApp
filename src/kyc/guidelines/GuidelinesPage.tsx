import React, { ReactNode } from 'react';
import {
  FaArrowLeft,
  FaCamera,
  FaCheckCircle,
  FaLightbulb,
  FaShareAlt,
} from 'react-icons/fa';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router';

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

interface MarkdownParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

// Custom Heading Components with Accessibility Fixes
const MarkdownH1: React.FC<MarkdownHeadingProps> = ({ children, ...props }) => (
  <h1
    className='text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center font-inter tracking-tight'
    {...props}>
    {children || 'Untitled'} {/* Fallback content for accessibility */}
  </h1>
);

const MarkdownH2: React.FC<MarkdownHeadingProps> = ({ children, ...props }) => {
  const childrenArray = React.Children.toArray(children);
  const firstChild = childrenArray[0];

  return (
    <h2
      className='text-xl md:text-2xl font-semibold text-gray-800 mt-10 mb-5 flex items-center font-inter tracking-tight'
      {...props}>
      {typeof firstChild === 'string' && firstChild.startsWith('Step 1') && (
        <FaCamera
          className='mr-3 text-blue-600 text-xl flex-shrink-0'
          aria-hidden='true'
        />
      )}
      {typeof firstChild === 'string' && firstChild.startsWith('Step 2') && (
        <FaShareAlt
          className='mr-3 text-blue-600 text-xl flex-shrink-0'
          aria-hidden='true'
        />
      )}
      {typeof firstChild === 'string' && firstChild.startsWith('Step 3') && (
        <FaCheckCircle
          className='mr-3 text-blue-600 text-xl flex-shrink-0'
          aria-hidden='true'
        />
      )}
      {typeof firstChild === 'string' && firstChild.startsWith('Pro Tips') && (
        <FaLightbulb
          className='mr-3 text-amber-500 text-xl flex-shrink-0'
          aria-hidden='true'
        />
      )}
      {children || 'Untitled'} {/* Fallback content for accessibility */}
    </h2>
  );
};

const MarkdownUl: React.FC<MarkdownListProps> = (props) => (
  <ul
    className='list-disc list-outside pl-6 space-y-3 text-gray-700 font-inter'
    {...props}
  />
);

const MarkdownP: React.FC<MarkdownParagraphProps> = ({
  children,
  ...props
}) => (
  <p
    className='text-base md:text-lg text-gray-700 mb-4 font-inter leading-relaxed'
    {...props}>
    {children}
  </p>
);

const MarkdownImg: React.FC<MarkdownImageProps> = (props) => (
  <div className='flex justify-center my-6'>
    <img
      {...props}
      className='rounded-xl shadow-md'
      style={{ maxWidth: '100%', height: 'auto', width: '70%' }}
      alt={props.alt ?? 'Instruction Image'}
      loading='lazy'
    />
  </div>
);

const MarkdownHr: React.FC = () => (
  <hr className='my-8 border-t border-gray-200' />
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
    navigate('/kyc/imgs');
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
    p: MarkdownP,
    hr: MarkdownHr,
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center py-6 px-4 md:px-6 font-inter'>
      <div className='w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 md:p-10 transition-all duration-300'>
        <button
          onClick={handleBack}
          className='flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition duration-200 mb-6'
          aria-label='Go back'>
          <FaArrowLeft className='h-4 w-4' aria-hidden='true' />
          <span className='text-base font-medium'>Back</span>
        </button>

        <div className='text-center mb-8 md:mb-10'>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-900 flex items-center justify-center mb-4 tracking-tight'>
            <FaCheckCircle
              className='mr-3 text-blue-600 flex-shrink-0'
              aria-hidden='true'
            />{' '}
            Document Upload Guide
          </h1>
          <div className='w-16 h-1 bg-blue-600 mx-auto mb-6 rounded-full'></div>
          <p className='text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed'>
            Welcome! This guide will help you upload your documents securely and
            efficiently. Follow these steps for a smooth verification process.
          </p>
        </div>

        <div className='prose prose-md max-w-none text-gray-800 space-y-6 mx-auto'>
          <ReactMarkdown components={markdownComponents}>
            {guidelines}
          </ReactMarkdown>
        </div>

        <div className='mt-10 md:mt-12 flex justify-center'>
          <button
            onClick={handleAdvance}
            className='w-full max-w-sm bg-blue-600 text-white text-base font-semibold py-4 rounded-xl hover:bg-blue-700 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center'>
            <span>Continue to Document Upload</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export { GuidelinesPage as Component };

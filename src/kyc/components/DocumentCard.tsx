import React from 'react';
import { FiDownload } from 'react-icons/fi';

interface DocumentCardProps {
  title: string;
  url: string;
  type: 'image' | 'pdf';
  onImageClick?: (url: string) => void;
}

export const DocumentCard = ({
  title,
  url,
  type,
  onImageClick,
}: DocumentCardProps) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${title}_${Date.now()}.${type === 'image' ? 'jpg' : 'pdf'}`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClick = () => {
    if (url && onImageClick) {
      onImageClick(url);
    }
  };

  return (
    <button
      className='w-full bg-gray-50 rounded-lg p-4 flex flex-col cursor-pointer text-left hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
      onClick={handleClick}
      aria-label={`View ${title} document`}
      type='button'>
      <div className='flex justify-between items-center mb-2 w-full'>
        <p className='text-sm font-medium text-gray-700'>{title}</p>
        <a
          href={url}
          onClick={handleDownload}
          className='text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200'
          title='Download document'
          aria-label={`Download ${title}`}
          download>
          <FiDownload className='w-4 h-4' />
        </a>
      </div>
      <div className='relative flex-1'>
        {type === 'image' ? (
          <img
            src={url}
            alt={title}
            className='w-full h-full object-contain rounded-md bg-white'
          />
        ) : (
          <div className='w-full h-full flex flex-col items-center justify-center bg-white rounded-md p-2'>
            <span className='text-blue-600 mb-2'>PDF Document</span>
            <a
              href={url}
              download
              className='text-sm text-blue-600 hover:text-blue-800 underline'
              aria-label={`Download ${title} PDF`}>
              Download PDF
            </a>
          </div>
        )}
      </div>
    </button>
  );
};

import { FiX } from 'react-icons/fi';

interface ImageModalProps {
  selectedImage: string | null;
  onClose: () => void;
}

export const ImageModal = ({ selectedImage, onClose }: ImageModalProps) => {
  if (!selectedImage) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-4xl max-h-[90vh] w-full'>
        <div className='flex justify-between items-center p-4 border-b'>
          <h3 className='text-lg font-semibold'>Document Preview</h3>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 p-2'
            aria-label='Close modal'>
            <FiX className='w-6 h-6' />
          </button>
        </div>
        <div className='p-4 overflow-auto'>
          <img
            src={selectedImage}
            alt='Enlarged document'
            className='max-w-full max-h-[75vh] object-contain mx-auto'
          />
        </div>
      </div>
    </div>
  );
};

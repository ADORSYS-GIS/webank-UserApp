import React, { useState } from 'react';
import { toast } from 'sonner';
import { Contact, ContactService } from '../services/contactService';

interface SaveContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
  defaultName: string;
  onSave: (contact: Contact) => void;
}

const SaveContactModal: React.FC<SaveContactModalProps> = ({
  isOpen,
  onClose,
  accountId,
  defaultName,
  onSave,
}) => {
  const [name, setName] = useState(defaultName);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please enter a name for the contact');
      return;
    }

    const existingContact = ContactService.getContactByAccountId(accountId);
    if (existingContact) {
      toast.error('This contact already exists');
      return;
    }

    const newContact = ContactService.addContact({
      name: name.trim(),
      accountId,
    });

    if (onSave) {
      onSave(newContact);
    }

    toast.success('Contact saved successfully');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-xl p-6 w-full max-w-md mx-4'>
        <h2 className='text-xl font-bold text-gray-800 mb-4'>Save Contact</h2>

        <div className='space-y-4'>
          <div>
            <label
              htmlFor='contactName'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Contact Name
            </label>
            <input
              id='contactName'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter contact name'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              aria-required='true'
            />
          </div>

          <div className='flex justify-end space-x-3 mt-6'>
            <button
              onClick={onClose}
              className='px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300'>
              Cancel
            </button>
            <button
              onClick={handleSave}
              className='px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600'>
              Save Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveContactModal;

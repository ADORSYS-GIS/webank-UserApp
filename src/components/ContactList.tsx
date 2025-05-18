import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';
import { Contact, ContactService } from '../services/contactService';

interface ContactListProps {
  onSelectContact?: (contact: Contact) => void;
  showActions?: boolean;
}

const ContactList: React.FC<ContactListProps> = ({
  onSelectContact,
  showActions = true,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    const allContacts = ContactService.getAllContacts();
    setContacts(allContacts);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      loadContacts();
    } else {
      const results = ContactService.searchContacts(query);
      setContacts(results);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      if (ContactService.deleteContact(id)) {
        toast.success('Contact deleted successfully');
        loadContacts();
      } else {
        toast.error('Failed to delete contact');
      }
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setEditName(contact.name);
  };

  const handleEditSave = () => {
    if (!editingContact) return;

    if (!editName.trim()) {
      toast.error('Please enter a name');
      return;
    }

    const updated = ContactService.updateContact(editingContact.id, {
      name: editName.trim(),
    });

    if (updated) {
      toast.success('Contact updated successfully');
      loadContacts();
      setEditingContact(null);
    } else {
      toast.error('Failed to update contact');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, contact: Contact) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectContact?.(contact);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='relative'>
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder='Search contacts...'
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          aria-label='Search contacts'
        />
      </div>

      <div className='space-y-2'>
        {contacts.map((contact) => (
          <div key={contact.id} className='p-4 bg-white rounded-lg shadow-sm'>
            {editingContact?.id === contact.id ? (
              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2'>
                <input
                  type='text'
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className='flex-1 w-full px-2 py-1 border border-gray-300 rounded'
                  aria-label='Edit contact name'
                />
                <div className='flex gap-2 w-full sm:w-auto'>
                  <button
                    onClick={handleEditSave}
                    className='flex-1 sm:flex-none px-3 py-1 text-green-500 hover:text-green-600 border border-green-500 rounded'
                    aria-label='Save contact name'>
                    Save
                  </button>
                  <button
                    onClick={() => setEditingContact(null)}
                    className='flex-1 sm:flex-none px-3 py-1 text-gray-500 hover:text-gray-600 border border-gray-500 rounded'
                    aria-label='Cancel editing'>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className='flex items-center justify-between gap-2'>
                <button
                  className='flex-1 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-2'
                  onClick={() => onSelectContact?.(contact)}
                  onKeyDown={(e) => handleKeyPress(e, contact)}
                  tabIndex={0}
                  aria-label={`Select contact ${contact.name}`}>
                  <p className='font-medium text-gray-800'>{contact.name}</p>
                  <p className='text-sm text-gray-500'>
                    ID: xxxxx{contact.accountId.slice(-4)}
                  </p>
                </button>
                {showActions && (
                  <div className='flex items-center gap-1'>
                    <button
                      onClick={() => handleEdit(contact)}
                      className='p-2 text-blue-500 hover:text-blue-600 rounded-full'
                      aria-label={`Edit contact ${contact.name}`}>
                      <FaEdit className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className='p-2 text-red-500 hover:text-red-600 rounded-full'
                      aria-label={`Delete contact ${contact.name}`}>
                      <FaTrash className='w-4 h-4' />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {contacts.length === 0 && (
          <p className='text-center text-gray-500 py-4'>
            {searchQuery ? 'No contacts found' : 'No contacts saved yet'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactList;

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { ContactService, Contact } from "../services/contactService";

interface ContactListProps {
  onSelectContact?: (contact: Contact) => void;
  showActions?: boolean;
}

const ContactList: React.FC<ContactListProps> = ({
  onSelectContact,
  showActions = true,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    const allContacts = ContactService.getAllContacts();
    setContacts(allContacts);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      loadContacts();
    } else {
      const results = ContactService.searchContacts(query);
      setContacts(results);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      if (ContactService.deleteContact(id)) {
        toast.success("Contact deleted successfully");
        loadContacts();
      } else {
        toast.error("Failed to delete contact");
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
      toast.error("Please enter a name");
      return;
    }

    const updated = ContactService.updateContact(editingContact.id, {
      name: editName.trim(),
    });

    if (updated) {
      toast.success("Contact updated successfully");
      loadContacts();
      setEditingContact(null);
    } else {
      toast.error("Failed to update contact");
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search contacts..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
          >
            <div className="flex-1">
              {editingContact?.id === contact.id ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded"
                  />
                  <button
                    onClick={handleEditSave}
                    className="text-green-500 hover:text-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingContact(null)}
                    className="text-gray-500 hover:text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div
                  className="cursor-pointer"
                  onClick={() => onSelectContact?.(contact)}
                >
                  <p className="font-medium text-gray-800">{contact.name}</p>
                  <p className="text-sm text-gray-500">
                    ID: xxxxx{contact.accountId.slice(-4)}
                  </p>
                </div>
              )}
            </div>

            {showActions && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(contact)}
                  className="p-2 text-blue-500 hover:text-blue-600 rounded-full"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="p-2 text-red-500 hover:text-red-600 rounded-full"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
        ))}

        {contacts.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            {searchQuery ? "No contacts found" : "No contacts saved yet"}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactList;

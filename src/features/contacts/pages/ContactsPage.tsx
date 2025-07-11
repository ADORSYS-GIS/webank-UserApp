import React from "react";
import { useNavigate } from "@tanstack/react-router";
import ContactList from "@shared/components/ContactList";
import { Contact } from "@services/contacts/contactService";

const ContactsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectContact = (contact: Contact) => {
    navigate({
      to: "/top-up",
      state: {
        clientAccountId: contact.accountId,
        clientName: contact.name,
        fromContacts: true,
        show: "Payment",
      } as never,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center items-center">
            My Contacts
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <ContactList onSelectContact={handleSelectContact} />
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;

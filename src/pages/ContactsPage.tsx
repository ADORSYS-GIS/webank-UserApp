import React from "react";
import { useNavigate } from "react-router-dom";
import { useAccountStore } from "../store/accountStore";
import ContactList from "../components/ContactList";
import { Contact } from "../services/contactService";

const ContactsPage: React.FC = () => {
  const navigate = useNavigate();
  const accountId = useAccountStore((state) => state.accountId);
  const accountCert = useAccountStore((state) => state.accountCert);

  const handleSelectContact = (contact: Contact) => {
    // Navigate to the appropriate page with the contact's account ID and name
    navigate("/top-up", {
      state: {
        accountId,
        accountCert,
        clientAccountId: contact.accountId,
        clientName: contact.name,
        fromContacts: true,
        show: "Payment",
      },
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

export interface Contact {
  id: string;
  name: string;
  accountId: string;
}

export class ContactService {
  private static readonly STORAGE_KEY = "contacts";
  private static idCounter: number = 1;

  private static getContactsFromStorage(): Contact[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private static saveContactsToStorage(contacts: Contact[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(contacts));
  }

  static addContact(contact: Omit<Contact, "id">): Contact {
    // Generate a deterministic, unique ID using a counter combined with a timestamp
    const timestamp = new Date().getTime();
    const uniqueId = `${timestamp}-${this.idCounter++}`;

    const newContact: Contact = {
      ...contact,
      id: uniqueId,
    };

    const contacts = this.getContactsFromStorage();
    contacts.push(newContact);
    this.saveContactsToStorage(contacts);
    return newContact;
  }

  static getAllContacts(): Contact[] {
    return this.getContactsFromStorage();
  }

  static getContactById(id: string): Contact | undefined {
    const contacts = this.getContactsFromStorage();
    return contacts.find((contact) => contact.id === id);
  }

  static getContactByAccountId(accountId: string): Contact | undefined {
    const contacts = this.getContactsFromStorage();
    return contacts.find((contact) => contact.accountId === accountId);
  }

  static updateContact(
    id: string,
    updates: Partial<Omit<Contact, "id">>,
  ): Contact | undefined {
    const contacts = this.getContactsFromStorage();
    const index = contacts.findIndex((contact) => contact.id === id);
    if (index === -1) return undefined;

    contacts[index] = {
      ...contacts[index],
      ...updates,
    };
    this.saveContactsToStorage(contacts);
    return contacts[index];
  }

  static deleteContact(id: string): boolean {
    const contacts = this.getContactsFromStorage();
    const initialLength = contacts.length;
    const filteredContacts = contacts.filter((contact) => contact.id !== id);
    this.saveContactsToStorage(filteredContacts);
    return filteredContacts.length !== initialLength;
  }

  static searchContacts(query: string): Contact[] {
    const contacts = this.getContactsFromStorage();
    const searchTerm = query.toLowerCase();
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.accountId.toLowerCase().includes(searchTerm),
    );
  }
}

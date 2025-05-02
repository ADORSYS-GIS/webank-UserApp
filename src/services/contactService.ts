export interface Contact {
  id: string;
  name: string;
  accountId: string;
}

export class ContactService {
  private static contacts: Contact[] = [];
  private static idCounter: number = 1;

  static addContact(contact: Omit<Contact, "id">): Contact {
    // Generate a deterministic, unique ID using a counter combined with a timestamp
    const timestamp = new Date().getTime();
    const uniqueId = `${timestamp}-${this.idCounter++}`;

    const newContact: Contact = {
      ...contact,
      id: uniqueId,
    };
    this.contacts.push(newContact);
    return newContact;
  }

  static getAllContacts(): Contact[] {
    return [...this.contacts];
  }

  static getContactById(id: string): Contact | undefined {
    return this.contacts.find((contact) => contact.id === id);
  }

  static getContactByAccountId(accountId: string): Contact | undefined {
    return this.contacts.find((contact) => contact.accountId === accountId);
  }

  static updateContact(
    id: string,
    updates: Partial<Omit<Contact, "id">>,
  ): Contact | undefined {
    const index = this.contacts.findIndex((contact) => contact.id === id);
    if (index === -1) return undefined;

    this.contacts[index] = {
      ...this.contacts[index],
      ...updates,
    };
    return this.contacts[index];
  }

  static deleteContact(id: string): boolean {
    const initialLength = this.contacts.length;
    this.contacts = this.contacts.filter((contact) => contact.id !== id);
    return this.contacts.length !== initialLength;
  }

  static searchContacts(query: string): Contact[] {
    const searchTerm = query.toLowerCase();
    return this.contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.accountId.toLowerCase().includes(searchTerm),
    );
  }
}

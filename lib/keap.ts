const API_BASE = 'https://api.infusionsoft.com/crm/rest';
const API_KEY = 'KeapAK-99e0c9ee9da830cb526ec442774ac95e0f1259529534921d9e';

export interface Contact {
  id?: number;
  given_name?: string;
  family_name?: string;
  email_addresses?: Array<{
    email: string;
    field: string;
  }>;
  phone_numbers?: Array<{
    number: string;
    field: string;
  }>;
}

export interface ContactsResponse {
  contacts: Contact[];
  next_page_token?: string;
}

class KeapAPI {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getContacts(search?: string): Promise<ContactsResponse> {
    let endpoint = '/v2/contacts?page_size=100';
    if (search) {
      endpoint += `&filter=given_name~'${encodeURIComponent(search)}'`;
    }
    return this.request(endpoint);
  }

  async createContact(contact: Contact): Promise<Contact> {
    return this.request('/v2/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  }

  async updateContact(id: number, contact: Contact): Promise<Contact> {
    return this.request(`/v2/contacts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(contact),
    });
  }

  async deleteContact(id: number): Promise<void> {
    await this.request(`/v2/contacts/${id}`, {
      method: 'DELETE',
    });
  }
}

export const keapAPI = new KeapAPI();
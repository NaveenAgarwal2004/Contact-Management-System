import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

// src/services/api.ts
import axios from 'axios';
import { ContactFormData } from '../types/Contact';

const BASE_URL = 'http://localhost:5000/api/contacts'; // Adjust if your server uses a different port or path

export const contactsApi = {
  async getContacts(search?: string) {
    const response = await axios.get(BASE_URL, {
      params: search ? { search } : {},
    });
    return response.data.data; // Changed to return the contacts array inside data
  },

  async createContact(contact: ContactFormData) {
    const response = await axios.post(BASE_URL, contact);
    return response.data;
  },

  async updateContact(id: string, contact: ContactFormData) {
    const response = await axios.put(`${BASE_URL}/${id}`, contact);
    return response.data;
  },

  async deleteContact(id: string) {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};

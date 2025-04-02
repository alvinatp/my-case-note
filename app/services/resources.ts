import axios from 'axios';
import { getAuthHeader } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Type definitions
export interface Resource {
  id: string;
  name: string;
  category: string;
  status: 'available' | 'limited' | 'unavailable';
  address: string;
  lastUpdated: string;
  description?: string;
  contactInfo?: string;
  website?: string;
  zipcode?: string;
}

export interface ResourceUpdateData {
  status: 'available' | 'limited' | 'unavailable';
  notes: string;
}

export interface ResourceCreateData {
  name: string;
  category: string;
  status?: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE';
  contactDetails: {
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    description?: string;
  };
  zipcode: string;
}

export interface ImportResourceData {
  name: string; 
  category: string;
  address?: string;
  phone?: string;
  website?: string;
  descriptions?: string;
  city?: string;
  status?: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE';
}

// Get all resources with optional query parameters
export const getResources = async (params?: { zipcode?: string; category?: string }) => {
  try {
    const response = await axios.get(`${API_URL}/resources`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

// Get a specific resource by ID
export const getResourceById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/resources/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching resource with ID ${id}:`, error);
    throw error;
  }
};

// Search resources by query
export const searchResources = async (query: string) => {
  try {
    const response = await axios.get(`${API_URL}/resources/search`, { params: { q: query } });
    return response.data;
  } catch (error) {
    console.error('Error searching resources:', error);
    throw error;
  }
};

// Get recent updates
export const getRecentUpdates = async (limit = 5) => {
  try {
    const response = await axios.get(`${API_URL}/resources/updates`, { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching recent updates:', error);
    throw error;
  }
};

// Update a resource (requires authentication)
export const updateResource = async (id: string, updateData: ResourceUpdateData) => {
  try {
    const response = await axios.post(`${API_URL}/resources/${id}/update`, updateData, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating resource with ID ${id}:`, error);
    throw error;
  }
};

// Create a new resource (requires admin authentication)
export const createResource = async (resourceData: ResourceCreateData) => {
  try {
    const response = await axios.post(`${API_URL}/resources/create`, resourceData, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
};

// Import multiple resources at once (requires admin authentication)
export const importResources = async (resources: ImportResourceData[]) => {
  try {
    const response = await axios.post(`${API_URL}/resources/import`, { resources }, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error importing resources:', error);
    throw error;
  }
};

// Parse HTML content to extract resource information
export const createResourcesFromHtml = async (htmlContent: string, defaultCategory?: string) => {
  try {
    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Extract resource blocks
    const resourceBlocks = doc.querySelectorAll('.org-block, .resource, .organization, [class*="org"]');
    const resources: ImportResourceData[] = [];
    
    // Fallback if no matching elements found with class selectors
    if (resourceBlocks.length === 0) {
      // Try to identify patterns in the HTML
      const blocks = doc.querySelectorAll('div > h3, div > h4, div > h2, div > strong');
      
      for (let i = 0; i < blocks.length; i++) {
        const titleElement = blocks[i];
        let parentElement = titleElement.parentElement;
        
        if (!parentElement) continue;
        
        // Extract resource information
        const name = titleElement.textContent?.trim() || '';
        if (!name) continue; // Skip if no name found
        
        // Look for address, phone, etc. in nearby elements
        const addressElement = parentElement.querySelector('p, [class*="address"], div > span');
        const address = addressElement?.textContent?.trim() || '';
        
        // Look for phone numbers
        const phonePattern = /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/;
        const contentText = parentElement.textContent || '';
        const phoneMatch = contentText.match(phonePattern);
        const phone = phoneMatch ? phoneMatch[0] : '';
        
        // Add to resources list
        resources.push({
          name,
          category: defaultCategory || 'General',
          address,
          phone,
        });
      }
    } else {
      // Process blocks with class selectors
      resourceBlocks.forEach(block => {
        // Extract name (from h2, h3, h4, or first strong element)
        const nameElement = block.querySelector('h2, h3, h4, strong');
        const name = nameElement?.textContent?.trim() || '';
        
        // Extract category
        const categoryElement = block.querySelector('.category, [class*="category"]');
        const category = categoryElement?.textContent?.trim() || defaultCategory || 'General';
        
        // Extract address
        const addressElement = block.querySelector('.address, [class*="address"]');
        const address = addressElement?.textContent?.trim() || '';
        
        // Extract phone
        const phoneElement = block.querySelector('.phone, [class*="phone"], [class*="tel"]');
        const phone = phoneElement?.textContent?.trim() || '';
        
        // Extract website
        const websiteElement = block.querySelector('a[href], .website, [class*="website"], [class*="url"]');
        const website = websiteElement?.getAttribute('href') || websiteElement?.textContent?.trim() || '';
        
        // Extract description
        const descElement = block.querySelector('.description, [class*="desc"], p');
        const descriptions = descElement?.textContent?.trim() || '';
        
        // Extract city
        const cityElement = block.querySelector('.city, [class*="city"]');
        let city = cityElement?.textContent?.trim() || '';
        
        // Try to extract city from address if not found directly
        if (!city && address) {
          const cityMatch = address.match(/[A-Z][a-zA-Z\s]+, [A-Z]{2}/);
          if (cityMatch) {
            city = cityMatch[0].split(',')[0].trim();
          }
        }
        
        // Add to resources array if it has at least a name
        if (name) {
          resources.push({
            name,
            category,
            address,
            phone,
            website,
            descriptions,
            city
          });
        }
      });
    }
    
    // Import the resources if any were found
    if (resources.length > 0) {
      return importResources(resources);
    } else {
      throw new Error('No resources found in the provided HTML');
    }
  } catch (error) {
    console.error('Error parsing HTML:', error);
    throw error;
  }
}; 
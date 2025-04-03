import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

export const getResources = async (req, res) => {
  const { category, status, zipcode, sort, page = 1, limit = 10 } = req.query;

  const where = {};
  if (category) where.category = { contains: category, mode: 'insensitive' };
  if (status) where.status = status;
  if (zipcode) where.zipcode = zipcode;

  const orderBy = {};
  if (sort === 'lastUpdated') orderBy.lastUpdated = 'desc';
  else if (sort === 'name') orderBy.name = 'asc';
  else orderBy.lastUpdated = 'desc';

  const skip = (page - 1) * limit;

  try {
    const resources = await prisma.resource.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    const totalResources = await prisma.resource.count({ where });

    res.json({
      currentPage: page,
      totalPages: Math.ceil(totalResources / limit),
      totalResources,
      resources,
    });
  } catch (error) {
    console.error('Get Resources Error:', error);
    res.status(500).json({ message: 'Server error retrieving resources' });
  }
};

export const getResourceById = async (req, res) => {
  const { id } = req.params;

  try {
    const resource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    console.error('Get Resource By ID Error:', error);
    res.status(500).json({ message: 'Server error retrieving resource' });
  }
};

export const updateResource = async (req, res) => {
  const { id } = req.params;
  const { status, contactDetails, notes: newNoteContent, suggest_removal } = req.body;
  const userId = req.user.id;

  try {
    // Get both resource and user in parallel if we need to add a note
    const [resource, user] = await Promise.all([
      prisma.resource.findUnique({ where: { id } }),
      newNoteContent ? prisma.user.findUnique({ where: { id: userId } }) : null
    ]);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const dataToUpdate = {};
    if (status) dataToUpdate.status = status;
    if (suggest_removal !== undefined) {
      console.log(`User ${userId} suggested removal for resource ${id}`);
      if (suggest_removal === true && !status) {
        dataToUpdate.status = Status.UNAVAILABLE;
      }
    }

    // Handle contactDetails update
    if (contactDetails) {
      // Validate contactDetails structure
      if (typeof contactDetails !== 'object' || contactDetails === null) {
        return res.status(400).json({ message: 'contactDetails must be an object' });
      }

      // Merge with existing contactDetails or replace entirely
      dataToUpdate.contactDetails = {
        ...resource.contactDetails,
        ...contactDetails
      };
    }

    // Handle notes update
    let currentNotes = [];
    if (resource.notes && typeof resource.notes === 'object' && Array.isArray(resource.notes)) {
      currentNotes = resource.notes;
    } else if (typeof resource.notes === 'string') {
      try {
        currentNotes = JSON.parse(resource.notes);
        if (!Array.isArray(currentNotes)) currentNotes = [];
      } catch (e) {
        currentNotes = [];
      }
    }

    if (newNoteContent && user) {
      const newNote = {
        userId,
        username: user.username,
        content: newNoteContent,
        timestamp: new Date().toISOString(),
      };
      currentNotes.push(newNote);
      dataToUpdate.notes = currentNotes;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ message: 'No update data provided' });
    }

    const updatedResource = await prisma.resource.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json({
      message: 'Resource update submitted successfully',
      resource: updatedResource,
    });
  } catch (error) {
    console.error('Update Resource Error:', error);
    res.status(500).json({ message: 'Server error updating resource' });
  }
};

export const addResourceNote = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ message: 'Note content is required and must be a non-empty string' });
  }

  try {
    // Get the resource and user in parallel
    const [resource, user] = await Promise.all([
      prisma.resource.findUnique({ where: { id } }),
      prisma.user.findUnique({ where: { id: userId } })
    ]);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let currentNotes = [];
    if (resource.notes && typeof resource.notes === 'object' && Array.isArray(resource.notes)) {
      currentNotes = resource.notes;
    } else if (typeof resource.notes === 'string') {
      try {
        currentNotes = JSON.parse(resource.notes);
        if (!Array.isArray(currentNotes)) currentNotes = [];
      } catch (e) {
        currentNotes = [];
      }
    }

    const newNote = {
      userId,
      username: user.username,
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };
    currentNotes.push(newNote);

    const updatedResource = await prisma.resource.update({
      where: { id },
      data: {
        notes: currentNotes,
        lastUpdated: new Date() // Force update timestamp
      },
    });

    res.status(201).json({
      message: 'Note added successfully',
      notes: updatedResource.notes,
    });
  } catch (error) {
    console.error('Add Resource Note Error:', error);
    res.status(500).json({ message: 'Server error adding note' });
  }
};

export const searchResources = async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  try {
    const where = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
        { zipcode: { contains: query } },
      ],
    };

    const resources = await prisma.resource.findMany({
      where,
      skip,
      take: limit,
      orderBy: { lastUpdated: 'desc' }
    });

    const totalResources = await prisma.resource.count({ where });

    res.json({
      currentPage: page,
      totalPages: Math.ceil(totalResources / limit),
      totalResources,
      resources,
    });
  } catch (error) {
    console.error('Search Resources Error:', error);
    res.status(500).json({ message: 'Server error searching resources' });
  }
};

export const getRecentUpdates = async (req, res) => {
  const { since } = req.query;

  if (!since) {
    return res.status(400).json({ message: 'The "since" query parameter (ISO8601 timestamp) is required.' });
  }

  try {
    const updatedResources = await prisma.resource.findMany({
      where: {
        lastUpdated: {
          gt: since,
        },
      },
      orderBy: {
        lastUpdated: 'desc',
      },
    });

    res.json(updatedResources);
  } catch (error) {
    console.error('Get Recent Updates Error:', error);
    res.status(500).json({ message: 'Server error retrieving recent updates' });
  }
};

export const createResource = async (req, res) => {
  const { 
    name, 
    category, 
    status = 'AVAILABLE', 
    contactDetails, 
    zipcode,
    notes 
  } = req.body;

  if (!name || !category || !zipcode) {
    return res.status(400).json({ 
      message: 'Required fields missing: name, category, and zipcode are required' 
    });
  }

  let parsedContactDetails;
  try {
    if (typeof contactDetails === 'string') {
      parsedContactDetails = JSON.parse(contactDetails);
    } else if (typeof contactDetails === 'object') {
      parsedContactDetails = contactDetails;
    } else {
      parsedContactDetails = { address: '' };
    }
  } catch (error) {
    return res.status(400).json({ 
      message: 'Invalid contactDetails format. Must be valid JSON.' 
    });
  }

  try {
    const resource = await prisma.resource.create({
      data: {
        name,
        category,
        status,
        contactDetails: parsedContactDetails,
        zipcode,
        notes: notes || [],
      }
    });

    res.status(201).json({
      message: 'Resource created successfully',
      resource
    });
  } catch (error) {
    console.error('Create Resource Error:', error);
    res.status(500).json({ 
      message: 'Server error creating resource',
      error: error.message 
    });
  }
};

export const importResources = async (req, res) => {
  const { resources } = req.body;

  if (!Array.isArray(resources) || resources.length === 0) {
    return res.status(400).json({
      message: 'Invalid request: resources must be a non-empty array'
    });
  }

  try {
    const createdResources = [];
    const errors = [];

    for (const [index, resource] of resources.entries()) {
      try {
        const { 
          name, 
          category, 
          address, 
          phone, 
          website, 
          descriptions, 
          city,
          status = 'AVAILABLE'
        } = resource;

        if (!name || !category) {
          errors.push({
            index,
            message: 'Required fields missing: name and category are required',
            resource
          });
          continue;
        }

        const contactDetails = {
          address: address || '',
          phone: phone || '',
          website: website || '',
          description: descriptions || ''
        };

        let zipcode = '';
        if (address) {
          const zipMatch = address.match(/\b\d{5}(?:-\d{4})?\b/);
          zipcode = zipMatch ? zipMatch[0] : (city || '');
        } else {
          zipcode = city || '';
        }

        const createdResource = await prisma.resource.create({
          data: {
            name,
            category,
            status,
            contactDetails,
            zipcode,
            notes: []
          }
        });

        createdResources.push(createdResource);
      } catch (error) {
        errors.push({
          index,
          message: error.message,
          resource
        });
      }
    }

    res.status(201).json({
      message: `Imported ${createdResources.length} resources with ${errors.length} errors`,
      createdCount: createdResources.length,
      errorCount: errors.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Import Resources Error:', error);
    res.status(500).json({ 
      message: 'Server error importing resources',
      error: error.message 
    });
  }
};

export const saveResource = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Check if resource exists
    const resource = await prisma.resource.findUnique({
      where: { id: parseInt(id) }
    });

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if already saved
    const existingSave = await prisma.savedResource.findUnique({
      where: {
        userId_resourceId: {
          userId,
          resourceId: parseInt(id)
        }
      }
    });

    if (existingSave) {
      return res.status(400).json({ message: 'Resource already saved' });
    }

    // Save the resource
    await prisma.savedResource.create({
      data: {
        userId,
        resourceId: parseInt(id)
      }
    });

    res.status(201).json({ message: 'Resource saved successfully' });
  } catch (error) {
    console.error('Save Resource Error:', error);
    res.status(500).json({ message: 'Server error saving resource' });
  }
};

export const unsaveResource = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Check if save exists
    const savedResource = await prisma.savedResource.findUnique({
      where: {
        userId_resourceId: {
          userId,
          resourceId: parseInt(id)
        }
      }
    });

    if (!savedResource) {
      return res.status(404).json({ message: 'Resource not saved' });
    }

    // Remove the save
    await prisma.savedResource.delete({
      where: {
        userId_resourceId: {
          userId,
          resourceId: parseInt(id)
        }
      }
    });

    res.json({ message: 'Resource unsaved successfully' });
  } catch (error) {
    console.error('Unsave Resource Error:', error);
    res.status(500).json({ message: 'Server error unsaving resource' });
  }
};

export const getSavedResources = async (req, res) => {
  const userId = req.user.id;

  try {
    const savedResources = await prisma.savedResource.findMany({
      where: { userId },
      include: {
        resource: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(savedResources.map(sr => sr.resource));
  } catch (error) {
    console.error('Get Saved Resources Error:', error);
    res.status(500).json({ message: 'Server error fetching saved resources' });
  }
}; 
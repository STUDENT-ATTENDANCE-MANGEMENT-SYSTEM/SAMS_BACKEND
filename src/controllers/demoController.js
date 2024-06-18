import Demo from '../models/Demo.js';
import asyncHandler from "express-async-handler";

const createDemo = asyncHandler(async (req, res) => {
  try {
    const { name, email, telephone, response } = req.body;
    
    // Create a new demo document
    const newDemo = await Demo.create({ name, email, telephone, response });
    
    // Send success response
    res.status(201).json(newDemo);
  } catch (error) {
    console.error('Error creating new demo:', error);
    res.status(500).json({ message: 'Failed to create new demo' });
  }

})


export default { createDemo };
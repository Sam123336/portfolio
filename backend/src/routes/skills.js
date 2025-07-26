import express from 'express';
import { Skill } from '../models/index.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get skill categories (public) - MOVED TO TOP
router.get('/categories', async (req, res) => {
  try {
    const categories = await Skill.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// Search skills (public) - MOVED UP
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }
    
    const skills = await Skill.find({
      name: { $regex: q, $options: 'i' }
    }).limit(10).sort({ name: 1 });
    
    res.json(skills);
  } catch (error) {
    console.error('Error searching skills:', error);
    res.status(500).json({ message: 'Failed to search skills' });
  }
});

// Get skills by category (public)
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const skills = await Skill.find({ category }).sort({ name: 1 });
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills by category:', error);
    res.status(500).json({ message: 'Failed to fetch skills by category' });
  }
});

// Get all skills (public - viewers can access)
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ message: 'Failed to fetch skills' });
  }
});

// Create new skill (admin only)
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { name, category, proficiency, icon, color, description } = req.body;
    
    if (!name || !category || !proficiency) {
      return res.status(400).json({ message: 'Name, category, and proficiency are required' });
    }

    // Check if skill already exists
    const existingSkill = await Skill.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingSkill) {
      return res.status(400).json({ message: 'Skill already exists' });
    }

    const skill = new Skill({
      name,
      category,
      proficiency,
      icon,
      color,
      description
    });

    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ message: 'Failed to create skill' });
  }
});

// Update skill (admin only)
router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, proficiency, icon, color, description } = req.body;

    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Check if another skill with the same name exists (case insensitive)
    if (name && name !== skill.name) {
      const existingSkill = await Skill.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: id }
      });
      if (existingSkill) {
        return res.status(400).json({ message: 'Skill with this name already exists' });
      }
    }

    // Update fields
    if (name) skill.name = name;
    if (category) skill.category = category;
    if (proficiency) skill.proficiency = proficiency;
    if (icon !== undefined) skill.icon = icon;
    if (color !== undefined) skill.color = color;
    if (description !== undefined) skill.description = description;

    await skill.save();
    res.json(skill);
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ message: 'Failed to update skill' });
  }
});

// Delete skill (admin only)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    await Skill.findByIdAndDelete(id);
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ message: 'Failed to delete skill' });
  }
});

export default router;
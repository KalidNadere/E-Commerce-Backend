const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');

// Find all tags, including its associated Product data
router.get('/', async (req, res) => {
try {
  const tags = await Tag.findAll({
    include: [
      {
        model: Product,
        through: ProductTag,
        attributes: ['id', 'product_name', 'price', 'stock'],
      },
    ],
  });

  res.status(200).json(tags);
} catch (err) {
  res.status(500).json(err);
}
});

// Find a single tag by its `id`, including its associated Product data
router.get('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;

    const tag = await Tag.findByPk(tagId, {
      include: [
        {
          model: Product,
          through: ProductTag,
          attributes: ['id', 'product_name', 'price', 'stock'],
        },
      ],
    });

    if (!tag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }
    
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});


// Create a new tag
router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    res.status(400).json(err);
  }
});


// Update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    const updatedTag = await tag.update({
      tag_name: req.body.tag_name,
    });

    res.status(200).json(updatedTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;

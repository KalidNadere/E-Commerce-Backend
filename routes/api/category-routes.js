const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
    try {
      const categories = await Category.findAll({
        include: [Product],
      });
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // Find one category by its `id` value and include its associated Products
router.get('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    const categoryData = await Category.findOne({
      where: {
        id: categoryId 
      },
      include: [
        { model: Product,
        attributes: ['id', 'product_name', 'price', 'stock']
        }
      ]
    });

    if (!categoryData) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.json(categoryData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;

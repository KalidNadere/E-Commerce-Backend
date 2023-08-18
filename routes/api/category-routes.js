const router = require('express').Router();
const { Category, Product } = require('../../models');

// Find all categories, include its associated products
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
    const categoryId = req.params.id; //extracting the id value

    const categoryData = await Category.findOne({ //using sequelize findOne method
      where: {
        id: categoryId 
      },
      include: [ // Using include option for associated products
        { model: Product,
        attributes: ['id', 'product_name', 'price', 'stock']
        }
      ]
    });

    if (!categoryData) {
      res.status(404).json({ message: 'Category not found' });
      return; //404 response if category not found
    }

    res.json(categoryData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err); // 500 response if there is error
  }
});


// Create a new category
router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create ({
      category_name: req.body.category_name,
    });

    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


// Update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    const updatedCategory = await Category.update(req.body, {
      where: {
        id: categoryId
      }
    });

    if (updatedCategory[0] === 0) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.json({ message: 'Category updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err)
  }
});


 // Delete a category by its `id` value
router.delete('/:id', async (req, res) => {
 try {
  const categoryId = req.params.id;

  await Product.destroy({
    where: {
      category_id: categoryId,
    },
  });

  const deleteCategory = await Category.destroy({
    where: {
      id: categoryId,
    },
  });

  if (!deleteCategory) {
    res.status(404).json({ message: 'Category not found' });
    return;
  }

  res.json({ message: 'Category deleted successfully' });
 } catch (err) {
  console.error(err);
  res.status(500).json(err);
 }
});

module.exports = router;

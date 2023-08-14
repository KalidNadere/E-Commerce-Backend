const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// router.get('/', (req, res) => {
router.get('/', async (req, res) => {
    try {
      const categories = await Category.findAll({
        include: [Product], // Include associated Products
      });
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
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

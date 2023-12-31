const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');


// Get all products and include its associated Category and Tag data
router.get('/', async (req,res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name'],
        },
        {
          model: Tag,
          through: 'product_tag',
          attributes: ['id', 'tag_name'],
        },
      ],
    });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

  // find a single product by its `id`, including its associated Category and Tag data
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name'],  
        },
        {
          model: Tag,
          through: 'product_tag',
          attributes: ['id', 'tag_name'],
        },
      ],
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create new product
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds && req.body.tagIds.length > 0) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });

        return ProductTag.bulkCreate(productTagIdArr);
      }

      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// Update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// Delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    // Find product by its id
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Delete associations in the ProductTag model
    await Product.destroy({ where: { id: req.params.id } });

    // Delete the product
    await product.destroy();

    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    console.log(err);
    res.status(500),json(err);
  }
});


module.exports = router;

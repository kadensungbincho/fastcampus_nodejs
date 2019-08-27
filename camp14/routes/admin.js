const express = require('express');
const router = express.Router();

const models = require('../models');

router.get('/', function(req, res) {
  res.send('admin url');
});

router.get('/products', function(req, res) {
  // res.send('this is product page of admin');
  models.Products.findAll({

  }).then((products) => {
    res.render('admin/products.html', { products: products });
  });
});

router.get('/products/write', function(req, res) {
  res.render('admin/form.html');
});

router.post('/products/write', (req, res) => {
  models.Products.create( req.body ).then(() => {
    res.redirect('/admin/products');
  });
});

module.exports = router;
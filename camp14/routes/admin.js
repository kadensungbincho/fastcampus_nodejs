const express = require('express');
const router = express.Router();

const models = require('../models');

router.get('/', (_, res) => {
  res.send('admin url');
});

router.get('/products', (_, res) => {
  // res.send('this is product page of admin');
  models.Products.findAll({

  }).then((products) => {
    res.render('admin/products.html', { products });
  });
});

router.get('/products/write', (_, res) => {
  res.render('admin/form.html');
});

router.post('/products/write', (req, res) => {
  models.Products.create( req.body ).then(() => {
    res.redirect('/admin/products');
  });
});

router.get('/products/detail/:id', (req, res) => {
  models.Products.findByPk(req.params.id).then( (product) => {
    res.render('admin/detail.html', { product });
  });
});

router.get('/products/edit/:id', (req, res) => {
  models.Products.findByPk(req.params.id).then( (product) => {
    res.render('admin/form.html', { product });
  });
});

router.post('/products/edit/:id', (req, res) => {
  models.Products.update(req.body,
    {
        where: { id: req.params.id }
    }
  ).then( () => {
    res.redirect('/admin/products/detail/' + req.params.id );
  });
});

router.get('/products/delete/:id', (req, res) => {
  models.Products.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.redirect('/admin/products');
  });
});

module.exports = router;
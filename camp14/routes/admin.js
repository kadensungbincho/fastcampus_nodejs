const express = require('express');
const router = express.Router();

const models = require('../models');

// csrf setting
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// setup image store location
const path = require('path');
const uploadDir = path.join(__dirname, '../uploads');
const fs = require('fs');

// setup multer
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
    callback(null, 'products-' + Date.now() + '.' + file.mimetype.split('/')[1] );
  }
});
const upload = multer({ storage });

router.get('/', (_, res) => {
  res.send('admin url');
});

router.get('/products', async (_, res) => {
  // res.send('this is product page of admin');
  // 
  const products = await models.Products.findAll();
  res.render('admin/products.html', { products });
});

router.get('/products/write', csrfProtection, (req, res) => {
  res.render('admin/form.html', { csrfToken: req.csrfToken() });
});

router.post('/products/write', upload.single('thumbnail'), csrfProtection, async (req, res) => {
  try {
    req.body.thumbnail = (req.file) ? req.file.filename : "",
    await models.Products.create( req.body );
    res.redirect('/admin/products');
  } catch(e) {
    console.log(e);
  }
  
});

router.get('/products/detail/:id', async (req, res) => {
  const product = await models.Products.findOne({
    where: {
      id: req.params.id
    },
    include: [
      'Memo'
    ]
  });
  console.log(product);
  res.render('admin/detail.html', { product });
});

router.post('/products/detail/:id', async (req, res) => {
  try {
    const product = await models.Products.findByPk(req.params.id);
    await product.createMemo(req.body);
    res.redirect('/admin/products/detail/' + req.params.id);
  } catch(e) {
    console.log(e)
  };
})

router.get('/products/edit/:id', csrfProtection, async (req, res) => {
  try {
    const product = await models.Products.findByPk(req.params.id);
    res.render('admin/form.html', { product, csrfToken: req.csrfToken() });
  } catch(e) {
    console.log(e);
  }
  
});

router.post('/products/edit/:id', upload.single('thumbnail'),csrfProtection, async (req, res) => {
  try {
    const product = await models.Products.findByPk(req.params.id);
    if(req.file && product.thumbnail) {
      fs.unlinkSync( uploadDir + '/' + product.thumbnail );
    }

    req.body.thumbnail = (req.file) ? req.file.filename : product.thumbnail;

    await models.Products.update(req.body,
      {
          where: { id: req.params.id }
      }
    );
    res.redirect('/admin/products/detail/' + req.params.id );
  } catch(e) {
    console.log(e);
  }
  
});

router.get('/products/delete/:id', async (req, res) => {
  await models.Products.destroy({
    where: {
      id: req.params.id
    }
  });
  res.redirect('/admin/products');
});

router.get('/products/delete/:product_id/:memo_id', async(req, res) => {
  try {
    await models.ProductsMemo.destroy({
      where: {
        id: req.params.memo_id
      }
    });
    res.redirect('/admin/products/detail/' + req.params.product_id);
  } catch(e) {
    console.log(e);
  }
})

module.exports = router;
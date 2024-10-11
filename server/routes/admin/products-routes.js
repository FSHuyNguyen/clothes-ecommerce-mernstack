const express = require('express');

const { handleImageUpload, addProduct, updateProduct, deleteProduct, getAllProduct, getDetailProduct } = require('../../controllers/admin/products-controller')

const { upload } = require('../../config/cloudinary.config');

const router = express.Router();

router.post('/upload-image', upload.single("my_file"), handleImageUpload);

router.post('/add', addProduct);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);
router.get('/get', getAllProduct);
router.get('/detail/:id', getDetailProduct);

module.exports = router;
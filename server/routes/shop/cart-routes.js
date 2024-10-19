const express = require('express');

const {addToCart, updateToCart, deleteCartItem,  getCartItems } = require('../../controllers/shop/cart-controller');

const router = express.Router();

router.post('/add', addToCart);
router.get('/get/:userId', getCartItems);
router.put('/update-cart', updateToCart);
router.delete('/:userId/:productId', deleteCartItem);

module.exports = router;
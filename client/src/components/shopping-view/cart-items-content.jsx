import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, getCartItems, updateCartItem } from "../../store/shop/cart-slice";
import { useToast } from "../../hooks/use-toast";

function UserCartItemsContent({ cartItem }) {
    const { user } = useSelector(state => state.auth);
    const { productList } = useSelector(state => state.shoppingProducts);
    const { cartItems } = useSelector(state => state.shoppingCart);
    const dispatch = useDispatch();
    const { toast } = useToast();

    function handleCartItemDelete(cartItem) {
        dispatch(deleteCartItem({ userId: user.id, productId: cartItem.productId }))
            .then(data => {
                if (data?.payload?.success) {
                    toast({
                        title: 'Cart item is deleted sucessfully'
                    })
                }
            });
    }

    function handleUpdateQuantityItem(cartItem, typeOfAction) {
        let currentCartItems = cartItems.items || [];
        if (typeOfAction === 'plus') {
            if (currentCartItems.length) {
                const indexOfCurrentItem = currentCartItems.findIndex(item => item.productId === cartItem?.productId);
                const getCurrentProductIndex = productList.findIndex(product => product._id === cartItem?.productId);

                if (indexOfCurrentItem !== -1 && getCurrentProductIndex !== -1) {
                    const getQuantity = currentCartItems[indexOfCurrentItem].quantity;
                    const getTotalStock = productList[getCurrentProductIndex].totalStock;
                    if (getQuantity + 1 > getTotalStock) {
                        toast({
                            title: `Only ${getQuantity} quantity can be added for this item`,
                            variant: 'destructive'
                        })

                        return;
                    }
                }
            }
        }

        dispatch(updateCartItem(
            {
                userId: user.id,
                productId: cartItem.productId,
                quantity: typeOfAction === 'plus' ? (cartItem.quantity + 1) : (cartItem.quantity - 1)
            }
        )).then(data => {
            if (data?.payload?.success) {
                toast({
                    title: 'Cart item is updated sucessfully'
                })
            }
        });
    }

    return (<div className="flex items-center space-x-4">
        <img src={cartItem?.image} alt={cartItem?.title} className="w-20 h-20 rounded object-cover" />
        <div className="flex-1">
            <h3 className="font-extrabold">{cartItem?.title}</h3>
            <div className="flex items-center gap-4 mt-1">
                <Button
                    variant='outline'
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    disabled={cartItem?.quantity === 1}
                    onClick={() => handleUpdateQuantityItem(cartItem, "minus")}>
                    <Minus className="w-4 h-4" />
                    <span className="sr-only">Decrease</span>
                </Button>
                <span className="font-semibold">{cartItem?.quantity}</span>
                <Button
                    variant='outline'
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => handleUpdateQuantityItem(cartItem, "plus")}>
                    <Plus className="w-4 h-4" />
                    <span className="sr-only">Increase</span>
                </Button>
            </div>
        </div>
        <div className="flex flex-col items-end">
            <p className="font-semibold">
                ${((cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) * cartItem?.quantity).toFixed(2)}
            </p>
            <Trash onClick={() => handleCartItemDelete(cartItem)} className="cursor-pointer mt-1" size={20} />
        </div>
    </div>);
}

export default UserCartItemsContent;
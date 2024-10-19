import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { StarIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getCartItems } from "../../store/shop/cart-slice";
import { useToast } from "../../hooks/use-toast";
import { setProductDetails } from "../../store/shop/product-slice";
import { Label } from "@radix-ui/react-label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getsReview } from "../../store/shop/review-slice";

function ProductDetail({ open, setOpen, productDetail }) {
    const [reviewMsg, setReviewMsg] = useState("");
    const [rating, setRating] = useState(0);
    const dispatch = useDispatch();
    const { toast } = useToast();

    const { user } = useSelector(state => state.auth);
    const { cartItems } = useSelector(state => state.shoppingCart);
    const { reviews } = useSelector(state => state.shoppingReview);


    function handleAddToCart(productId, productTotalStock) {
        let currentCartItems = cartItems.items || [];

        if (currentCartItems.length) {
            const indexofCurrentItem = currentCartItems.findIndex(item => item.productId === productId);
            if (indexofCurrentItem !== -1) {
                const getQuantity = currentCartItems[indexofCurrentItem].quantity;
                if (getQuantity + 1 > productTotalStock) {
                    toast({
                        title: `Only ${getQuantity} quantity can be added for this item`,
                        variant: 'destructive'
                    })

                    return;
                }
            }
        }

        dispatch(addToCart({ userId: user.id, productId, quantity: 1 })).then(data => {
            if (data.payload.success) {
                dispatch(getCartItems(user.id));
                toast({
                    title: 'Product is added to cart'
                })
            }
        });
    }

    function handleDialogClose() {
        setOpen(false);
        dispatch(setProductDetails());
        setReviewMsg("");
        setRating(0);
    }

    function handleRatingChange(ratingValue) {
        setRating(ratingValue);
    }

    function handleAddReview() {
        dispatch(addReview({
            productId: productDetail?._id,
            userId: user?.id,
            userName: user?.userName,
            reviewMessage: reviewMsg,
            reviewValue: rating,
        }))
            .then(data => {
                if (data?.payload?.success) {
                    setReviewMsg("");
                    setRating(0);
                    dispatch(getsReview(productDetail?._id));
                    toast({
                        title: 'Review added successfully!'
                    })
                } else {
                    toast({
                        title: data?.payload || 'Something went wrong',
                        variant: 'destructive'
                    });
                }
            })
    }

    useEffect(() => {
        if (productDetail !== null) dispatch(getsReview(productDetail?._id));
    }, [productDetail])

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
                <div className="relative overflow-hidden rounded-lg">
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                    </DialogHeader>
                    <img
                        src={productDetail?.image}
                        alt={productDetail?.title}
                        width={600}
                        height={600}
                        className="aspect-square w-full object-cover"
                    />
                </div>
                <div className="">
                    <div>
                        <h1 className="text-3xl font-extrabold">
                            {productDetail?.title}
                        </h1>
                        <p className="text-muted-foreground text-2xl mb-5">
                            {productDetail?.description}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className={`text-3xl font-bold text-primary ${productDetail?.salePrice > 0 ? 'line-through' : ''}`}>
                            ${productDetail?.price}
                        </p>
                        {
                            productDetail?.salePrice > 0
                                ? (<p className="text-2xl font-bold text-muted-foreground">
                                    ${productDetail?.salePrice}
                                </p>)
                                : null
                        }
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-0.5">
                            <StarRatingComponent rating={productDetail?.averageReview} />
                        </div>
                        <span className="text-muted-foreground">({productDetail?.averageReview.toFixed(2)})</span>
                    </div>
                    <div className="mt-5 mb-5">
                        {
                            productDetail?.totalStock === 0
                                ? <Button className="w-full opacity-60 cursor-not-allowed">Out Of Stock</Button>
                                : <Button className="w-full" onClick={() => handleAddToCart(productDetail?._id, productDetail?.totalStock)}>Add to cart</Button>
                        }
                    </div>
                    <Separator />
                    <div className="max-h-[240px] overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Reviews</h2>
                        <div className="grid gap-6">
                            {
                                reviews && reviews.length > 0
                                    ? reviews.map(review => <div key={review?._id} className="flex gap-4">
                                        <Avatar className="w-10 h-10 border">
                                            <AvatarFallback>
                                                {review?.userName[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold">{review?.userId === user.id ? 'You' : review?.userName}</h3>
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                <StarRatingComponent rating={review?.reviewValue} />
                                            </div>
                                            <p className="text-muted-foreground">
                                                {review?.reviewMessage}
                                            </p>
                                        </div>
                                    </div>)
                                    : <h1>No Reviews</h1>
                            }
                        </div>
                    </div>
                    <div className="mt-6 flex flex-col gap-2 mb-6">
                        <Label>Write a review</Label>
                        <div className="flex gap-1">
                            <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
                        </div>
                        <Input name="reviewMsg" value={reviewMsg} onChange={(event) => setReviewMsg(event.target.value)} placeholder="Write a review..." />
                        <Button onClick={() => handleAddReview()} disabled={reviewMsg.trim() === ''}>Submit</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ProductDetail;
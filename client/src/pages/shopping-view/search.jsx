import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSearchResults, resetSearchResults } from "../../store/shop/search-slice";
import ShoppingProductCard from "../../components/shopping-view/product-card";
import { useToast } from "../../hooks/use-toast";
import { addToCart, getCartItems } from "../../store/shop/cart-slice";
import { getProductDetail } from "../../store/shop/product-slice";
import ProductDetail from "../../components/shopping-view/product-detail";
import { Skeleton } from "@/components/ui/skeleton";

function SearchProduct() {
    const { cartItems } = useSelector(state => state.shoppingCart);
    const { searchResults, isLoading } = useSelector(state => state.shoppingSearch);
    const { user } = useSelector(state => state.auth);
    const { productDetail } = useSelector(state => state.shoppingProducts);
    const dispatch = useDispatch();

    const [keyword, setKeyword] = useState('');
    const [openDetailDialog, setOpenDetailDialog] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const { toast } = useToast();

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

    function handleGetProductDetail(id) {
        dispatch(getProductDetail(id));
    }

    useEffect(() => {
        const keywordFromURL = searchParams.get('keyword');
        if (keywordFromURL && keywordFromURL !== '') {
            setKeyword(keywordFromURL);
        }
    }, [searchParams.get('keyword')]);


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (keyword && keyword.trim() !== '' && keyword.trim().length > 2) {
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
                dispatch(getSearchResults(keyword));
            } else {
                dispatch(resetSearchResults());
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [keyword]);

    useEffect(() => {
        if (productDetail !== null) setOpenDetailDialog(true);
    }, [productDetail]);

    return (<div className="container mx-auto md:px-6 px-4 py-8">
        <div className="flex justify-center mb-8">
            <div className="w-full flex items-center">
                <Input
                    value={keyword}
                    name="keyword"
                    onChange={(event) => setKeyword(event.target.value)}
                    className="py-6"
                    placeholder="Search Products..."
                />
            </div>
        </div>
        {
            searchResults && searchResults.length > 0
                ?
                isLoading
                    ?
                    <>
                        <Skeleton className="h-[486px] w-[358px]" />
                        <Skeleton className="h-[486px] w-[358px]" />
                        <Skeleton className="h-[486px] w-[358px]" />
                        <Skeleton className="h-[486px] w-[358px]" />
                    </>
                    :
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {
                            searchResults.map(productItem =>
                                <ShoppingProductCard
                                    handleGetProductDetail={handleGetProductDetail}
                                    key={productItem._id}
                                    product={productItem}
                                    handleAddToCart={handleAddToCart}
                                />
                            )
                        }
                    </div>
                : <h1 className="text-5xl font-extralight">No result found!</h1>
        }
        {productDetail !== null &&
            <ProductDetail open={openDetailDialog} setOpen={setOpenDetailDialog} productDetail={productDetail} />
        }
    </div>);
}

export default SearchProduct;
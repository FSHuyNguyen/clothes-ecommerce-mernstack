import { ArrowUpDownIcon } from "lucide-react";
import ProductFilter from "../../components/shopping-view/filter";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { sortOptions } from "../../config";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListFilteredProducts, getProductDetail } from "../../store/shop/product-slice";
import ShoppingProductCard from "../../components/shopping-view/product-card";
import { useSearchParams } from "react-router-dom";
import ProductDetail from "../../components/shopping-view/product-detail";

function createSearchParamsHelper(filterParams) {
    const queryParams = [];

    for (const [key, value] of Object.entries(filterParams)) {
        if (Array.isArray(value) && value.length > 0) {
            const paramValue = value.join(',');

            queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
        }
    }

    return queryParams.join('&');
}

function ShoppingListing() {

    const dispatch = useDispatch();
    const { productList, productDetail } = useSelector(state => state.shoppingProducts);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [openDetailDialog, setOpenDetailDialog] = useState(false);

    function handleFilter(getSectionId, getCurrentOption) {
        let cpyFilters = { ...filters };
        const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

        if (indexOfCurrentSection === -1) {
            cpyFilters = {
                ...cpyFilters,
                [getSectionId]: [getCurrentOption],
            }
        } else {
            const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);

            if (indexOfCurrentOption === -1) {
                cpyFilters[getSectionId].push(getCurrentOption);
            } else {
                cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
            }
        }

        setFilters(cpyFilters);
        sessionStorage.setItem('filters', JSON.stringify(cpyFilters));
    }

    useEffect(() => {
        setSort('price-lowtohigh');
        setFilters(JSON.parse(sessionStorage.getItem('filters')) || {});
    }, [])

    useEffect(() => {
        const savedFilters = sessionStorage.getItem('filters');
        if (savedFilters) {
            setFilters(JSON.parse(savedFilters));
        }
    }, [sessionStorage.getItem('filters')]);

    useEffect(() => {
        if (filters && Object.keys(filters).length > 0) {
            const createQueryString = createSearchParamsHelper(filters);
            setSearchParams(new URLSearchParams(createQueryString));
        }
    }, [filters])

    useEffect(() => {
        if (filters !== null && sort !== null) {
            dispatch(getListFilteredProducts({
                filterParams: filters, sortParams: sort
            }));
        }
    }, [dispatch, sort, filters])

    useEffect(() => {
        if (productDetail !== null) setOpenDetailDialog(true);
    }, [productDetail])

    function handleSort(value) {
        setSort(value);
    }

    function handleGetProductDetail(id) {
        dispatch(getProductDetail(id));
    }

    return (<div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6">
        <ProductFilter filters={filters} setFilters={setFilters} handleFilter={handleFilter} />
        <div className="bg-background w-full rounded-lg shadow-sm">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-extrabold">All Products</h2>
                <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{productList.length} Products</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                                <ArrowUpDownIcon className="h-4 w-4" />
                                <span>Sort By</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                                {
                                    sortOptions.map(sortItem =>
                                        <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                                            {sortItem.label}
                                        </DropdownMenuRadioItem>)
                                }
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 -4">
                {
                    productList && productList.length > 0
                        ?
                        productList.map(productItem =>
                            <ShoppingProductCard handleGetProductDetail={handleGetProductDetail} key={productItem._id} product={productItem} />
                        )
                        : null
                }
            </div>
        </div>
        {productDetail !== null && 
        <ProductDetail open={openDetailDialog} setOpen={setOpenDetailDialog} productDetail={productDetail} />
        }
        
    </div>);
}

export default ShoppingListing;
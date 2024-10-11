import { Fragment, useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import CommonForm from "../../components/common/form";
import { addProductFormElements } from "../../config";
import ProductImageUpload from "../../components/admin-view/image-upload";
import { useDispatch, useSelector } from "react-redux";
import { addNewProduct, deleteNewProduct, getListProduct, updateNewProduct } from "../../store/admin/product-slice";
import { useToast } from "../../hooks/use-toast";
import AdminProductCard from "../../components/admin-view/product-card";

const initialFormData = {
    image: null,
    title: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    salePrice: '',
    totalStock: '',
};


function AdminProducts() {
    const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);

    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const [currentEditedId, setCurrentEditedId] = useState(null);

    const { productList } = useSelector(state => state.adminProducts);
    const dispatch = useDispatch();
    const { toast } = useToast();

    function onSubmit(event) {
        event.preventDefault();

        if(currentEditedId !== null) {
            dispatch(updateNewProduct({
                id: currentEditedId,
                formData
            })).then((data) => {
                if (data.payload.success) {
                    dispatch(getListProduct());
                    setOpenCreateProductDialog(false);
                    setCurrentEditedId(null);
                    setFormData(initialFormData);
                    toast({
                        title: data.payload.message
                    })
                }
            })
        } else {
            dispatch(addNewProduct({
                ...formData,
                image: uploadedImageUrl
            })).then((data) => {
                if (data.payload.success) {
                    dispatch(getListProduct());
                    setOpenCreateProductDialog(false);
                    setImageFile(null);
                    setFormData(initialFormData);
                    toast({
                        title: data.payload.message
                    })
                }
            })
        }
    }

    function handleDelete(getCurrentProductId) {
        dispatch(deleteNewProduct(getCurrentProductId)).then((data) => {
            if (data.payload.success) {
                dispatch(getListProduct());
                toast({
                    title: data.payload.message
                })
            }
        })
    }

    function isFormValid() {
        return Object.keys(formData)
                .map((key) => formData[key] !== "")
                .every((item) => item);
    }

    useEffect(() => {
        dispatch(getListProduct());
    }, [dispatch])

    return (<Fragment>
        <div className="mb-5 w-full flex justify-end">
            <Button onClick={() => setOpenCreateProductDialog(true)}>Add New Product</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {
                productList && productList.length > 0
                    ?
                    productList.map(productItem =>
                        <AdminProductCard
                            key={productItem._id} 
                            setFormData={setFormData}
                            setOpenCreateProductDialog={setOpenCreateProductDialog}
                            setCurrentEditedId={setCurrentEditedId}
                            product={productItem} 
                            handleDelete={handleDelete} 
                        />
                    )
                    : null
            }
        </div>
        <Sheet 
            open={openCreateProductDialog} 
            onOpenChange={() => {
                setOpenCreateProductDialog(false);
                setCurrentEditedId(null);
                setFormData(initialFormData);
            }}
        >
            <SheetContent side="right" className="overflow-auto">
                <SheetHeader>
                    <SheetTitle>
                        {
                            currentEditedId !== null 
                            ? 'Update Product'
                            : 'Add New Product'
                        }
                    </SheetTitle>
                    <SheetDescription>

                    </SheetDescription>
                </SheetHeader>
                <ProductImageUpload
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    setUploadedImageUrl={setUploadedImageUrl}
                    setImageLoadingState={setImageLoadingState}
                    imageLoadingState={imageLoadingState}
                    isEditMode={currentEditedId !== null}
                />
                <div className="py-6">
                    <CommonForm
                        formControls={addProductFormElements}
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={onSubmit}
                        isBtnDisabled={!isFormValid()}
                        buttonText={currentEditedId !== null 
                            ? 'Update'
                            : 'Add'}
                    >
                    </CommonForm>
                </div>
            </SheetContent>
        </Sheet>
    </Fragment>);
}

export default AdminProducts;
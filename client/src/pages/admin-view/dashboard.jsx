import { useEffect, useState } from "react";
import ProductImageUpload from "../../components/admin-view/image-upload";
import { Button } from "../../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addFeatureImages, getFeatureImages } from "../../store/common/common-slice";
import { useToast } from "../../hooks/use-toast";

function AdminDashboard() {
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const dispatch = useDispatch();
    const { featureImageList } = useSelector(state => state.commonFeatureImage);
    const { toast } = useToast();

    function handleUploadFeatureImage() {
        if (!uploadedImageUrl) {
            toast({
                title: 'Image not empty',
                variant: 'destructive'
            })
            return;
        }
        dispatch(addFeatureImages(uploadedImageUrl)).then((data) => {
            if (data?.payload?.success) {
                dispatch(getFeatureImages());
                setImageFile(null);
                setUploadedImageUrl(null);
            }
        })
    }

    useEffect(() => {
        dispatch(getFeatureImages());
    }, [dispatch])

    return (<div>
        <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isCustomStyling={true}
            isEditMode={false}
        />
        <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">Upload</Button>
        <div className="flex flex-col gap-4 mt-5">
            {
                featureImageList && featureImageList.length > 0
                    ? featureImageList.map(featureImageItem => <div key={featureImageItem?._id} className="relative mb-4">
                        <img
                            src={featureImageItem?.image}
                            alt=""
                            className='w-full h-[300px] object-cover rounded-t-lg'
                        />
                    </div>)
                    : null
            }
        </div>
    </div>);
}

export default AdminDashboard;
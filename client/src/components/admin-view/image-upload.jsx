import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { useEffect, useRef } from "react";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from 'axios';
import { Skeleton } from "@/components/ui/skeleton";

function ProductImageUpload({
    imageFile,
    setImageFile,
    setUploadedImageUrl,
    setImageLoadingState,
    imageLoadingState,
    isEditMode
}) {

    const inputRef = useRef(null);

    function handleChangeImageFile(event) {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setImageFile(selectedFile);
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) {
            setImageFile(droppedFile);
        }
    }

    function handleRemoveImageFile() {
        setImageFile(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    async function uploadImageToCloudinary() {
        setImageLoadingState(true);
        const data = new FormData();
        data.append('my_file', imageFile);
        const response = await axios.post(`${import.meta.env.VITE_API_NODEJS_PORT}/admin/products/upload-image`, data);

        if (response.data.success) {
            setUploadedImageUrl(response.data.data.url);
            setImageLoadingState(false);
        };
    }

    useEffect(() => {
        if (imageFile !== null) {
            uploadImageToCloudinary();
        }
    }, [imageFile]);

    return (<div className="w-full max-w-md mx-auto mt-4">
        <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
        <div 
            onDragOver={handleDragOver} 
            onDrop={handleDrop} 
            className={`${isEditMode ? 'opacity-60' : ''} border-2 border-dashed rounded-lg p-4`}>
            <Input
                id="image-upload"
                type="file"
                className="hidden"
                ref={inputRef}
                onChange={handleChangeImageFile}
                disabled={isEditMode}
            />
            {
                !imageFile
                    ?
                    <Label htmlFor="image-upload" className={`${isEditMode ? 'cursor-not-allowed' : ''} flex flex-col items-center justify-center h-32 cursor-pointer`}>
                        <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                        <span>Drag & drop or click to upload image</span>
                    </Label>
                    : (
                        imageLoadingState
                            ? <Skeleton className="h-10 bg-gray-100" />
                            :
                            <div className="flex items-center justify-between">
                                <div className="w-full flex items-center justify-between">
                                    <FileIcon className="w-8 text-primary mr-2 h-8" />
                                    <p className="text-sm font-medium">{imageFile.name}</p>
                                    <Button variant="ghost" size='icon' className="text-muted-foreground hover:text-foreground" onClick={handleRemoveImageFile}>
                                        <XIcon className="w-4 h-4" />
                                        <span className="sr-only">Remove File</span>
                                    </Button>
                                </div>
                            </div>
                    )
            }
        </div>
    </div>);
}

export default ProductImageUpload;
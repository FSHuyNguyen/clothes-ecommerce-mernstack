import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../../components/common/form";
import { addressFormControls } from "../../config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, deleteAddress, getAllAddress, updateAddress } from "../../store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "../../hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const initialAddressFormData = {
    address: '',
    city: '',
    phone: '',
    pincode: '',
    notes: '',
    isPrimary: false,
}

function Address({ setCurrentSelectedAddress }) {

    const [formData, setFormData] = useState(initialAddressFormData);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const { user } = useSelector(state => state.auth);
    const { addressList, isLoading } = useSelector(state => state.shoppingAddress);
    const dispatch = useDispatch();
    const { toast } = useToast();

    function handleManageAddress(event) {
        event.preventDefault();
        if (currentEditedId === null && addressList.length >= 2) {
            setFormData(initialAddressFormData);
            toast({
                title: 'You can add max 2 addresses',
                variant: 'destructive'
            })
            return;
        }

        currentEditedId !== null
            ? dispatch(updateAddress({
                userId: user?.id, addressId: currentEditedId, formData
            })).then((data) => {
                if (data?.payload?.success) {
                    dispatch(getAllAddress(user.id));
                    setCurrentEditedId(null);
                    setFormData(initialAddressFormData);
                    toast({
                        title: 'Address updated successfully'
                    })
                }
            })
            : dispatch(addNewAddress({
                ...formData,
                userId: user.id
            })).then((data) => {
                if (data?.payload?.success) {
                    dispatch(getAllAddress(user.id));
                    setFormData(initialAddressFormData);
                    toast({
                        title: 'Address created successfully'
                    })
                }
            })
    }

    function handleDeleteAddress(currentAddress) {
        dispatch(deleteAddress({ userId: user.id, addressId: currentAddress._id })).then((data) => {
            if (data?.payload?.success) {
                dispatch(getAllAddress(user?.id));
                toast({
                    title: 'Address delete successfully'
                })
            }
        })
    }

    function handleUpdateAddress(currentAddress) {
        setCurrentEditedId(currentAddress?._id);
        setFormData({
            ...formData,
            address: currentAddress?.address,
            city: currentAddress?.city,
            phone: currentAddress?.phone,
            pincode: currentAddress?.pincode,
            notes: currentAddress?.notes,
            isPrimary:  currentAddress?.isPrimary,
        })
    }

    function isFormValid() {
        return Object.keys(formData).map(key => formData[key] !== '').every((item) => item);
    }

    useEffect(() => {
        dispatch(getAllAddress(user.id));
    }, [dispatch])

    return (<Card>
        <div className="mb-5 p-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            {
                isLoading
                    ?
                    <>
                        <Skeleton className="h-[322px] w-[726px]" />
                        <Skeleton className="h-[322px] w-[726px]" />
                    </>
                    : addressList && addressList.length > 0
                        ? addressList.map(singleAddressItem =>
                            <AddressCard
                                key={singleAddressItem._id}
                                addressInfo={singleAddressItem}
                                handleDeleteAddress={handleDeleteAddress}
                                handleUpdateAddress={handleUpdateAddress}
                                setCurrentSelectedAddress={setCurrentSelectedAddress}
                            />)
                        : null
            }
        </div>
        <CardHeader>
            <CardTitle>
                {currentEditedId !== null ? 'Edit Address' : 'Add New Address'}
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <CommonForm
                formControls={addressFormControls}
                formData={formData}
                setFormData={setFormData}
                buttonText={"Add"}
                onSubmit={handleManageAddress}
                isBtnDisabled={!isFormValid()}
            />
        </CardContent>
    </Card>);
}

export default Address;
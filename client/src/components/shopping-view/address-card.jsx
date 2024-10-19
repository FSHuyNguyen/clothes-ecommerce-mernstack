import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";

function AddressCard({ addressInfo, handleUpdateAddress, handleDeleteAddress, setCurrentSelectedAddress }) {
    return (<Card className={`${addressInfo?.isPrimary ? 'border-primary' : ''} cursor-pointer`}
        onClick={setCurrentSelectedAddress
            ? () => setCurrentSelectedAddress(addressInfo)
            : null}
    >
        <CardHeader>
        </CardHeader>
        <CardContent className="grid gap-4">
            <Label>Address: {addressInfo?.address}</Label>
            <Label>City: {addressInfo?.city}</Label>
            <Label>Pincode: {addressInfo?.pincode}</Label>
            <Label>Phone: {addressInfo?.phone}</Label>
            <Label>Notes: {addressInfo?.notes}</Label>
        </CardContent>
        <CardFooter className="p-3 flex justify-between">
            <Button onClick={() => handleUpdateAddress(addressInfo)}>Update</Button>
            <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
        </CardFooter>
    </Card>);
}

export default AddressCard;
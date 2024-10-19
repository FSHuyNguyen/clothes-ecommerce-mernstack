import {
    DialogContent,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Separator } from "@radix-ui/react-select";
import moment from 'moment';
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";

function ShoppingOrderDetails({ orderDetail }) {
    const { user } = useSelector(state => state.auth);

    return (<DialogContent className="sm:max-w-[600px]">
        <div className="grid gap-6">
            <div className="grid gap-2">
                <div className="flex mt-6 items-center justify-between">
                    <p className="font-medium">Order ID</p>
                    <Label>{orderDetail?._id}</Label>
                </div>
                <div className="flex mt-2 items-center justify-between">
                    <p className="font-medium">Order Date</p>
                    <Label>{moment(orderDetail?.orderDate.split('T')[0]).format('DD-MM-YYYY')}</Label>
                </div>
                <div className="flex mt-2 items-center justify-between">
                    <p className="font-medium">Order Price</p>
                    <Label>${orderDetail?.totalAmount}</Label>
                </div>
                <div className="flex mt-2 items-center justify-between">
                    <p className="font-medium">Payment Method</p>
                    <Label>{orderDetail?.paymentMethod}</Label>
                </div>
                <div className="flex mt-2 items-center justify-between">
                    <p className="font-medium">Payment Status</p>
                    <Label>{orderDetail?.paymentStatus}</Label>
                </div>
                <div className="flex mt-2 items-center justify-between">
                    <p className="font-medium">Order Price</p>
                    <Label>${orderDetail?.totalAmount}</Label>
                </div>
                <div className="flex mt-2 items-center justify-between">
                    <p className="font-medium">Order Status</p>
                    <Label>
                        <Badge className={`py-1 px-3 
                            ${orderDetail?.orderStatus === 'confirmed'
                                ? 'bg-green-500'
                                : orderDetail?.orderStatus === 'rejected'
                                    ? 'bg-red-600'
                                    : 'bg-black'
                            }`}
                        >
                            {orderDetail?.orderStatus}
                        </Badge>
                    </Label>
                </div>
            </div>
            <Separator />

            <div className="grid gap-4">
                <div className="grid gap-2">
                    <div className="font-medium">Order Details</div>
                    <ul className="grid gap-3">
                        {
                            orderDetail?.cartItems && orderDetail.cartItems.length > 0
                                ? orderDetail?.cartItems.map(item =>
                                    <li key={item._id} className="flex items-center justify-between">
                                        <span>Title: {item.title}</span>
                                        <span>Quantity: {item.quantity}</span>
                                        <span>Price: ${item.price}</span>
                                    </li>
                                )
                                : null
                        }

                    </ul>
                </div>
            </div>

            <div className="grid gap-4">
                <div className="grid gap-2">
                    <div className="font-medium">Shipping Info</div>
                    <div className="grid gap-0.5 text-muted-foreground">
                        <span>{user?.userName}</span>
                        <span>{orderDetail?.addressInfo?.address}</span>
                        <span>{orderDetail?.addressInfo?.city}</span>
                        <span>{orderDetail?.addressInfo?.pincode}</span>
                        <span>{orderDetail?.addressInfo?.phone}</span>
                        <span>{orderDetail?.addressInfo?.notes}</span>
                    </div>
                </div>
            </div>
        </div>
    </DialogContent>);
}

export default ShoppingOrderDetails;
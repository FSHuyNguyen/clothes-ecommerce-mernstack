import { Button } from "../ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import ShoppingOrderDetails from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUserId, getOrderDetail, resetOrderDetail } from "../../store/shop/order-slice";
import { Badge } from "@/components/ui/badge";
import moment from "moment";

function ShoppingOrders() {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { orderList, orderDetail } = useSelector(state => state.shoppingOrder);

    function handleFetchOrderDetail(getId) {
        dispatch(getOrderDetail(getId));
    }

    useEffect(() => {
        dispatch(getAllOrdersByUserId(user?.id));
    }, [dispatch])

    useEffect(() => {
        if (orderDetail !== null) setOpenDetailsDialog(true);
    }, [orderDetail])

    return (<div>
        <Card>
            <CardHeader>
                <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Price</TableHead>
                            <TableHead>
                                <span className="sr-only">Details</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            orderList && orderList.length > 0
                                ? orderList.map(orderItem =>
                                    <TableRow key={orderItem?._id}>
                                        <TableCell>{orderItem?._id}</TableCell>
                                        <TableCell>{moment(orderItem?.orderDate.split('T')[0]).format('DD-MM-YYYY')}</TableCell>
                                        <TableCell>
                                            <Badge className={`py-1 px-3 
                                                ${orderItem?.orderStatus === 'confirmed'
                                                    ? 'bg-green-500'
                                                    : orderItem?.orderStatus === 'rejected'
                                                        ? 'bg-red-600'
                                                        : 'bg-black'
                                                }`}
                                            >
                                                {orderItem?.orderStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>${orderItem?.totalAmount}</TableCell>
                                        <TableCell>
                                            <Dialog open={openDetailsDialog} onOpenChange={() => {
                                                setOpenDetailsDialog(false);
                                                dispatch(resetOrderDetail);
                                            }}>
                                                <Button onClick={() => handleFetchOrderDetail(orderItem?._id)}>View Details</Button>
                                                <ShoppingOrderDetails orderDetail={orderDetail} />
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                )
                                : null
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>);
}

export default ShoppingOrders;
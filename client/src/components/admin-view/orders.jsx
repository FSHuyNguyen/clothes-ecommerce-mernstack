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
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import AdminOrderDetails from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin, getOrderDetailForAdmin, resetOrderDetail } from "../../store/admin/order-slice";
import moment from "moment";
import { Badge } from "@/components/ui/badge";

function AdminOrdersView() {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { orderList, orderDetail } = useSelector(state => state.adminOrder);
    const dispatch = useDispatch();

    function handleFetchOrderDetail(getId) {
        dispatch(getOrderDetailForAdmin(getId));
    }

    useEffect(() => {
        dispatch(getAllOrdersForAdmin());
    }, [dispatch])

    useEffect(() => {
        if (orderDetail !== null) setOpenDetailsDialog(true);
    }, [orderDetail])

    return (<div>
        <Card>
            <CardHeader>
                <CardTitle>All Orders</CardTitle>
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
                                            <Dialog open={openDetailsDialog}
                                                onOpenChange={() => {
                                                    setOpenDetailsDialog(false);
                                                    dispatch(resetOrderDetail());
                                                }}
                                            >
                                                <DialogTitle></DialogTitle>
                                                <DialogDescription></DialogDescription>
                                                <Button
                                                    onClick={() => handleFetchOrderDetail(orderItem?._id)}
                                                >
                                                    View Details
                                                </Button>
                                                <AdminOrderDetails orderDetail={orderDetail} />
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

export default AdminOrdersView;
import { useDispatch } from "react-redux";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { captureNewOrder } from "../../store/shop/order-slice";

function PaypalReturnPage() {

    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('paymentId');
    const payerId = params.get('PayerID');

    useEffect(() => {
        if (paymentId && payerId) {
            const getCurrentOrderId = JSON.parse(sessionStorage.getItem('currentOrderId'));

            dispatch(captureNewOrder({ paymentId, payerId, orderId: getCurrentOrderId })).then((data) => {
                console.log("data", data);
                if (data?.payload?.success) {
                    sessionStorage.removeItem("currentOrderId");
                    window.location.href = '/shop/payment-success';
                }
            })
        }
    }, [paymentId, payerId, dispatch])
    return (
        <Card>
            <CardHeader>
                <CardTitle>Processing Payment...Please wait!</CardTitle>
            </CardHeader>
        </Card>
    );
}

export default PaypalReturnPage;
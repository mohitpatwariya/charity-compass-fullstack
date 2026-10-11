import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Payment({charityId}) {
    const [amount, setAmount] = useState(0);
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    async function createOrder(amount) {
        //make an api call to create the order (could be done in front-end)
        const reqUrl = `${API_URL}/api/donation/createPaymentOrder`;
        const orderOptions = {
            amount,
            currency: "INR",
            // receipt: `$order_${charity.id}_${Date.now()}`, --> this may not be required because we are creating the receipt in the backend
        };
        const result = await fetch(reqUrl, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderOptions),
        });
        const order = await result.json();
        return order.data;
    }

    async function paymentHandler(event) {
        event.preventDefault();
        const order = await createOrder(amount);
        await initiatePayment(order);
    }

    async function initiatePayment({ orderId, amount, currency }) {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            amount,
            currency,
            name: "Charity Finder",
            description: "Donation for needy",
            order_id: orderId,

            handler: async function (response) {
                console.log(response); 
                const reqUrl = `${API_URL}/api/donation/paymentCallback`;
                await fetch(reqUrl, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...response,
                        charityId
                    }),
                })
                    .then((response) => response.json())
                    .then((result) => {
                        console.log(result);
                        toast.success('Donation Successful');
                        setTimeout(() => navigate('/dashboard'), 500);
                    })
                    .catch((error) => console.error(error));
            },

            modal: {
                ondismiss: function () {
                    // Handle payment failure or dismissal
                    console.log("Payment dismissed or failed");
                    //navigate back to some other route
                },
            }
        };
        // const razorpayInstance = await loadRazorpay();
        // const paymentObject = new razorpayInstance(options);
        // paymentObject.open();

        const rzp = new window.Razorpay(options);
        rzp.open();
    }
    return (
        <div className="payment">
            <form onSubmit={paymentHandler}>
                <input
                    type="number"
                    placeholder="Enter Payment Amount"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                />
                <button type="submit">PAY NOW</button>
            </form>
            <Toaster />
        </div>
    );
}

export default Payment;

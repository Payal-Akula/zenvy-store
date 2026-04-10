/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Success() {
    const navigate = useNavigate();

    const orderId = localStorage.getItem("orderId");
    
    useEffect(() => {
        if (!orderId || orderId === "null" || orderId === "undefined") {
            alert.error("Invalid order ❌");
            navigate("/");
            return;
        }
        
        const timer = setTimeout(() => {
            navigate("/orders");
        }, 3000);
        
        return () => clearTimeout(timer);
    }, [orderId, navigate]);

    const downloadInvoice = () => {
        const id = localStorage.getItem("orderId");
        
        if (!id || id === "null" || id === "undefined") {
            alert("Order ID missing ❌");
            return;
        }
        
        window.open(`http://localhost:2000/api/order/invoice/${id}`, '_blank');
    };

    return (
        <>
            <style>
                {`
                    body {
                        background: #f3f4f6;
                    }
                    
                    .success-box {
                        max-width: 500px;
                        margin: 60px auto;
                        background: white;
                        padding: 30px;
                        border-radius: 12px;
                        text-align: center;
                        box-shadow: 0 6px 20px rgba(0,0,0,0.08);
                    }
                    
                    .btn-home {
                        background: linear-gradient(135deg, #ff4b2b, #ff416c);
                        border: none;
                        color: white;
                    }
                `}
            </style>

            <div className="success-box">
                <h2 className="text-success">🎉 Order Placed!</h2>
                <p className="mt-2">Your order has been successfully placed.</p>
                <p><b>Order ID:</b> {orderId}</p>
                <p className="small text-muted">A confirmation email has been sent to your email.</p>
                
                <div className="d-flex gap-2 justify-content-center mt-3">
                    <button className="btn btn-home" onClick={() => navigate("/")}>
                        Back to Home
                    </button>
                    <button className="btn btn-dark" onClick={downloadInvoice}>
                        Download Invoice
                    </button>
                </div>
            </div>
        </>
    );
}

export default Success;
'use client';

import { useEffect, useState } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { banDishThunk, fetchDishesThunk, unbanDishThunk } from "@/app/redux/features/dishes/dishSlice";
import './order.css';
import Update from '@/components/Admin/Update'
import { fetchOrdersBySellerIdThunk } from '@/app/redux/features/order/orderSlice';

export default function Order() {
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.users.currentUser?.id);
    const orders = useAppSelector((state) => state.order.orders);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
    const [page, setPage] = useState(1);
    useEffect(() => {
        dispatch(
            fetchOrdersBySellerIdThunk(userId),
        );
    }, [
        dispatch,
        page,
    ]);

    const total = useAppSelector((state) => state.dishes.total) || 10;

    const [dishId, setDishId] = useState(null);

    return (
        <div className="admin-containerrr" style={{ marginTop: '50px' }}>
            <h1 className="admin-title">Pending Order Item List</h1>

            {!orders?.length ? (
                <div className="admin-empty">No Order found</div>
            ) : (
                <>
                    {orders.map((order: any) => (

                        <div key={order.id} className="admin-row">
                            <div className="admin-info">
                                <strong>{order.productName}</strong>
                                <p>₹{order.price}</p>
                                <p>Quantity: {order.quantity}</p>
                            </div>


                        </div>
                    ))}
                </>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2500}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarType}
                    variant="filled"
                >
                    {snackbarMsg}
                </Alert>
            </Snackbar>

        </div>
    );
}

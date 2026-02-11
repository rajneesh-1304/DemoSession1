'use client';

import { useEffect, useState } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { banDishThunk, fetchDishesThunk, unbanDishThunk } from "@/app/redux/features/dishes/dishSlice";
import './alldish.css';
import { useRouter } from 'next/navigation';
import Update from '@/components/Admin/Update'

export default function AllDish() {
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.users.currentUser?.id);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dishes = useAppSelector(
        (state) => state.dishes.dishes,
    );

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
    const [page, setPage] = useState(1);
    const limit = 10;
    useEffect(() => {
        dispatch(
            fetchDishesThunk({
                page,
                limit: limit,
                sellerId: userId
            }),
        );
    }, [
        dispatch,
        page,
    ]);

    const total = useAppSelector((state) => state.dishes.total) || 10;
    const handleBanToggle = async (product: any) => {
        let result;
        if (product.isAvaliable) {
            result = await dispatch(banDishThunk(product.id));
        } else {
            result = await dispatch(unbanDishThunk(product.id));
        }

        if (
            banDishThunk.fulfilled.match(result) ||
            unbanDishThunk.fulfilled.match(result)
        ) {
            setSnackbarMsg(
                product.isAvaliable ? 'Product unbanned successfully' : 'Product banned successfully'
            );
            setSnackbarType('success');
            dispatch(
            fetchDishesThunk({
                page,
                limit: limit,
                sellerId: userId
            }),);
        } else {
            setSnackbarMsg(result.payload as string || 'Action failed');
            setSnackbarType('error');
        }

        setSnackbarOpen(true);
    };
    const [dishId, setDishId] = useState(null);

    return (
        <div className="admin-containerrr" style={{ marginTop: '50px' }}>
            <h1 className="admin-title">Product Management</h1>

            {!dishes?.length ? (
                <div className="admin-empty">No Dish found</div>
            ) : (
                <>
                    {dishes.map((dish: any) => (

                        <div key={dish.id} className="admin-row">
                            <div className="admin-info">
                                <strong>{dish.title}</strong>
                                <p>₹{dish.price}</p>
                            </div>

                            <div className='updateDiv'>
                                <button className='btn-unban'
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setDishId(dish.id);
                                }}
                            // disabled={loading}
                            >
                                Update 
                            </button>

                            <button
                                className={dish.isAvaliable ? 'btn-ban' : 'btn-unban'}
                                onClick={() => handleBanToggle(dish)}
                            // disabled={loading}
                            >
                                {dish.isAvaliable ? 'Ban' : 'Unban'}
                            </button>
                            </div>
                        </div>
                    ))}

                    {/* <div className="pagination">
                        <Button
                            variant="contained"
                            disabled={page <= 1}
                            onClick={() => setPage(prev => prev - 1)}
                        >
                            Previous
                        </Button>
                        <span style={{ margin: '0 10px' }}>
                            Page {page} of {total}
                        </span>
                        <Button
                            variant="contained"
                            disabled={page >= total}
                            onClick={() => setPage(prev => prev + 1)}
                        >
                            Next
                        </Button>
                    </div> */}
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

            {isModalOpen && <Update id={dishId} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}

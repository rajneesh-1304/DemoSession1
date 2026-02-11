"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { Box, Button, FormControl, Snackbar, TextField } from "@mui/material";
import "./address.css";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchDishesThunk, updateDishThunk } from "@/app/redux/features/dishes/dishSlice";

type AddProductModalProps = {
    id: any,
    onClose: () => void;
};

const productSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.number().positive(),
    images: z
        .any()
        .refine((files: FileList) => files?.length > 0 && files?.length <= 1, {
            message: "Please upload image",
        }),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductModal({ id, onClose }: AddProductModalProps) {
    const dispatch = useAppDispatch();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const user = useSelector((state: RootState) => state.users.currentUser);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
    });
    const userId = useAppSelector((state) => state.users.currentUser?.id);
    const onSubmit = async (formData: ProductFormData) => {
        console.log
        if (!user) return;

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("price", formData.price.toString());
        formDataToSend.append("sellerId", String(user.id));

        Array.from(formData.images).forEach((file: any) => {
            formDataToSend.append("images", file);
        });

        try {
            await dispatch(updateDishThunk({ id, formDataToSend })).unwrap();
            dispatch(
                fetchDishesThunk({
                    page: 1,
                    limit: 10,
                    sellerId: userId
                }),
            );
            setSnackbarMessage("Dish updated successfully!");
            setSnackbarOpen(true);
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error: any) {
            setSnackbarMessage(error.message || "Error in updating Dish");
            setSnackbarOpen(true);
        }
        reset();
    };


    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackbarOpen(false);
    };


    return (
        <div className="modal_overlay">
            <div className="modal">
                <h2>Update Dish</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="modal_form">
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: 350,
                            gap: 0.75,
                        }}
                    >
                        <FormControl variant="standard">
                            <TextField
                                label="Name"
                                variant="outlined"
                                size="small"
                                {...register("name")}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </FormControl>

                        <FormControl variant="standard">
                            <TextField
                                label="Description"
                                variant="outlined"
                                size="small"
                                {...register("description")}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                        </FormControl>

                        <FormControl variant="standard">
                            <TextField
                                label="Price"
                                type="number"
                                size="small"
                                variant="outlined"
                                {...register("price", { valueAsNumber: true })}
                                error={!!errors.price}
                                helperText={errors.price?.message}
                            />
                        </FormControl>

                        <FormControl variant="standard">
                            <label style={{ fontSize: 14, marginBottom: 4 }}>
                                Upload Images
                            </label>
                            <Controller
                                name="images"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => field.onChange(e.target.files)}
                                    />
                                )}
                            />
                            {errors.images && (
                                <p style={{ color: "red", fontSize: 12 }}>
                                    {errors.images.message as string}
                                </p>
                            )}
                        </FormControl>

                        <div className="modal_actions">
                            <Button variant="contained" sx={{ mt: 1, width: 200 }} type="submit">
                                Update
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ mt: 1, width: 200 }}
                                onClick={() => onClose()}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Box>
                </form>
            </div>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={handleClose}
                message={snackbarMessage}
            />
        </div>
    );
}

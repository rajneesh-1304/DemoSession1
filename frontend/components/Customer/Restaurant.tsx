"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "./dishess.css";
import { fetchDishesThunk } from "@/app/redux/features/dishes/dishSlice";
import { getAddressThunk, getAllAddressThunk } from "@/app/redux/features/address/addressSlice";
import { useRouter } from "next/navigation";

const LIMIT = 10;

export default function Restaurant() {
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.users.currentUser?.id);

  const address = useAppSelector(
    (state) => state.address.address ,
  );
  const router = useRouter();


  const total = useAppSelector((state)=> state.dishes.total) || 10;

  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
  };

  const handleCloseSnackbar = () => setSnackbar(null);

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(total / LIMIT);

  const handleView = (id: any) => {
    router.push(`/${id}`);
  }


  useEffect(() => {
    dispatch(
      getAllAddressThunk(),
    );
  }, [
    dispatch,
    page,
  ]);
  return (
    <div className="home">
      <div className="prod">
        {address.length > 0 ? (
          address.map((p, idx) => (
            <div className="card" key={idx}>
              <div className="card_image">
                <img
                  className="card_img"
                  src={p.images ?? "/no-image.png"}
                  alt={p.title}
                />
              </div>

              <div className="card_body">
                <h3 className="property">{p.name}</h3>
                <p className="category">{p.description}</p>


                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    className="add_to_cart_btn"
                    onClick={async () => handleView(p.id)}
                    
                  >
                    View Recipes
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No Restautant found.</p>
        )}
      </div>


      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar?.type || "success"}
          sx={{ width: "100%" }}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "./dishess.css";
import { fetchDishesUserThunk } from "@/app/redux/features/dishes/dishSlice";
import { addToCartThunk } from "@/app/redux/features/cart/cartSlice";

const LIMIT = 10;

export default function Dishes(id: any) {
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.users.currentUser?.id);
  const [loading, setLoading] = useState(false);
  const dishes = useAppSelector(
    (state) => state.dishes.dishes,
  );

  const total = useAppSelector((state) => state.dishes.total) || 10;
  const searchValue = useAppSelector((state: any) => state.search.searchValue);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight && !loading) {
      setPage((prev) => prev + 1);
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const handleCloseSnackbar = () => setSnackbar(null);

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(total / LIMIT);

  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setPage(1);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchValue]);

  useEffect(() => {
    setLoading(true);
    dispatch(
      fetchDishesUserThunk({
        page,
        limit: LIMIT,
        sellerId: id.id,
        searchValue: debouncedSearch
      }),
    );
    setLoading(false);
  }, [
    dispatch,
    page, debouncedSearch
  ]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);
  return (
    <div className="home">

      <div className="prod">
        {dishes.length > 0 ? (
          dishes.map((p, idx) => (
            <div className="card" key={idx}>
              <div className="card_image">
                <img
                  className="card_img"
                  src={p.images ?? "/no-image.png"}
                  alt={p.title}
                />
              </div>

              <div className="card_body">
                <h3 className="property">{p.title}</h3>
                <p className="category">{p.description}</p>

                <div className="price">
                  <span className="amount">₹ {p.price}</span>
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    className="add_to_cart_btn"
                    onClick={async () => {
                      if (!userId) {
                        showSnackbar("Please login first", "error");
                        return;
                      }
                      try {
                        await dispatch(
                          addToCartThunk({
                            userId,
                            productId: p.id,
                            quantity: 1,
                            sellerId: p.sellerId,
                          }),
                        ).unwrap();
                        showSnackbar("Added to cart ✅", "success");
                      } catch {
                        showSnackbar("Failed to add to cart ❌", "error");
                      }
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No dishes found.</p>
        )}
      </div>

      {/* {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )} */}

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

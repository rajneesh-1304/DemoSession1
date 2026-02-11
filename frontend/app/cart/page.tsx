"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { useAppSelector } from "@/app/redux/hooks";
import "@/app/cart/cart.css";
import { useRouter } from "next/navigation";
import { Snackbar, Alert } from "@mui/material";
import { clearCartThunk, fetchCartThunk, removeItemThunk, updateQuantityThunk } from "../redux/features/cart/cartSlice";
import { placeOrderThunk } from "../redux/features/order/orderSlice";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useAppSelector((state) => state.users.currentUser?.id);

  const cart = useAppSelector((state) => state.cart.cart);
  const cartItems = cart?.items || [];
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [addressForm, setAddressForm] = useState({
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartThunk(userId));
    }
  }, [userId, dispatch]);

  const totalAmount = cartItems.reduce(
    (sum: number, item: any) => sum + item.product.price * item.quantity,
    0,
  );

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(null);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showSnackbar("Your cart is empty!", "error");
      return;
    }

    placeOrder();
  };



  const placeOrder = async () => {
    if (!userId) return;

    setPlacingOrder(true);

    try {
      await dispatch(placeOrderThunk(userId)).unwrap();
      await dispatch(clearCartThunk(userId));
      showSnackbar(
        `Order placed successfully 🎉`,
        "success",
      );
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to place order ❌", "error");
    } finally {
      setPlacingOrder(false);
    }
  };
  console.log(cartItems, 'sdkjflaj')

  return (
    <div className="cart-container" style={{ marginTop: "50px" }}>
      <h1 className="cart-title">Shopping Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item: any) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.product.images}
                alt={item.product.title}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3>{item.product.title}</h3>
                <p className="cart-item-price">₹ {item.product.price}</p>
                <div className="quantity-controls">
                  <button
                    disabled={item.quantity === 1}
                    onClick={() =>
                      dispatch(
                        updateQuantityThunk({
                          itemId: item.id,
                          quantity: item.quantity - 1,
                        }),
                      )
                    }
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantityThunk({
                          itemId: item.id,
                          quantity: item.quantity + 1,
                        }),
                      )
                    }
                  >
                    +
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => dispatch(removeItemThunk(item.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="cart-item-total">
                ₹ {item.product.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Total Items</span>
            <span>{cartItems.length}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹ {totalAmount}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={placingOrder}
          >
            {placingOrder ? "Processing..." : "Checkout"}
          </button>

          <button
            className="clear-cart-btn"
            onClick={() => userId && dispatch(clearCartThunk(userId))}
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/* {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Delivery Address</h2>
            <form onSubmit={handleAddressSubmit} className="address-form">
              <input
                type="text"
                placeholder="Landmark"
                value={addressForm.landmark}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, landmark: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="City *"
                value={addressForm.city}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, city: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="State *"
                value={addressForm.state}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, state: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Pincode *"
                value={addressForm.pincode}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, pincode: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={addressForm.country}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, country: e.target.value })
                }
              />
              <div className="modal-actions">
                <button
                  type="submit"
                  className="checkout-btn"
                  disabled={placingOrder}
                >
                  Save & Place Order
                </button>
                <button
                  type="button"
                  className="clear-cart-btn"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
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
          {snackbar?.message || ""}
        </Alert>
      </Snackbar>
    </div>
  );
}

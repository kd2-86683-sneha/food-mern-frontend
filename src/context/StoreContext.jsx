import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  const url = "https://food-mern-backend-h6eah4cchbfqh6an.centralindia-01.azurewebsites.net";

  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // ✅ ADD TO CART
  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({
        ...prev,
        [itemId]: prev[itemId] + 1,
      }));
    }

    if (token) {
      try {
        const response = await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );

        if (response.data.success) {
          toast.success("Item Added to Cart");
        } else {
          toast.error("Something went wrong");
        }
      } catch (error) {
        console.log("Add Cart Error:", error);
      }
    }
  };

  // ✅ REMOVE FROM CART
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] - 1,
    }));

    if (token) {
      try {
        const response = await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );

        if (response.data.success) {
          toast.success("Item Removed from Cart");
        } else {
          toast.error("Something went wrong");
        }
      } catch (error) {
        console.log("Remove Cart Error:", error);
      }
    }
  };

  // ✅ TOTAL AMOUNT (SAFE FIX)
  const getTotalCartAmount = () => {
    let totalAmount = 0;

    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find(
          (product) => product._id === item
        );

        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }

    return totalAmount;
  };

  // ✅ FETCH FOOD LIST (🔥 MAIN FIX)
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");

      console.log("FULL API RESPONSE:", response.data);

      // 🔥 HANDLE ALL CASES
      if (response.data.success) {
        setFoodList(response.data.data);
      } 
      else if (Array.isArray(response.data)) {
        setFoodList(response.data);
      } 
      else if (response.data.data) {
        setFoodList(response.data.data);
      } 
      else {
        console.log("Unexpected format:", response.data);
        setFoodList([]);
      }

    } catch (error) {
      console.log("Fetch Food Error:", error);
      setFoodList([]);
    }
  };

  // ✅ LOAD CART DATA
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token } }
      );

      setCartItems(response.data.cartData);
    } catch (error) {
      console.log("Cart Load Error:", error);
    }
  };

  // ✅ INITIAL LOAD
  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();

      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    };

    loadData();
  }, []);

  // ✅ CONTEXT VALUE
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
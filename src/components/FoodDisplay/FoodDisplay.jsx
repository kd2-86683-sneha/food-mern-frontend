// import React, { useContext } from "react";
// import "./FoodDisplay.css";
// import { StoreContext } from "../../context/StoreContext";
// import FoodItem from "../FoodItem/FoodItem";

// const FoodDisplay = ({ category }) => {
//   const { food_list } = useContext(StoreContext);
//   return (
//     <div className="food-display" id="food-display">
//       <h2>Top dishes near you</h2>
//       <div className="food-display-list">
//         {food_list.map((item, index) => {
//           if ((category === "All" || category === item.category))
//             return (
//               <FoodItem
//                 key={index}
//                 id={item._id}
//                 name={item.name}
//                 description={item.description}
//                 price={item.price}
//                 image={item.image}
//               />
//             );
//         })}
//       </div>
//     </div>
//   );
// };

// export default FoodDisplay;


import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  console.log("Selected Category:", category);
  console.log("Food List:", food_list);   // debug

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>

      <div className="food-display-list">
        {food_list.map((item) => {
          console.log("Comparing:", category, "vs", item.category); // ✅ HERE
          if (
            category === "All" ||
            category.toLowerCase() === item.category.toLowerCase()
          ) {
            return (
              <FoodItem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;



























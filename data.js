// Common food database for V1. Macros are per stated serving.
// common: true => surfaced first in category lists and used for default quick-add suggestions.
// vi: Vietnamese search aliases (display stays English; matched diacritic-insensitively).
const FOOD_DB = [
  // --- Fruits ---
  { id: 'banana', name: 'Banana', category: 'Fruits', servingSize: 1, servingUnit: 'medium', calories: 105, protein: 1.3, fat: 0.4, common: true, vi: 'chuối' },
  { id: 'apple', name: 'Apple', category: 'Fruits', servingSize: 1, servingUnit: 'medium', calories: 95, protein: 0.5, fat: 0.3, common: true, vi: 'táo' },
  { id: 'orange', name: 'Orange', category: 'Fruits', servingSize: 1, servingUnit: 'medium', calories: 62, protein: 1.2, fat: 0.2, common: true, vi: 'cam' },
  { id: 'strawberries', name: 'Strawberries', category: 'Fruits', servingSize: 100, servingUnit: 'g', calories: 32, protein: 0.7, fat: 0.3, common: true, vi: 'dâu tây' },
  { id: 'blueberries', name: 'Blueberries', category: 'Fruits', servingSize: 100, servingUnit: 'g', calories: 57, protein: 0.7, fat: 0.3, vi: 'việt quất' },
  { id: 'grapes', name: 'Grapes', category: 'Fruits', servingSize: 100, servingUnit: 'g', calories: 69, protein: 0.7, fat: 0.2, vi: 'nho' },
  { id: 'avocado', name: 'Avocado', category: 'Fruits', servingSize: 1, servingUnit: 'medium', calories: 240, protein: 3, fat: 22, common: true, vi: 'bơ trái bơ' },
  { id: 'mango', name: 'Mango', category: 'Fruits', servingSize: 100, servingUnit: 'g', calories: 60, protein: 0.8, fat: 0.4, vi: 'xoài' },
  { id: 'watermelon', name: 'Watermelon', category: 'Fruits', servingSize: 100, servingUnit: 'g', calories: 30, protein: 0.6, fat: 0.2, vi: 'dưa hấu' },
  { id: 'pineapple', name: 'Pineapple', category: 'Fruits', servingSize: 100, servingUnit: 'g', calories: 50, protein: 0.5, fat: 0.1, vi: 'dứa thơm khóm' },

  // --- Vegetables ---
  { id: 'broccoli', name: 'Broccoli (cooked)', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 35, protein: 2.4, fat: 0.4, common: true, vi: 'bông cải xanh súp lơ xanh' },
  { id: 'spinach', name: 'Spinach (raw)', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 23, protein: 2.9, fat: 0.4, common: true, vi: 'rau chân vịt cải bó xôi' },
  { id: 'carrot', name: 'Carrot', category: 'Vegetables', servingSize: 1, servingUnit: 'medium', calories: 25, protein: 0.6, fat: 0.1, vi: 'cà rốt' },
  { id: 'sweet_potato', name: 'Sweet Potato (baked)', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 90, protein: 2, fat: 0.2, common: true, vi: 'khoai lang' },
  { id: 'potato', name: 'Potato (baked)', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 93, protein: 2.5, fat: 0.1, common: true, vi: 'khoai tây' },
  { id: 'tomato', name: 'Tomato', category: 'Vegetables', servingSize: 1, servingUnit: 'medium', calories: 22, protein: 1.1, fat: 0.2, vi: 'cà chua' },
  { id: 'cucumber', name: 'Cucumber', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 15, protein: 0.7, fat: 0.1, vi: 'dưa chuột dưa leo' },
  { id: 'bell_pepper', name: 'Bell Pepper', category: 'Vegetables', servingSize: 1, servingUnit: 'medium', calories: 24, protein: 1, fat: 0.2, vi: 'ớt chuông' },
  { id: 'mixed_salad', name: 'Mixed Green Salad', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 20, protein: 1.5, fat: 0.2, vi: 'xà lách rau trộn salad' },
  { id: 'onion', name: 'Onion', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 40, protein: 1.1, fat: 0.1, vi: 'hành tây' },

  // --- Meat & Poultry ---
  { id: 'chicken_breast', name: 'Chicken Breast (cooked)', category: 'Meat & Poultry', servingSize: 100, servingUnit: 'g', calories: 165, protein: 31, fat: 3.6, common: true, vi: 'ức gà thịt gà' },
  { id: 'chicken_thigh', name: 'Chicken Thigh (cooked)', category: 'Meat & Poultry', servingSize: 100, servingUnit: 'g', calories: 209, protein: 26, fat: 10.9, common: true, vi: 'đùi gà thịt gà' },
  { id: 'ground_beef_85', name: 'Ground Beef 85/15 (cooked)', category: 'Meat & Poultry', servingSize: 100, servingUnit: 'g', calories: 250, protein: 26, fat: 17, common: true, vi: 'thịt bò xay bò xay' },
  { id: 'ground_turkey', name: 'Ground Turkey (cooked)', category: 'Meat & Poultry', servingSize: 100, servingUnit: 'g', calories: 189, protein: 27, fat: 8, common: true, vi: 'thịt gà tây xay' },
  { id: 'steak_sirloin', name: 'Sirloin Steak (cooked)', category: 'Meat & Poultry', servingSize: 100, servingUnit: 'g', calories: 206, protein: 29, fat: 9, vi: 'thịt bò bít tết bò' },
  { id: 'pork_chop', name: 'Pork Chop (cooked)', category: 'Meat & Poultry', servingSize: 100, servingUnit: 'g', calories: 231, protein: 27, fat: 13, vi: 'sườn heo thịt heo thịt lợn' },
  { id: 'bacon', name: 'Bacon', category: 'Meat & Poultry', servingSize: 2, servingUnit: 'slices', calories: 90, protein: 6, fat: 7, common: true, vi: 'thịt xông khói ba rọi' },
  { id: 'turkey_breast_deli', name: 'Turkey Breast (deli)', category: 'Meat & Poultry', servingSize: 100, servingUnit: 'g', calories: 104, protein: 17, fat: 1.7, vi: 'ức gà tây' },

  // --- Fish & Seafood ---
  { id: 'salmon', name: 'Salmon (cooked)', category: 'Fish & Seafood', servingSize: 100, servingUnit: 'g', calories: 208, protein: 20, fat: 13, common: true, vi: 'cá hồi' },
  { id: 'tuna_canned', name: 'Tuna, canned (in water)', category: 'Fish & Seafood', servingSize: 100, servingUnit: 'g', calories: 116, protein: 26, fat: 0.8, common: true, vi: 'cá ngừ' },
  { id: 'shrimp', name: 'Shrimp (cooked)', category: 'Fish & Seafood', servingSize: 100, servingUnit: 'g', calories: 99, protein: 24, fat: 0.3, common: true, vi: 'tôm' },
  { id: 'tilapia', name: 'Tilapia (cooked)', category: 'Fish & Seafood', servingSize: 100, servingUnit: 'g', calories: 128, protein: 26, fat: 2.7, vi: 'cá rô phi' },
  { id: 'cod', name: 'Cod (cooked)', category: 'Fish & Seafood', servingSize: 100, servingUnit: 'g', calories: 105, protein: 23, fat: 0.9, vi: 'cá tuyết' },

  // --- Dairy & Eggs ---
  { id: 'egg', name: 'Egg, large', category: 'Dairy & Eggs', servingSize: 1, servingUnit: 'egg', calories: 72, protein: 6.3, fat: 4.8, common: true, vi: 'trứng trứng gà' },
  { id: 'egg_white', name: 'Egg White', category: 'Dairy & Eggs', servingSize: 1, servingUnit: 'egg white', calories: 17, protein: 3.6, fat: 0.1, common: true, vi: 'lòng trắng trứng' },
  { id: 'greek_yogurt_plain', name: 'Greek Yogurt, plain (nonfat)', category: 'Dairy & Eggs', servingSize: 170, servingUnit: 'g (1 cup)', calories: 100, protein: 17, fat: 0.7, common: true, vi: 'sữa chua hy lạp' },
  { id: 'milk_whole', name: 'Milk, whole', category: 'Dairy & Eggs', servingSize: 240, servingUnit: 'ml (1 cup)', calories: 149, protein: 8, fat: 8, vi: 'sữa nguyên kem sữa tươi' },
  { id: 'milk_skim', name: 'Milk, skim', category: 'Dairy & Eggs', servingSize: 240, servingUnit: 'ml (1 cup)', calories: 83, protein: 8.3, fat: 0.2, vi: 'sữa tách béo' },
  { id: 'cheddar_cheese', name: 'Cheddar Cheese', category: 'Dairy & Eggs', servingSize: 28, servingUnit: 'g (1 oz)', calories: 113, protein: 7, fat: 9.3, common: true, vi: 'phô mai phô mai cheddar' },
  { id: 'mozzarella', name: 'Mozzarella Cheese', category: 'Dairy & Eggs', servingSize: 28, servingUnit: 'g (1 oz)', calories: 85, protein: 6.3, fat: 6.3, vi: 'phô mai mozzarella' },
  { id: 'cottage_cheese', name: 'Cottage Cheese, low-fat', category: 'Dairy & Eggs', servingSize: 100, servingUnit: 'g', calories: 82, protein: 11, fat: 2.3, common: true, vi: 'phô mai tươi' },
  { id: 'butter', name: 'Butter', category: 'Dairy & Eggs', servingSize: 1, servingUnit: 'tbsp', calories: 102, protein: 0.1, fat: 11.5, vi: 'bơ bơ lạt' },

  // --- Grains & Bread ---
  { id: 'white_rice', name: 'White Rice (cooked)', category: 'Grains & Bread', servingSize: 100, servingUnit: 'g', calories: 130, protein: 2.7, fat: 0.3, common: true, vi: 'cơm cơm trắng gạo' },
  { id: 'brown_rice', name: 'Brown Rice (cooked)', category: 'Grains & Bread', servingSize: 100, servingUnit: 'g', calories: 123, protein: 2.7, fat: 1, common: true, vi: 'gạo lứt cơm gạo lứt' },
  { id: 'oats', name: 'Oats, rolled (dry)', category: 'Grains & Bread', servingSize: 40, servingUnit: 'g (1/2 cup)', calories: 150, protein: 5, fat: 3, common: true, vi: 'yến mạch' },
  { id: 'white_bread', name: 'White Bread', category: 'Grains & Bread', servingSize: 1, servingUnit: 'slice', calories: 75, protein: 2.6, fat: 1, common: true, vi: 'bánh mì bánh mì trắng' },
  { id: 'whole_wheat_bread', name: 'Whole Wheat Bread', category: 'Grains & Bread', servingSize: 1, servingUnit: 'slice', calories: 81, protein: 4, fat: 1.1, common: true, vi: 'bánh mì nguyên cám' },
  { id: 'pasta', name: 'Pasta (cooked)', category: 'Grains & Bread', servingSize: 100, servingUnit: 'g', calories: 131, protein: 5, fat: 1.1, common: true, vi: 'mì ống nui mì ý' },
  { id: 'quinoa', name: 'Quinoa (cooked)', category: 'Grains & Bread', servingSize: 100, servingUnit: 'g', calories: 120, protein: 4.4, fat: 1.9, vi: 'diêm mạch hạt quinoa' },
  { id: 'tortilla_flour', name: 'Flour Tortilla', category: 'Grains & Bread', servingSize: 1, servingUnit: 'medium', calories: 146, protein: 4, fat: 3.5, vi: 'bánh tortilla' },
  { id: 'bagel', name: 'Bagel, plain', category: 'Grains & Bread', servingSize: 1, servingUnit: 'bagel', calories: 245, protein: 10, fat: 1.5, vi: 'bánh mì vòng' },

  // --- Legumes, Nuts & Seeds ---
  { id: 'black_beans', name: 'Black Beans (cooked)', category: 'Legumes, Nuts & Seeds', servingSize: 100, servingUnit: 'g', calories: 132, protein: 8.9, fat: 0.5, common: true, vi: 'đậu đen' },
  { id: 'chickpeas', name: 'Chickpeas (cooked)', category: 'Legumes, Nuts & Seeds', servingSize: 100, servingUnit: 'g', calories: 164, protein: 8.9, fat: 2.6, common: true, vi: 'đậu gà' },
  { id: 'lentils', name: 'Lentils (cooked)', category: 'Legumes, Nuts & Seeds', servingSize: 100, servingUnit: 'g', calories: 116, protein: 9, fat: 0.4, vi: 'đậu lăng' },
  { id: 'almonds', name: 'Almonds', category: 'Legumes, Nuts & Seeds', servingSize: 28, servingUnit: 'g (~23 nuts)', calories: 164, protein: 6, fat: 14, common: true, vi: 'hạnh nhân' },
  { id: 'peanut_butter', name: 'Peanut Butter', category: 'Legumes, Nuts & Seeds', servingSize: 2, servingUnit: 'tbsp', calories: 190, protein: 8, fat: 16, common: true, vi: 'bơ đậu phộng bơ lạc' },
  { id: 'walnuts', name: 'Walnuts', category: 'Legumes, Nuts & Seeds', servingSize: 28, servingUnit: 'g (~14 halves)', calories: 185, protein: 4.3, fat: 18.5, vi: 'quả óc chó hạt óc chó' },
  { id: 'tofu', name: 'Tofu, firm', category: 'Legumes, Nuts & Seeds', servingSize: 100, servingUnit: 'g', calories: 144, protein: 15.5, fat: 8.7, common: true, vi: 'đậu hũ đậu phụ' },

  // --- Fast Food & Snacks ---
  { id: 'pizza_slice', name: 'Pizza, cheese', category: 'Fast Food & Snacks', servingSize: 1, servingUnit: 'slice', calories: 285, protein: 12, fat: 10, common: true, vi: 'pizza bánh pizza' },
  { id: 'french_fries', name: 'French Fries', category: 'Fast Food & Snacks', servingSize: 100, servingUnit: 'g (medium)', calories: 312, protein: 3.4, fat: 15, common: true, vi: 'khoai tây chiên' },
  { id: 'cheeseburger', name: 'Cheeseburger', category: 'Fast Food & Snacks', servingSize: 1, servingUnit: 'burger', calories: 300, protein: 15, fat: 14, common: true, vi: 'bánh mì kẹp thịt hamburger' },
  { id: 'potato_chips', name: 'Potato Chips', category: 'Fast Food & Snacks', servingSize: 28, servingUnit: 'g (1 oz)', calories: 152, protein: 2, fat: 10, vi: 'snack khoai tây khoai tây chiên giòn' },
  { id: 'chocolate_bar', name: 'Chocolate Bar (milk)', category: 'Fast Food & Snacks', servingSize: 43, servingUnit: 'g (1 bar)', calories: 235, protein: 3.4, fat: 13, vi: 'sô cô la socola' },
  { id: 'protein_bar', name: 'Protein Bar', category: 'Fast Food & Snacks', servingSize: 1, servingUnit: 'bar', calories: 200, protein: 20, fat: 7, common: true, vi: 'thanh protein' },
  { id: 'ice_cream', name: 'Ice Cream, vanilla', category: 'Fast Food & Snacks', servingSize: 100, servingUnit: 'g (2 scoops)', calories: 207, protein: 3.5, fat: 11, vi: 'kem' },
  { id: 'popcorn', name: 'Popcorn, air-popped', category: 'Fast Food & Snacks', servingSize: 1, servingUnit: 'cup', calories: 31, protein: 1, fat: 0.4, vi: 'bắp rang bỏng ngô' },

  // --- Beverages ---
  { id: 'orange_juice', name: 'Orange Juice', category: 'Beverages', servingSize: 240, servingUnit: 'ml (1 cup)', calories: 110, protein: 1.7, fat: 0.5, vi: 'nước cam' },
  { id: 'protein_shake', name: 'Whey Protein Shake', category: 'Beverages', servingSize: 1, servingUnit: 'scoop', calories: 120, protein: 24, fat: 1.5, common: true, vi: 'sữa protein whey' },
  { id: 'black_coffee', name: 'Coffee, black', category: 'Beverages', servingSize: 240, servingUnit: 'ml (1 cup)', calories: 2, protein: 0.3, fat: 0, vi: 'cà phê đen cà phê' },
  { id: 'soda', name: 'Soda (cola)', category: 'Beverages', servingSize: 355, servingUnit: 'ml (12 oz can)', calories: 140, protein: 0, fat: 0, vi: 'nước ngọt coca cola' },
  { id: 'beer', name: 'Beer, regular', category: 'Beverages', servingSize: 355, servingUnit: 'ml (12 oz)', calories: 153, protein: 1.6, fat: 0, vi: 'bia' },
];

// Sort order used for lists: common items first, then alphabetical.
FOOD_DB.sort((a, b) => {
  if (!!a.common !== !!b.common) return a.common ? -1 : 1;
  return a.name.localeCompare(b.name);
});

const CATEGORIES = [...new Set(FOOD_DB.map(f => f.category))];

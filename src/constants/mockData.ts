import {
  BankType,
  ExpenseCategoryType,
  IncomeCategoryType,
  PaymentModeType,
} from "./types";

export const getExpenseCategoryItems = (): ExpenseCategoryType[] => {
  return [
    {
      id: "1",
      icon: require("@/assets/images/category/other.png"),
      name: "Others",
      color: "#1E90FF",
    },
    {
      id: "2",
      icon: require("@/assets/images/category/food.png"),
      name: "Food and Drinks",
      color: "#50C878",
    },
    {
      id: "3",
      icon: require("@/assets/images/category/travel.png"),
      name: "Travelling",
      color: "#FF8C00",
    },
    {
      id: "4",
      icon: require("@/assets/images/category/shopping.png"),
      name: "Shopping",
      color: "#D0417E",
    },
    {
      id: "5",
      icon: require("@/assets/images/category/bill.png"),
      name: "Bills & Utilities",
      color: "#D0417E",
    },
    {
      id: "6",
      icon: require("@/assets/images/category/entertainment.png"),
      name: "Entertainment",
      color: "#1E90FF",
    },
    {
      id: "7",
      icon: require("@/assets/images/category/health.png"),
      name: "Medicine & Supplements",
      color: "#50C878",
    },
    {
      id: "8",
      icon: require("@/assets/images/category/selfCare.png"),
      name: "Personal Care",
      color: "#FF8C00",
    },
    {
      id: "9",
      icon: require("@/assets/images/category/education.png"),
      name: "Education",
      color: "#FF8C00",
    },
    {
      id: "10",
      icon: require("@/assets/images/category/investment.png"),
      name: "Investment",
      color: "#D0417E",
    },
    {
      id: "11",
      icon: require("@/assets/images/category/insurance.png"),
      name: "Insurance",
      color: "#1E90FF",
    },
    {
      id: "12",
      icon: require("@/assets/images/category/lend.png"),
      name: "Lend Money",
      color: "#50C878",
    },
    {
      id: "13",
      icon: require("@/assets/images/category/pet.png"),
      name: "Pet Care",
      color: "#D0417E",
    },
    {
      id: "14",
      icon: require("@/assets/images/category/rent.png"),
      name: "Rent",
      color: "#50C878",
    },
    {
      id: "15",
      icon: require("@/assets/images/category/membership.png"),
      name: "Memberships",
      color: "#FF8C00",
    },
    {
      id: "16",
      icon: require("@/assets/images/category/fuel.png"),
      name: "Fuel & Gas",
      color: "#1E90FF",
    },
    {
      id: "17",
      icon: require("@/assets/images/category/grocery.png"),
      name: "Grocery",
      color: "#50C878",
    },
    {
      id: "18",
      icon: require("@/assets/images/category/gift.png"),
      name: "Gifts & Donations",
      color: "#FF8C00",
    },
    {
      id: "19",
      icon: require("@/assets/images/category/home.png"),
      name: "Home",
      color: "#1E90FF",
    },

    {
      id: "20",
      icon: require("@/assets/images/category/tax.png"),
      name: "Taxes",
      color: "#D0417E",
    },
  ];
};

export const getIncomeCategoryItems = (): IncomeCategoryType[] => {
  return [
    {
      id: "1",
      icon: require("@/assets/images/category/other.png"),
      name: "Others",
      color: "#1E90FF",
    },
    {
      id: "2",
      icon: require("@/assets/images/category/salary.png"),
      name: "Salary",
      color: "#FF8C00",
    },
    {
      id: "3",
      icon: require("@/assets/images/category/sold.png"),
      name: "Sold Items",
      color: "#D0417E",
    },
    {
      id: "4",
      icon: require("@/assets/images/category/freelance.png"),
      name: "Freelancing",
      color: "#50C878",
    },
  ];
};

export const getPaymentMode = (): PaymentModeType[] => {
  return [
    {
      id: "1",
      type: "cash",
      name: "Cash",
      balance: "1000",
    },
    {
      id: "2",
      type: "bank",
      name: "Bank of Baroda",
      balance: "2000",
    },
    {
      id: "3",
      type: "bank",
      name: "Axis Bank",
      balance: "-3000",
    },
    {
      id: "4",
      type: "bank",
      name: "HDFC Bank",
      balance: "-3000",
    },
  ];
};

export const getBanks = (): BankType[] => {
  return [
    {
      id: "1",
      category: "bank",
      name: "Bank of Baroda",
      balance: "1000",
    },
    {
      id: "2",
      category: "bank",
      name: "Axis Bank",
      balance: "2000",
    },
    {
      id: "3",
      category: "bank",
      name: "HDFC Bank",
      balance: "-3000",
    },
  ];
};

export const getCategoryById = (
  id?: string | number | null,
  type?: string,
): ExpenseCategoryType | IncomeCategoryType | undefined => {
  if (!id) return undefined;
  const strId = String(id);
  if (type === "Income") {
    const incomeMatch = getIncomeCategoryItems().find((c) => c.id === strId);
    if (incomeMatch) return incomeMatch;
    return getExpenseCategoryItems().find((c) => c.id === strId);
  }
  const expenseMatch = getExpenseCategoryItems().find((c) => c.id === strId);
  if (expenseMatch) return expenseMatch;
  return getIncomeCategoryItems().find((c) => c.id === strId);
};

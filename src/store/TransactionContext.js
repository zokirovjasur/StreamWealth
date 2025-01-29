"use client";
import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
} from "react";

const TransactionContext = createContext();

// Load initial state from localStorage or use default
const loadInitialState = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("financeTrackerState");
    if (saved) {
      return JSON.parse(saved);
    }
  }

  // Default initial state if nothing in localStorage
  return {
    transactions: [],
    categories: ["Food", "Transport", "Entertainment", "Bills", "Other"],
    settings: {
      currency: "USD",
      theme: "light",
    },
  };
};

function transactionReducer(state, action) {
  let newState;

  switch (action.type) {
    case "ADD_TRANSACTION":
      newState = {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
      break;

    case "DELETE_TRANSACTION":
      newState = {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
      break;

    case "UPDATE_TRANSACTION":
      newState = {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
      break;

    case "UPDATE_SETTINGS":
      newState = {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
      break;

    case "ADD_CATEGORY":
      newState = {
        ...state,
        categories: [...state.categories, action.payload],
      };
      break;

    case "DELETE_CATEGORY":
      newState = {
        ...state,
        categories: state.categories.filter((c) => c !== action.payload),
      };
      break;

    case "RESTORE_DATA":
      newState = action.payload;
      break;

    default:
      return state;
  }

  // Save to localStorage after each state change
  if (typeof window !== "undefined") {
    localStorage.setItem("financeTrackerState", JSON.stringify(newState));
  }

  return newState;
}

export function TransactionProvider({ children }) {
  const [state, dispatch] = useReducer(transactionReducer, loadInitialState());

  // Apply theme on initial load and when it changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.settings.theme);
  }, [state.settings.theme]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      // Memoized helper functions
      addTransaction: (transaction) => {
        dispatch({
          type: "ADD_TRANSACTION",
          payload: { ...transaction, id: Date.now() },
        });
      },
      deleteTransaction: (id) => {
        dispatch({
          type: "DELETE_TRANSACTION",
          payload: id,
        });
      },
      updateTransaction: (transaction) => {
        dispatch({
          type: "UPDATE_TRANSACTION",
          payload: transaction,
        });
      },
      updateSettings: (settings) => {
        dispatch({
          type: "UPDATE_SETTINGS",
          payload: settings,
        });
      },
      addCategory: (category) => {
        dispatch({
          type: "ADD_CATEGORY",
          payload: category,
        });
      },
      deleteCategory: (category) => {
        dispatch({
          type: "DELETE_CATEGORY",
          payload: category,
        });
      },
      restoreData: (data) => {
        dispatch({
          type: "RESTORE_DATA",
          payload: data,
        });
      },
    }),
    [state]
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
};

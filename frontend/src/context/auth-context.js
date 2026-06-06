import { createContext } from "react";

// Exporting the raw context separately keeps AuthProvider friendly to React Fast Refresh.
export const AuthContext = createContext(null);

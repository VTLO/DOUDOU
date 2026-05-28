import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Dashboard from "./views/Dashboard.tsx";
import Inventory from "./views/Inventory.tsx";
import Orders from "./views/Orders.tsx";
import Customers from "./views/Customers.tsx";
import Discounts from "./views/Discounts.tsx";
import ProductOptimizer from "./views/ProductOptimizer.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/discounts" element={<Discounts />} />
          <Route path="/optimizer" element={<ProductOptimizer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

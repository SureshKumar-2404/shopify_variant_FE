import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './components/Home/Home.jsx';
import Layout from './Layout.jsx';
import Product from './components/Product/Product.jsx';
import ProductOption from './components/Product/ProductOption.jsx';
import './index.css';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="product">
        <Route path="" element={<Product />} />
        <Route path="productOption/:productId" element={<ProductOption />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
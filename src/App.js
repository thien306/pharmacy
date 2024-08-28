import './App.css';
import React from 'react';
import ProductList from "./component/products/ProductList";
import ProductCreate from "./component/products/ProductCreate";
import ProductUpdate from "./component/products/ProductUpdate";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter, NavLink, Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
      <>
        <BrowserRouter>
          <div className="container mt-4">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <NavLink to="/product" className="nav-link">Danh sách</NavLink>
              <NavLink to="/create" className="nav-link">Thêm mới</NavLink>

            </nav>
            <Routes>
              <Route path="/create" element={<ProductCreate/>}/>
              <Route path="/product" element={<ProductList/>}/>
              <Route path="/update/:id" element={<ProductUpdate />} />

            </Routes>
          </div>
        </BrowserRouter>
        <ToastContainer/>

      </>
  )
}

export default App;

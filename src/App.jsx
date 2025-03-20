import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Deliveries from './Deliveries.jsx';
import Products from './Products.jsx';
import Suppliers from './Suppliers.jsx';
import SupplierProductPrices from './SupplierProductPrices.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <div className="container mt-4">
                <header className="mb-4">
                    <h1>Supply Manager</h1>
                    <nav>
                        <ul className="nav nav-pills">
                            <li className="nav-item">
                                <Link to="/deliveries" className="nav-link">Доставки</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/products" className="nav-link">Продукты</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/suppliers" className="nav-link">Поставщики</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/prices" className="nav-link">Цены поставщиков</Link>
                            </li>
                        </ul>
                    </nav>
                </header>
                <main>
                    <Routes>
                        <Route path="/deliveries" element={<Deliveries />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/suppliers" element={<Suppliers />} />
                        <Route path="/prices" element={<SupplierProductPrices />} />
                        <Route path="/" element={<h2>Добро пожаловать в Supply Manager</h2>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import api from "./api.js";

function SupplierProductPrices() {
    const [prices, setPrices] = useState([]);
    const [suppliersList, setSuppliersList] = useState([]);
    const [productsList, setProductsList] = useState([]);
    const [editingPrice, setEditingPrice] = useState(null);

    const [formData, setFormData] = useState({
        supplierId: '',
        productId: '',
        startDate: '',
        endDate: '',
        price: ''
    });

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchPrices();
        fetchSuppliersList();
        fetchProductsList();
    }, []);

    const fetchPrices = async () => {
        try {
            const response = await api.get('/api/v1/supplier-product-prices');
            setPrices(response.data);
        } catch (error) {
            console.error('Ошибка при получении цен:', error);
        }
    };

    const fetchSuppliersList = async () => {
        try {
            const response = await api.get('/api/v1/suppliers');
            setSuppliersList(response.data);
        } catch (error) {
            console.error('Ошибка при получении поставщиков:', error);
        }
    };

    const fetchProductsList = async () => {
        try {
            const response = await api.get('/api/v1/products');
            setProductsList(response.data);
        } catch (error) {
            console.error('Ошибка при получении продуктов:', error);
        }
    };

    const handleOpenAddModal = () => {
        setEditingPrice(null);
        setFormData({ supplierId: '', productId: '', startDate: '', endDate: '', price: '' });
        setShowModal(true);
    };

    const handleOpenEditModal = (item) => {
        setEditingPrice(item);
        setFormData({
            supplierId: item.supplierId,
            productId: item.productId,
            startDate: item.startDate,
            endDate: item.endDate,
            price: item.price
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPrice) {
                await api.put(`/api/v1/supplier-product-prices/${editingPrice.id}`, formData);
            } else {
                await api.post('/api/v1/supplier-product-prices', formData);
            }
            setFormData({ supplierId: '', productId: '', startDate: '', endDate: '', price: '' });
            setEditingPrice(null);
            handleCloseModal();
            fetchPrices();
        } catch (error) {
            console.error('Ошибка при добавлении/редактировании цены:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/v1/supplier-product-prices/${id}`);
            fetchPrices();
        } catch (error) {
            console.error('Ошибка при удалении цены:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Цены поставщиков</h2>
            <Button variant="success" className="mb-3" onClick={handleOpenAddModal}>
                Добавить цену
            </Button>

            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Поставщик</th>
                    <th>Продукт</th>
                    <th>Начало периода</th>
                    <th>Конец периода</th>
                    <th>Цена</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {prices.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.supplierName}</td>
                        <td>{item.productName}</td>
                        <td>{item.startDate}</td>
                        <td>{item.endDate}</td>
                        <td>{item.price}</td>
                        <td>
                            <Button
                                variant="primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleOpenEditModal(item)}
                            >
                                Редактировать
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                                Удалить
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Модальное окно */}
            <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingPrice ? 'Редактировать цену' : 'Добавить цену поставщика'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Поставщик:</label>
                            <select
                                className="form-select"
                                value={formData.supplierId}
                                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                            >
                                <option value="">Выберите поставщика</option>
                                {suppliersList.map((supplier) => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Продукт:</label>
                            <select
                                className="form-select"
                                value={formData.productId}
                                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                            >
                                <option value="">Выберите продукт</option>
                                {productsList.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Начало периода:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Конец периода:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Цена:</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {editingPrice ? 'Сохранить изменения' : 'Добавить цену'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default SupplierProductPrices;

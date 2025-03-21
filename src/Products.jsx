import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import api from "./api.js";

// Значения enum для единиц измерения
const units = ['KILOGRAM', 'LITER', 'PIECE'];

function Products() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        unitOfMeasurement: ''
    });

    // Управление модальным окном
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/api/v1/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Ошибка при получении продуктов:', error);
        }
    };

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setFormData({ name: '', description: '', unitOfMeasurement: '' });
        setShowModal(true);
    };

    const handleOpenEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            unitOfMeasurement: product.unitOfMeasurement
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                // Редактируем
                await api.put(`/api/v1/products/${editingProduct.id}`, formData);
            } else {
                // Добавляем
                await api.post('/api/v1/products', formData);
            }
            setFormData({ name: '', description: '', unitOfMeasurement: '' });
            setEditingProduct(null);
            handleCloseModal();
            fetchProducts();
        } catch (error) {
            console.error('Ошибка при добавлении/редактировании продукта:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/v1/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Ошибка при удалении продукта:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Продукты</h2>
            <Button variant="success" className="mb-3" onClick={handleOpenAddModal}>
                Добавить продукт
            </Button>

            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Описание</th>
                    <th>Единица измерения</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.unitOfMeasurement}</td>
                        <td>
                            <Button
                                variant="primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleOpenEditModal(product)}
                            >
                                Редактировать
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
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
                        {editingProduct ? 'Редактировать продукт' : 'Добавить продукт'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Название:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Описание:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Единица измерения:</label>
                            <select
                                className="form-select"
                                value={formData.unitOfMeasurement}
                                onChange={(e) => setFormData({ ...formData, unitOfMeasurement: e.target.value })}
                            >
                                <option value="">Выберите единицу измерения</option>
                                {units.map((unit) => (
                                    <option key={unit} value={unit}>
                                        {unit}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {editingProduct ? 'Сохранить изменения' : 'Добавить продукт'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Products;
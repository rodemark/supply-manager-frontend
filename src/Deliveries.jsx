import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import api from "./api.js";

function Deliveries() {
    const [deliveries, setDeliveries] = useState([]);
    const [suppliersList, setSuppliersList] = useState([]);
    const [productsList, setProductsList] = useState([]);

    // Данные для формы в модалке
    const [formData, setFormData] = useState({
        supplierId: '',
        date: '',
        deliveryItemList: []
    });

    // Элемент "DeliveryItem", который сейчас добавляется
    const [currentItem, setCurrentItem] = useState({ productId: '', quantity: '' });

    // Режим редактирования
    const [editingDelivery, setEditingDelivery] = useState(null);

    // Управление модальным окном
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchDeliveries();
        fetchSuppliersList();
        fetchProductsList();
    }, []);

    const fetchDeliveries = async () => {
        try {
            const response = await api.get('/api/v1/deliveries');
            setDeliveries(response.data);
        } catch (error) {
            console.error('Ошибка при получении доставок:', error);
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

    // Открыть модалку для добавления
    const handleOpenAddModal = () => {
        setEditingDelivery(null);
        setFormData({
            supplierId: '',
            date: '',
            deliveryItemList: []
        });
        setCurrentItem({ productId: '', quantity: '' });
        setShowModal(true);
    };

    // Открыть модалку для редактирования
    const handleOpenEditModal = (delivery) => {
        setEditingDelivery(delivery);
        setFormData({
            supplierId: delivery.supplierId,
            date: delivery.date,
            deliveryItemList: delivery.deliveryItemList || []
        });
        setCurrentItem({ productId: '', quantity: '' });
        setShowModal(true);
    };

    // Закрыть модалку
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDelivery) {
                // Редактируем существующую доставку
                await api.put(`/api/v1/deliveries/${editingDelivery.id}`, formData);
            } else {
                // Добавляем новую
                await api.post('/api/v1/deliveries', formData);
            }
            handleCloseModal();
            fetchDeliveries();
        } catch (error) {
            console.error('Ошибка при добавлении/редактировании доставки:', error);
        }
    };

    const handleDeleteDelivery = async (id) => {
        try {
            await api.delete(`/api/v1/deliveries/${id}`);
            fetchDeliveries();
        } catch (error) {
            console.error('Ошибка при удалении доставки:', error);
        }
    };

    // Добавить DeliveryItem к текущей доставке
    const addDeliveryItem = () => {
        if (currentItem.productId && currentItem.quantity) {
            setFormData({
                ...formData,
                deliveryItemList: [...formData.deliveryItemList, currentItem]
            });
            setCurrentItem({ productId: '', quantity: '' });
        }
    };

    // Удалить DeliveryItem
    const removeDeliveryItem = (index) => {
        const newList = formData.deliveryItemList.filter((item, i) => i !== index);
        setFormData({ ...formData, deliveryItemList: newList });
    };

    return (
        <div className="container mt-4">
            <h2>Доставки</h2>
            <Button variant="success" className="mb-3" onClick={handleOpenAddModal}>
                Добавить доставку
            </Button>

            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Поставщик</th>
                    <th>Дата</th>
                    <th>Общая стоимость</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {deliveries.map((delivery) => (
                    <tr key={delivery.id}>
                        <td>{delivery.id}</td>
                        <td>{delivery.supplierName}</td>
                        <td>{delivery.date}</td>
                        <td>{delivery.totalCost}</td>
                        <td>
                            <Button
                                variant="primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleOpenEditModal(delivery)}
                            >
                                Редактировать
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteDelivery(delivery.id)}
                            >
                                Удалить
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Модальное окно для добавления/редактирования */}
            <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingDelivery ? 'Редактировать доставку' : 'Добавить доставку'}
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
                            <label className="form-label">Дата:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>

                        <hr />
                        <h5>Элементы доставки</h5>
                        <div className="mb-3">
                            <label className="form-label">Продукт:</label>
                            <select
                                className="form-select"
                                value={currentItem.productId}
                                onChange={(e) => setCurrentItem({ ...currentItem, productId: e.target.value })}
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
                            <label className="form-label">Количество:</label>
                            <input
                                type="number"
                                className="form-control"
                                value={currentItem.quantity}
                                onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                            />
                        </div>
                        <Button variant="secondary" onClick={addDeliveryItem} className="mb-3">
                            Добавить элемент
                        </Button>

                        {formData.deliveryItemList.length > 0 && (
                            <ul className="list-group mb-3">
                                {formData.deliveryItemList.map((item, index) => (
                                    <li
                                        key={index}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        Продукт ID: {item.productId}, Название: {item.productName}, Количество: {item.quantity}
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => removeDeliveryItem(index)}
                                        >
                                            Удалить
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {editingDelivery ? 'Сохранить изменения' : 'Добавить доставку'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Deliveries;
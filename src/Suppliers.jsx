import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import api from "./api.js";

function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [editingSupplier, setEditingSupplier] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        contact: ''
    });

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await api.get('/api/v1/suppliers');
            setSuppliers(response.data);
        } catch (error) {
            console.error('Ошибка при получении поставщиков:', error);
        }
    };

    const handleOpenAddModal = () => {
        setEditingSupplier(null);
        setFormData({ name: '', contact: '' });
        setShowModal(true);
    };

    const handleOpenEditModal = (supplier) => {
        setEditingSupplier(supplier);
        setFormData({ name: supplier.name, contact: supplier.contact });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSupplier) {
                await api.patch(`/api/v1/suppliers/${editingSupplier.id}`, formData);
            } else {
                await api.post('/api/v1/suppliers', formData);
            }
            setFormData({ name: '', contact: '' });
            setEditingSupplier(null);
            handleCloseModal();
            fetchSuppliers();
        } catch (error) {
            console.error('Ошибка при добавлении/редактировании поставщика:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/v1/suppliers/${id}`);
            fetchSuppliers();
        } catch (error) {
            console.error('Ошибка при удалении поставщика:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Поставщики</h2>
            <Button variant="success" className="mb-3" onClick={handleOpenAddModal}>
                Добавить поставщика
            </Button>

            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Контакт</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {suppliers.map((supplier) => (
                    <tr key={supplier.id}>
                        <td>{supplier.id}</td>
                        <td>{supplier.name}</td>
                        <td>{supplier.contact}</td>
                        <td>
                            <Button
                                variant="primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleOpenEditModal(supplier)}
                            >
                                Редактировать
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(supplier.id)}>
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
                        {editingSupplier ? 'Редактировать поставщика' : 'Добавить поставщика'}
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
                            <label className="form-label">Контакт:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {editingSupplier ? 'Сохранить изменения' : 'Добавить поставщика'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Suppliers;

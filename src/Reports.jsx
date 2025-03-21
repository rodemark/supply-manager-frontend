import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import api from './api.js';

function Reports() {
    const [suppliersList, setSuppliersList] = useState([]);
    const [productsList, setProductsList] = useState([]);
    const [reportParams, setReportParams] = useState({
        supplierId: '',
        startDate: '',
        endDate: '',
        productId: ''
    });
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        fetchSuppliers();
        fetchProducts();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await api.get('/api/v1/suppliers');
            setSuppliersList(response.data);
        } catch (error) {
            console.error('Ошибка при получении поставщиков:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await api.get('/api/v1/products');
            setProductsList(response.data);
        } catch (error) {
            console.error('Ошибка при получении продуктов:', error);
        }
    };

    const handleGenerateReport = async (e) => {
        e.preventDefault();
        try {
            const params = {
                supplierId: reportParams.supplierId,
                startDate: reportParams.startDate,
                endDate: reportParams.endDate
            };
            // Если выбран продукт, добавляем параметр
            if (reportParams.productId) {
                params.productId = reportParams.productId;
            }
            const response = await api.get('/api/v1/reports', { params });
            setReportData(response.data);
        } catch (error) {
            console.error('Ошибка при формировании отчёта:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Отчёт по доставкам</h2>
            <form onSubmit={handleGenerateReport}>
                <div className="mb-3">
                    <label className="form-label">Поставщик:</label>
                    <select
                        className="form-select"
                        value={reportParams.supplierId}
                        onChange={(e) => setReportParams({ ...reportParams, supplierId: e.target.value })}
                        required
                    >
                        <option value="">Выберите поставщика</option>
                        {suppliersList.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Начало периода:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={reportParams.startDate}
                        onChange={(e) => setReportParams({ ...reportParams, startDate: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Конец периода:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={reportParams.endDate}
                        onChange={(e) => setReportParams({ ...reportParams, endDate: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Продукт (необязательно):</label>
                    <select
                        className="form-select"
                        value={reportParams.productId}
                        onChange={(e) => setReportParams({ ...reportParams, productId: e.target.value })}
                    >
                        <option value="">Все продукты</option>
                        {productsList.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                </div>
                <Button variant="primary" type="submit">
                    Сформировать отчёт
                </Button>
            </form>

            {reportData.length > 0 && (
                <div className="mt-4">
                    <h4>Результаты отчёта</h4>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Поставщик</th>
                            <th>Продукт</th>
                            <th>Единица измерения</th>
                            <th>Цена за единицу</th>
                            <th>Количество</th>
                            <th>Общая стоимость</th>
                            <th>Дата доставки</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reportData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.supplierName}</td>
                                <td>{item.productName}</td>
                                <td>{item.unitOfMeasurement}</td>
                                <td>{item.priceByUnit}</td>
                                <td>{item.quantity}</td>
                                <td>{item.totalCost}</td>
                                <td>{item.deliveryDate}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
}

export default Reports;

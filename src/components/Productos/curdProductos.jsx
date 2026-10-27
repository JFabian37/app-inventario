import { useState, useEffect } from "react";
// CORRECCIÓN: Agregamos un nivel más (../) para salir correctamente de la carpeta y añadimos la extensión .js
import api from "../../../services/api.js";


const CrudProductos = () => {
    const [productos, setProductos] = useState([]);
    const [form, setForm] = useState({
        id: null,
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
    });

    useEffect(() => {
        obtenerProductos();
    }, []);

    const obtenerProductos = async () => {
        try {
            // Asegúrate de tener configuradas las rutas GET, POST, PUT y DELETE en tu backend Express
            const response = await api.get("/productos");
            setProductos(response.data);
        } catch (error) {
            console.error("Error al obtener los productos:", error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.id) {
                await api.put(`/productos/${form.id}`, form);
            } else {
                await api.post("/productos", form);
            }
            setForm({ id: null, nombre: "", descripcion: "", precio: "", stock: "" });
            obtenerProductos();
        } catch (error) {
            console.error("Error al procesar el formulario:", error);
        }
    };

    const handleEdit = (producto) => {
        setForm(producto);
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
            try {
                await api.delete(`/productos/${id}`);
                obtenerProductos();
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Gestión de Productos</h2>
            
            <div className="row">
                {/* Formulario de Creación / Edición */}
                <div className="col-md-4">
                    <h4>{form.id ? "Editar Producto" : "Nuevo Producto"}</h4>
                    <form onSubmit={handleSubmit} className="card p-3 shadow-sm">
                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                className="form-control"
                                value={form.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Descripción</label>
                            <input
                                type="text"
                                name="descripcion"
                                className="form-control"
                                value={form.descripcion}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Precio (S/)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="precio"
                                className="form-control"
                                value={form.precio}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                className="form-control"
                                value={form.stock}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <button type="submit" className="btn btn-primary w-100">
                            {form.id ? "Actualizar" : "Guardar"}
                        </button>
                    </form>
                </div>

                {/* Tabla de Visualización de Productos */}
                <div className="col-md-8">
                    <h4>Lista de Productos</h4>
                    <table className="table table-striped table-hover shadow-sm">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((prod) => (
                                <tr key={prod.id}>
                                    <td>{prod.id}</td>
                                    <td>{prod.nombre}</td>
                                    <td>S/ {prod.precio}</td>
                                    <td>{prod.stock}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEdit(prod)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(prod.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CrudProductos;

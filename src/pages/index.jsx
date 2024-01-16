// pages/index.js
import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: '', descripcion: '' });
  const [imagenProducto, setImagenProducto] = useState(null);

  useEffect(() => {
    // Obtener la lista de productos al cargar la página
    obtenerListaProductos();
  }, []);

  const obtenerListaProductos = async () => {
    const response = await fetch('/api/products');
    const data = await response.json();
    setProductos(data);
  };

  const agregarProducto = async () => {
    const formData = new FormData();
    formData.append('nombre', nuevoProducto.nombre);
    formData.append('precio', nuevoProducto.precio);
    formData.append('descripcion', nuevoProducto.descripcion);
    formData.append('imagen', imagenProducto);

    const response = await fetch('/api/products', {
      method: 'POST',
      body: formData,
    });

    if (response.status === 201) {
      // Producto agregado exitosamente, actualizar la lista de productos
      obtenerListaProductos();
      // Limpiar el formulario
      setNuevoProducto({ nombre: '', precio: '', descripcion: '' });
      setImagenProducto(null);
    } else {
      // Manejar errores si es necesario
      console.error('Error al agregar el producto');
    }
  };

  const onDrop = (acceptedFiles) => {
    // Tomar solo la primera imagen en caso de que el usuario cargue múltiples archivos
    const file = acceptedFiles[0];
    setImagenProducto(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*', maxFiles: 1 });

  return (
    <div className='bg-blue-500'>
      <h1 className='bg-red-800 flex justify-center' > Tienda en Línea</h1>

      <div className='flex justify-center'>      <img className='w-44' src="https://img.freepik.com/vector-premium/plantilla-logotipo-degradado-tienda-tecnologia_269830-349.jpg" alt="" /></div>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} - ${producto.precio} - {producto.descripcion}
            {producto.imagen && (
              <img
                src={producto.imagen}
                alt={producto.nombre}
                style={{ maxWidth: '200px', marginTop: '10px' }}
              />
            )}
          </li>
        ))}
      </ul>
      <h2>Agregar Nuevo Producto</h2>

      <div className='flex justify-center'>

        <input
          className='border border-black m-3 p-3 rounded-xl'
          type="text"
          placeholder="Nombre"
          value={nuevoProducto.nombre}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
        />
        <input
          className='border border-black m-3 p-3 rounded-xl'
          type="text"
          placeholder="Precio"
          value={nuevoProducto.precio}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
        />
        <input
          className='border border-black m-3 p-3 rounded-xl'
          type="text"
          placeholder="Descripción"
          value={nuevoProducto.descripcion}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
        />
      </div>

      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        <p>Arrastra y suelta la imagen del producto aquí, o haz clic para seleccionar</p>
      </div>
      {imagenProducto && (
        <img src={URL.createObjectURL(imagenProducto)} alt="Producto" style={{ maxWidth: '200px', marginTop: '10px' }} />
      )}
      <button onClick={agregarProducto}>Agregar Producto</button>
    </div>
  );
}

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  marginTop: '10px',
};

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

function Product() {
    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Initialize useNavigate hook

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/shopify/api/v1/product/get');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const { data } = await response.json();
                setProductData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Function to handle click event and navigate to ProductOption component
    const handleClick = (productId) => {
        navigate(`/product/productOption/${productId}`);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Products</h1>
            {loading ? (
                <p>Loading...</p>
            ) : productData.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Image</th>
                            <th className="px-4 py-2">Title</th>
                            <th className="px-4 py-2">Product ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productData.map(product => (
                            <tr key={product.id} className="border-b">
                                <td className="px-4 py-2" onClick={() => handleClick(product.product_id)}>
                                    <img
                                        src={product.images}
                                        alt={product.title}
                                        className="w-24 h-auto"
                                    />
                                </td>
                                <td className="px-4 py-2" onClick={() => handleClick(product.product_id)}>
                                    {product.title}
                                </td>
                                <td className="px-4 py-2" onClick={() => handleClick(product.product_id)}>
                                    {product.product_id}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Product;

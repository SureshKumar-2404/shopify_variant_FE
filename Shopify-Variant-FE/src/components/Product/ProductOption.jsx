import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetails() {
    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editIndex, setEditIndex] = useState(null); // Track the index of the option being edited
    const [editedOption, setEditedOption] = useState({}); // Track the edited option's name and values
    const { productId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/shopify/api/v1/product/variant/info?product_id=${productId}`);
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
    }, [productId]);

    const handleEdit = (index) => {
        setEditIndex(index);
        const optionToEdit = productData[index].option;
        setEditedOption({ name: optionToEdit.option_value, values: productData[index].variants.map(variant => ({ id: variant.id, value: variant.option_value })) });
    };

    const handleSaveEdit = () => {
        // Here you would handle saving the edited option data, e.g., making a request to update the option
        // For this example, let's just log the edited option data
        console.log('Edited Option:', editedOption);
        setEditIndex(null); // Reset the edit index to exit edit mode
    };

    const handleRemoveVariant = (index) => {
        const updatedValues = [...editedOption.values];
        updatedValues.splice(index, 1);
        setEditedOption({ ...editedOption, values: updatedValues });
    };

    const handleRemoveOption = () => {
        // Here you would handle removing the option
        // For this example, let's just log a message
        console.log('Option removed:', editedOption.name);
        setEditIndex(null); // Reset the edit index to exit edit mode
    };

    return (
        <div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold">Product Variants</h2>
                    {productData.map((option, index) => (
                        <div key={option.id} className="mt-4 bg-white rounded-md p-4">
                            {editIndex === index ? (
                                <>
                                    <div className="flex items-center mb-2">
                                        <input
                                            type="text"
                                            value={editedOption.name}
                                            onChange={(e) => setEditedOption({ ...editedOption, name: e.target.value })}
                                            className="text-lg font-semibold px-3 py-2 border rounded-md"
                                        />
                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                                            onClick={handleRemoveOption}
                                        >
                                            Remove Option
                                        </button>
                                    </div>
                                    {editedOption.values.map((variant, variantIndex) => (
                                        <div key={variant.id} className="flex items-center mb-2">
                                            <input
                                                type="text"
                                                value={variant.value}
                                                onChange={(e) => {
                                                    const updatedValues = [...editedOption.values];
                                                    updatedValues[variantIndex].value = e.target.value;
                                                    setEditedOption({ ...editedOption, values: updatedValues });
                                                }}
                                                className="mr-2 px-3 py-1 border rounded-md"
                                            />
                                            <button
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                                onClick={() => handleRemoveVariant(variantIndex)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={handleSaveEdit}
                                    >
                                        Save
                                    </button>
                                </>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">
                                        {option.option.option_value.toUpperCase()}
                                    </h3>
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleEdit(index)}>Edit</button>
                                </div>
                            )}
                            <div className="flex flex-wrap mt-2">
                                {!editIndex && option.variants.map(variant => (
                                    <div key={variant.id} className="mr-2 mb-2 px-3 py-1 bg-gray-200 rounded-md text-sm">{variant.option_value}</div>
                                ))}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductDetails;

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
                            {/* Conditionally render variant values only when not in edit mode */}
                            {editIndex !== index && (
                                <div className="flex flex-wrap mt-2">
                                    {option.variants.map(variant => (
                                        <div key={variant.id} className="mr-2 mb-2 px-3 py-1 bg-gray-200 rounded-md text-sm">{variant.option_value}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ProductOption() {
    const { productId } = useParams(); // Use useParams hook to get URL parameters
    const [loading, setLoading] = useState(true);
    const [newOption, setNewOption] = useState({ name: '', values: [''] }); // Initialize with empty values
    const [productData, setProductData] = useState([]);
    const [optionId, setOptionId] = useState('');
    const [addingOption, setAddingOption] = useState(false); // Track whether the user is adding a new option
    const [options, setOptions] = useState([]); // Store options fetched from the API

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/shopify/api/v1/product/option/get?product_id=${productId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const { data } = await response.json();
                setOptions(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching options:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [productId]);

    useEffect(() => {
        if (productData.length > 0) {
            const lastOptionId = parseInt(productData[productData.length - 1].option_id);
            setOptionId(lastOptionId);
        }
    }, [productData]);

    const handleOptionNameChange = (value) => {
        setNewOption({ ...newOption, name: value });
    };

    const handleOptionValueChange = (value, index) => {
        const newValues = [...newOption.values];
        newValues[index] = value;
        setNewOption({ ...newOption, values: newValues });
    };

    const handleAddValue = () => {
        setNewOption({ ...newOption, values: [...newOption.values, ''] });
    };

    const handleRemoveValue = (index) => {
        const newValues = [...newOption.values];
        newValues.splice(index, 1);
        setNewOption({ ...newOption, values: newValues });
    };

    const handleRemoveOption = () => {
        setAddingOption(false); // Set addingOption back to false to show the "Add Option" button
        setNewOption({ name: '', values: [''] });
    };

    const handleAddOption = () => {
        setAddingOption(true);
    };

    const handleDone = async () => {
        if (newOption.name.trim() === '') {
            alert('Please enter an option name.');
            return;
        }
        if (newOption.values.every(value => value.trim() === '')) {
            alert('Please enter at least one option value.');
            return;
        }
    
        try {
            // Send request to add new option
            const response = await fetch('http://localhost:3000/shopify/api/v1/option/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    option_name: newOption.name,
                    option_value: JSON.stringify(newOption.values),
                    product_id: productId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to add option');
            }
    
    
            // Send request to add variants
            const variantResponse = await fetch('http://localhost:3000/shopify/api/v1/variant/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    option_id: `${optionId + 1}`,
                    option_value: newOption.values,
                }),
            });
            if (!variantResponse.ok) {
                throw new Error('Failed to add variants');
            }
            // Option and variants added successfully
    
            // Reset the state after adding an option
            setAddingOption(false);
            setNewOption({ name: '', values: [''] });
    
            // Refetch options after adding a new option
            const refetchResponse = await fetch(`http://localhost:3000/shopify/api/v1/product/option/get?product_id=${productId}`);
            if (!refetchResponse.ok) {
                throw new Error('Failed to fetch updated options');
            }
            const { data } = await refetchResponse.json();
            setOptions(data);
        } catch (error) {
            console.error('Error adding option and variants:', error);
        }
    };

    const isOptionReadyToAdd = newOption.name.trim() !== '' && newOption.values.length > 0;

    return (
        <div className="p-4">
            {!addingOption && (
                <button
                    type="button"
                    onClick={handleAddOption}
                    className="bg-blue-500 text-white px-3 py-2 rounded-md"
                >
                    Add Option
                </button>
            )}
            {addingOption && (
                <div>
                    <input
                        type="text"
                        value={newOption.name}
                        onChange={(e) => handleOptionNameChange(e.target.value)}
                        placeholder="Option Name"
                        className="mb-2 px-3 py-2 border rounded-md"
                    />
                    <button
                        type="button"
                        onClick={handleRemoveOption}
                        className="bg-red-500 text-white px-3 py-2 rounded-md ml-2"
                    >
                        Remove
                    </button>
                    <div className="ml-6">
                        {newOption.values.map((value, index) => (
                            <div key={index} className="flex mb-2">
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => handleOptionValueChange(e.target.value, index)}
                                    placeholder="Option Value"
                                    className="mr-2 px-3 py-2 border rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveValue(index)}
                                    className="bg-red-500 text-white px-3 py-2 rounded-md"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddValue}
                            className="bg-blue-500 text-white px-3 py-2 rounded-md"
                        >
                            + Add Value
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={handleDone}
                        disabled={!isOptionReadyToAdd}
                        className={`bg-green-500 text-white px-3 py-2 rounded-md mt-2 ${!isOptionReadyToAdd && 'cursor-not-allowed'}`}
                    >
                        Done
                    </button>
                </div>
            )}

            {/* Render dropdown with fetched options */}
            {!loading && (
                <div className="mt-4">
                    <label htmlFor="options" className="block text-sm font-medium text-gray-700">
                        Select Option
                    </label>
                    <select id="options" name="options" className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        {options.map(option => (
                            <option key={option.id} value={option.option_value}>{option.option_value}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}


function ProductPage() {
    return (
        <div>
            <ProductDetails />
            <ProductOption />
        </div>
    );
}

export default ProductPage;

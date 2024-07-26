// Services.js

import React, { useEffect, useState } from 'react';
import "./Services.scss";
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { productListState, cartState } from '../../store/index';
import Product from '../Products/Product';
import APIClient from '../../services/api-service'; // Adjust the path as per your project structure
import Spiner from '../../Spinner/Spinner';
const client = new APIClient('/packages'); // Specify the endpoint for packages

function Services() {
    const [productList, setProductList] = useRecoilState(productListState);
    const [cart, setCart] = useRecoilState(cartState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const addToCart = (product, quantity) => {
        const existingIndex = cart.findIndex(item => item.id === product.id);
        if (existingIndex !== -1) {
            const updatedCart = [...cart];
            updatedCart[existingIndex] = { ...updatedCart[existingIndex], quantity: updatedCart[existingIndex].quantity + quantity };
            setCart(updatedCart);
        } else {
            setCart([...cart, { ...product, quantity }]);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await client.get(); // Use the client to fetch data
                setProductList(response); // Assuming response.data is the array of products
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [setProductList]);

    if (loading) {
        return <div className="loader">
            <Spiner/>
        </div>






    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <section className="Services col-12">
            <div className='col-10 flex'>
                <h1 className='H1'>Our Latest Packages</h1>
                <div className='Line col-3'></div>
            </div>
            <div className="product-page col-12">
                <div className="products col-11">
                    {productList.map((product) => (
                        <Product key={product.id} product={product} onAddToCart={addToCart} />
                    ))}
                </div>
                <Link to="/cart2">cart</Link>
            </div>
        </section>
    );
}

export default Services;

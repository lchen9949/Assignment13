import React, { Component } from 'react'
import Filters from './Filters'
import ProductTable from './ProductTable'
import ProductForm from './ProductForm'

/*
let PRODUCTS = {
    '1': {id: 1, category: 'Music', price: '$459.99', name: 'Clarinet'},
    '2': {id: 2, category: 'Music', price: '$5,000', name: 'Cello'},
    '3': {id: 3, category: 'Music', price: '$3,500', name: 'Tuba'},
    '4': {id: 4, category: 'Furniture', price: '$799', name: 'Chaise Lounge'},
    '5': {id: 5, category: 'Furniture', price: '$1,300', name: 'Dining Table'},
    '6': {id: 6, category: 'Furniture', price: '$100', name: 'Bean Bag'}
};
*/

class Products extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filterText: '',
            products: {}
        }
        this.handleFilter = this.handleFilter.bind(this)
        this.handleDestroy = this.handleDestroy.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

    componentDidMount() {
        fetch('http://localhost:3000/products')
            .then(response => response.json())
            .then(data => {
                const products = {};
                console.log(data)
                data.forEach(product => {
                    //console.log(product.id)
                    //console.log(product.productId)
                    products[product.id] = product;
                });
                console.log(products)
                this.setState({ products });
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    handleFilter(filterInput) {
        this.setState(filterInput)
    }

    handleSave(product) {
        if (!product.id) {
            product.id = new Date().getTime()
        }
        console.log(product)
        fetch('http://localhost:3000/products', {
            method: 'POST',
            //mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product)
        })
            .then(response => response.json())
            .then(newProduct => {
                this.setState((prevState) => {
                    let products = prevState.products;
                    //products[newProduct.productid] = newProduct;
                    products[newProduct.id] = newProduct;
                    return { products };
                });
            })
            .catch(error => console.error('Error saving product:', error));
    }

    handleDestroy(productId) {
        fetch(`http://localhost:3000/products/${productId}`, {
            method: 'DELETE',
        })
            .then(() => {
                this.setState((prevState) => {
                    let products = prevState.products;
                    delete products[productId];
                    return { products };
                });
            })
            .catch(error => console.error('Error deleting product:', error));
    }

    render () {
        return (
            <div>
                <h1>My Inventory</h1>
                <Filters 
                    onFilter={this.handleFilter}></Filters>
                <ProductTable 
                    products={this.state.products}
                    filterText={this.state.filterText}
                    onDestroy={this.handleDestroy}></ProductTable>
                <ProductForm
                    onSave={this.handleSave}></ProductForm>
            </div>
        )
    }
}

export default Products
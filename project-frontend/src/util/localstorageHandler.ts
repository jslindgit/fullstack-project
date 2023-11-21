import { Item } from '../types/types';
import { Language } from '../types/languageTypes';
import { ShoppingCartStatus, ShoppingItem } from '../types/orderTypes';

import { defaultLanguage } from '../constants';

// Language:
const getLang = (): Language => {
    const lang = localStorage.getItem('language');
    if (lang) {
        return JSON.parse(lang);
    } else {
        setLang(defaultLanguage);
        return defaultLanguage;
    }
};

const setLang = (lang: Language) => {
    localStorage.setItem('language', JSON.stringify(lang));
};

// Previous location:
const getPreviousLocation = (): string => {
    const location = localStorage.getItem('previousLocation');
    return location ? location : '/';
};

const setPreviousLocation = (location: string): void => {
    localStorage.setItem('previousLocation', location);
};

// Shopping cart:
const addToShoppingCart = (item: Item, quantity: number) => {
    const cart = getShoppingCart();

    const existingIndex = cart.findIndex((existing) => existing.id === item.id);

    if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({ id: item.id, name: item.name, price: item.price, quantity: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
};

const clearShoppingCart = () => {
    localStorage.removeItem('cart');
};

const getShoppingCart = (): Array<ShoppingItem> => {
    const storedCartString = localStorage.getItem('cart');
    if (storedCartString) {
        const storedCart: Array<ShoppingItem> = JSON.parse(storedCartString);
        return storedCart;
    } else {
        return [];
    }
};

const getShoppingCartStatus = (): ShoppingCartStatus => {
    const cart = getShoppingCart();
    const items = cart.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = cart.reduce((total, item) => total + item.quantity * item.price, 0);

    return { items: items, totalAmount: totalAmount };
};

const removeItemFromShoppingCart = (index: number) => {
    const cart = getShoppingCart();
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
};

const updateShoppingCartItemQuantity = (index: number, newQuantity: number) => {
    const cart = getShoppingCart();
    cart[index].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Token:
const getToken = (): string | null => {
    const token = localStorage.getItem('token');

    return token && token.length > 0 ? token : null;
};

const removeToken = (): void => {
    localStorage.removeItem('token');
};

const setToken = (token: string): void => {
    localStorage.setItem('token', token);
};

export default {
    getLang,
    setLang,
    addToShoppingCart,
    clearShoppingCart,
    getShoppingCart,
    getShoppingCartStatus,
    removeItemFromShoppingCart,
    updateShoppingCartItemQuantity,
    getToken,
    removeToken,
    setToken,
    getPreviousLocation,
    setPreviousLocation,
};

import axios from "axios";

import { parseISO, format } from 'date-fns';
const URL_PRODUCT = "http://localhost:8081/products";

export const getAllProduct = async (searchProductName, classroomId) => {
    try {
        let query = "";

        if (searchProductName) {
            query += `?name_like=${searchProductName}`;
        }

        if (classroomId) {
            query += query ? `&classroom.id=${classroomId}` : `?classroom.id=${classroomId}`;
        }

        let res = await axios.get(URL_PRODUCT + query);
        return res.data;
    } catch (e) {
        console.log("Error in getAllProduct:", e);
        return [];
    }
};

export const saveProduct = async (product) => {
    try {
        await axios.post(URL_PRODUCT, product);
        return true;
    } catch (e) {
        return false;
    }
}

export const deleteProduct = async (id) => {
    try {
        await axios.delete(URL_PRODUCT + "/" + id);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export const findProductId = async (id) => {
    try {
        let res = await axios.get(URL_PRODUCT + "/" + id);
        return res.data;
    } catch (e) {
        console.log(e);
    }
}

export const updateProduct = async (id, product) => {
    try {
        await axios.put(URL_PRODUCT + "/" + id, product);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};
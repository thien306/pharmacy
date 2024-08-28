import axios from "axios";


export const getClassrooms = async () => {
    try {
        const res = await axios.get('http://localhost:8081/classrooms');
        return res.data;
    } catch (e) {
        console.error(e);
    }
}
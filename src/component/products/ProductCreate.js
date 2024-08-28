import {useEffect, useState} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import * as productService from "../../service/ProductService";
import * as classroomService from "../../service/ClassroomService";


function ProductCreate() {
    const [form, setForm] = useState({
        code: "",
        name: "",
        classroom: "",
        quantity: "",
        price: "",
        dateOfPurchase: new Date().toISOString().split('T')[0]
    });
    const MIN_2 = 2;
    const MIN_1 = 1;
    const MIN_0 = 0;
    console.log('form', form);

    const navigate = useNavigate();
    const [classrooms, setClassrooms] = useState([]);

    useEffect(() => {
        const getAllClassroom = async () => {
            const temp = await classroomService.getClassrooms();
            setClassrooms(temp);
        }
        getAllClassroom();
    }, [])

    const authenticate = {
        code: Yup.string().required("Mã đơn hàng không được để trống")
            .matches(/^PROD-\d{4}$/, "Mã đơn hàng phải có định dạng PROD-XXXX, trong đó XXXX là 4 chữ số"),
        name: Yup.string()
            .required("Tên sản phẩm không được để trống")
            .min(MIN_2, "Tên sản phẩm không được ngắn hơn 2 ký tự"),
        dateOfPurchase: Yup.date().required("Ngày mua không được để trống"),
        price: Yup.number()
            .required("Giá sản phẩm không được để trống")
            .min(MIN_0, "Giá sản phẩm phải lớn hơn hoặc bằng 0"),
        quantity: Yup.number()
            .required("Số lượng không được để trống")
            .min(MIN_1, "Số lượng phải lớn hơn 0"),
    };

    const saveProduct = async (value) => {
        const selectedClassroom = classrooms.find(item => item.id === parseInt(value.classroom));
        value.classroom = selectedClassroom;  // Gán đối tượng classroom đầy đủ vào sản phẩm

        let isSuccess = await productService.saveProduct(value);
        if (isSuccess) {
            toast.success("Thêm mới thành công");
            navigate("/product");
        } else {
            toast.error("Thêm mới thất bại");
        }
    }


    return (
        <div className="container mt-4">
            <h2>Thêm mới sản phẩm</h2>
            <Formik
                initialValues={form}
                onSubmit={saveProduct}
                validationSchema={Yup.object(authenticate)}
                validateOnChange={true}  // Kiểm tra khi có thay đổi
                validateOnBlur={true}    // Kiểm tra khi mất tiêu điểm
            >
                {({values, setFieldValue}) => (
                    <Form>
                        <div className="form-group">
                            <label htmlFor="code">Mã Sản Phẩm</label>
                            <Field name="code" className="form-control"/>
                            <ErrorMessage name="code" component="div" className="text-danger"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Tên Sản Phẩm</label>
                            <Field name="name" className="form-control"/>
                            <ErrorMessage name="name" component="div" className="text-danger"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="classroom">Thể Loại</label>
                            <Field as="select" name="classroom" className="form-control"
                                   value={values.classroom || ""}
                                   onChange={e => setFieldValue("classroom", e.target.value)}>
                                <option value="">Chọn lớp</option>
                                {classrooms.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="classroom" component="div" className="text-danger"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="quantity">Số Lượng</label>
                            <Field name="quantity" type="number" className="form-control"></Field>
                            <ErrorMessage name="quantity" component="div" className="text-danger"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">Giá Sản Phẩm</label>
                            <Field name="price" type="number" className="form-control"/>
                            <ErrorMessage name="price" component="div" className="text-danger"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="dateOfPurchase">Ngày nhập</label>
                            <Field name="dateOfPurchase" type="date" className="form-control"/>
                            <ErrorMessage name="dateOfPurchase" component="div" className="text-danger"/>
                        </div>


                        <button type="submit" className="btn btn-primary mt-3">Lưu</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default ProductCreate;
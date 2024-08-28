import * as ProductService from "../../service/ProductService";
import * as ClassroomService from "../../service/ClassroomService";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { toast } from "react-toastify";

function ProductUpdate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        code: "", name: "", classroom: { id: "", name: "" }, quantity: "", price: "", dateOfPurchase: new Date().toISOString().split('T')[0]
    });
    const [classrooms, setClassrooms] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                let res = await ProductService.findProductId(id);
                setProduct(res || {
                    code: "", name: "", classroom: { id: "", name: "" }, quantity: "", price: "", dateOfPurchase: new Date().toISOString().split('T')[0]
                });
            } catch (e) {
                console.log(e);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                let res = await ClassroomService.getClassrooms();
                setClassrooms(res || []);
            } catch (e) {
                console.log(e);
            }
        };
        fetchClassrooms();
    }, []);

    const authenticate = Yup.object().shape({
        code: Yup.string().required("Mã đơn hàng không được để trống")
            .matches(/^PROD-\d{4}$/, "Mã đơn hàng phải có định dạng PROD-XXXX, trong đó XXXX là 4 chữ số"),
        name: Yup.string()
            .required("Tên sản phẩm không được để trống")
            .min(2, "Tên sản phẩm không được ngắn hơn 2 ký tự"),
        dateOfPurchase: Yup.date().required("Ngày mua không được để trống"),
        price: Yup.number()
            .required("Giá sản phẩm không được để trống")
            .min(0, "Giá sản phẩm phải lớn hơn hoặc bằng 0"),
        quantity: Yup.number()
            .required("Số lượng không được để trống")
            .min(1, "Số lượng phải lớn hơn 0"),

    });

    const handleSubmit = async (values) => {
        try {
            const selectedClassroom = classrooms.find(item => item.id === parseInt(values.classroom));
            values.classroom = selectedClassroom
            let result = await ProductService.updateProduct(id, values);
            if (result) {
                toast.success("Cập nhật thành công");
                navigate("/product");
            } else {
                toast.error("Cập nhật thất bại");
            }
        } catch (e) {
            console.log("Error updating product:" + e);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Chỉnh sửa sản phẩm</h2>
            <Formik
                initialValues={product}
                enableReinitialize={true}
                validationSchema={authenticate}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, values }) => (
                    <Form>
                        <div className="form-group">
                            <label htmlFor="code">Mã Đơn Hàng</label>
                            <Field
                                type="text"
                                name="code"
                                className="form-control"
                            />
                            <ErrorMessage name="code" component="div" className="text-danger"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Tên Sản Phẩm</label>
                            <Field
                                type="text"
                                name="name"
                                className="form-control"
                            />
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
                            <Field
                                type="number"
                                name="quantity"
                                className="form-control"
                            />
                            <ErrorMessage name="quantity" component="div" className="text-danger"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">Giá Sản Phẩm</label>
                            <Field
                                type="number"
                                name="price"
                                className="form-control"
                            />
                            <ErrorMessage name="price" component="div" className="text-danger"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="dateOfPurchase">Ngày Nhập</label>
                            <Field
                                type="date"
                                name="dateOfPurchase"
                                className="form-control"
                            />
                            <ErrorMessage name="dateOfPurchase" component="div" className="text-danger"/>
                        </div>

                        <button type="submit" className="btn btn-primary">Lưu</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default ProductUpdate;

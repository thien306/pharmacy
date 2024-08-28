import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as productService from "../../service/ProductService";
import * as classroomService from "../../service/ClassroomService";
import { format } from 'date-fns';
import swal from "sweetalert2";

function ProductList() {
    const [product, setProduct] = useState([]);
    const [searchProductName, setSearchProductName] = useState("");
    const [classrooms, setClassrooms] = useState([]);
    const [selectedClassroomId, setSelectedClassroomId] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const res = await productService.getAllProduct(
                searchProductName, selectedClassroomId
            );

            res.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            setProduct(res);
        };
        fetchData();
    }, [searchProductName, selectedClassroomId]);

    useEffect(() => {
        const fetchClassrooms = async () => {
            const res = await classroomService.getClassrooms();
            setClassrooms(res);
        };
        fetchClassrooms();
    }, []);

    const handleDelete = async (id) => {
        const swalWithBootstrapButtons = swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: "Bạn có chắc không?",
            text: "Bạn sẽ không thể hoàn tác điều này!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Đúng rồi, xóa nó đi!",
            cancelButtonText: "Không, hủy đi!",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                let isDeleted = await productService.deleteProduct(id);
                if (isDeleted) {
                    swalWithBootstrapButtons.fire(
                        "Đã xóa!",
                        "Sản phẩm của bạn đã được xóa.",
                        "success"
                    );
                    setProduct(product.filter(product => product.id !== id));
                } else {
                    swalWithBootstrapButtons.fire(
                        "Lỗi",
                        "Xóa sản phẩm không thành công.",
                        "error"
                    );
                }
            } else if (result.dismiss === swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire(
                    "Đã hủy",
                    "Sản phẩm của bạn vẫn an toàn :)",
                    "error"
                );
            }
        });
    };

    return (
        <div className="container mt-4">
            <h2>Danh sách sản phẩm</h2>
            <Link to="/create" className="btn btn-success mb-3">Thêm mới</Link>

            <div className="mb-3">
                <label>Tìm kiếm sản phẩm</label>
                <input
                    type="text"
                    value={searchProductName}
                    onChange={(e) => setSearchProductName(e.target.value)}
                    className="form-control mt-2"
                    placeholder="Nhập tên sản phẩm..."
                />
            </div>

            <div className="mb-3">
                <label>Chọn thể loại</label>
                <select
                    className="form-control mt-2"
                    value={selectedClassroomId}
                    onChange={(e) => setSelectedClassroomId(e.target.value)}
                >
                    <option value="">Tất cả</option>
                    {classrooms.map(classroom => (
                        <option key={classroom.id} value={classroom.id}>
                            {classroom.name}
                        </option>
                    ))}
                </select>
            </div>

            <table className="table table-striped">
                <thead>
                <tr>
                    <th>STT</th>
                    <th>Mã Sản Phẩm</th>
                    <th>Tên Sản Phẩm</th>
                    <th>Thể Loại</th>
                    <th>Số Lượng</th>
                    <th>Giá</th>
                    <th>Ngày Nhập</th>
                    <th>Hành Động</th>
                </tr>
                </thead>
                <tbody>
                {product.map((item, index) => (
                    <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.classroom?.name || "Không có lớp"}</td> {/* Hiển thị tên lớp */}
                        <td>{item.quantity}</td>
                        <td>{item.price}</td>
                        <td>{format(new Date(item.dateOfPurchase), 'dd/MM/yyyy')}</td>

                        <td>
                            <Link to={`/update/${item.id}`} className="btn btn-warning btn-sm">Sửa</Link>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="btn btn-danger btn-sm ms-2"
                            >
                                Xóa
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductList;

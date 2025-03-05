import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllBills } from '../../../api/apiAdmin';
import Pagination from '../../../components/Pagination/Pagination';
import Loading from '../../../components/Loading/Loading';

import { Bill as ImportedBill } from '../../../models/Bill';

interface Bill extends ImportedBill {
  username?: string;
}

const BillManagement = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBills();
  }, [currentPage]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const data = await getAllBills();
      setBills(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
      setLoading(false);
    } catch (error) {
      toast.error('Không thể tải danh sách giao dịch');
      setLoading(false);
    }
  };

  // Get current page bills
  const indexOfLastBill = currentPage * itemsPerPage;
  const indexOfFirstBill = indexOfLastBill - itemsPerPage;
  const currentBills = bills.slice(indexOfFirstBill, indexOfLastBill);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  const getStatusClassName = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
        return 'status-success';
      case 'PENDING':
        return 'status-pending';
      case 'FAILED':
        return 'status-failed';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
        return 'Thành công';
      case 'PENDING':
        return 'Đang xử lý';
      case 'FAILED':
        return 'Thất bại';
      default:
        return status;
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-card">
      <div className="admin-card__header">
        <h2>Quản lý thanh toán</h2>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Người dùng</th>
            <th>Số tiền</th>
            <th>Mô tả</th>
            <th>Trạng thái</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {currentBills.map((bill) => (
            <tr key={bill.id}>
              <td>{bill.orderId}</td>
              <td>{bill.name || bill.userId}</td>
              <td>{bill.amount.toLocaleString('vi-VN')} VND</td>
              <td>{bill.description}</td>
              <td>
                <span className={getStatusClassName(bill.status)}>
                  {getStatusLabel(bill.status)}
                </span>
              </td>
              <td>{formatDate(bill.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPage={totalPages}
          handleSetPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default BillManagement;

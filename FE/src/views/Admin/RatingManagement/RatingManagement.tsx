import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { getListRating, deleteRating } from '../../../api/apiRating';
import Pagination from '../../../components/Pagination/Pagination';
import Modal from '../../../components/Modal/Modal';
import { ModalContent } from '../../../components/Modal/Modal';
import Loading from '../../../components/Loading/Loading';
import './RatingManagement.scss';
import { Rating } from '../../../models/Rating';

const RatingManagement = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isMounted = useRef(true);
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRatings();
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted.current = false;
    };
  }, [currentPage]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const data = await getListRating();
      
      // Process data to ensure we have string values for display
      const processedData = data.map((rating: Rating) => ({
        id: rating._id || '',
        userId: typeof rating.userId === 'string' ? rating.userId : '',
        username: typeof rating.username === 'string' ? rating.username : 
                 (rating.userId && typeof rating.userId === 'object' && 'username' in rating.userId ? (rating.userId as {username: string}).username : null) || 'Unknown User',
        novelId: typeof rating.novelId === 'string' ? rating.novelId : '',
        novelName: typeof rating.novelName === 'string' ? rating.novelName : 
                  (rating.novelId && typeof rating.novelId === 'object' && 'name' in rating.novelId ? (rating.novelId as {name: string}).name : null) || 'Unknown Novel',
        rating: typeof rating.rating === 'number' ? rating.rating : 0,
        content: typeof rating.content === 'string' ? rating.content : '',
        createdAt: rating.createdAt || new Date().toISOString()
      }));
      
      if (isMounted.current) {
        setRatings(processedData);
        setTotalPages(Math.ceil(processedData.length / itemsPerPage));
        setLoading(false);
      }
    } catch (error) {
      if (isMounted.current) {
        toast.error('Không thể tải danh sách đánh giá');
        setLoading(false);
      }
    }
  };

  const handleDeleteRating = async () => {
    if (!selectedRating) return;
    
    try {
      await deleteRating({id: selectedRating.id});
      toast.success('Đã xóa đánh giá');
      setShowDeleteModal(false);
      fetchRatings();
    } catch (error) {
      toast.error('Không thể xóa đánh giá');
    }
  };

  const openDeleteModal = (rating: Rating) => {
    setSelectedRating(rating);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedRating(null);
  };

  // Get current page ratings
  const indexOfLastRating = currentPage * itemsPerPage;
  const indexOfFirstRating = indexOfLastRating - itemsPerPage;
  const currentRatings = ratings.slice(indexOfFirstRating, indexOfLastRating);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  const renderStars = (score: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bx ${i <= score ? 'bxs-star' : 'bx-star'}`}
          style={{ color: i <= score ? '#f5a623' : '#ccc' }}
        ></i>
      );
    }
    return <div className="rating-stars">{stars}</div>;
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-card">
      <div className="admin-card__header">
        <h2>Quản lý đánh giá</h2>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Người dùng</th>
            <th>Truyện</th>
            <th>Điểm</th>
            <th>Nhận xét</th>
            <th>Thời gian</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentRatings.length > 0 ? (
            currentRatings.map((rating) => (
              <tr key={rating.id}>
                <td>{rating.id}</td>
                <td>{rating.username || (typeof rating.userId === 'object' ? rating.userId.username : rating.userId)}</td>
                <td>{rating.novelName || (typeof rating.novelId === 'object' ? rating.novelId.name : rating.novelId)}</td>
                <td>{renderStars(rating.rating)}</td>
                <td>{rating.content || '-'}</td>
                <td>{formatDate(rating.createdAt)}</td>
                <td className="action-buttons">
                  <button 
                    className="delete-btn"
                    onClick={() => openDeleteModal(rating)}
                  >
                    <i className="bx bx-trash"></i> Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{textAlign: 'center'}}>Không có đánh giá nào</td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPage={totalPages}
          handleSetPage={setCurrentPage}
        />
      )}

      {showDeleteModal && (
        <Modal active={showDeleteModal}>
          <ModalContent onClose={closeDeleteModal}>
            <div className="delete-confirmation">
              <h3>Xác nhận xóa</h3>
              <p>
                Bạn có chắc chắn muốn xóa đánh giá này?
                Hành động này không thể hoàn tác.
              </p>
              <div className="content-preview">
                <strong>Đánh giá:</strong> {renderStars(selectedRating?.rating || 0)}
                {selectedRating?.content && (
                  <div>
                    <strong>Nhận xét:</strong> {selectedRating.content}
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button className="btn cancel" onClick={closeDeleteModal}>
                  Hủy bỏ
                </button>
                <button className="btn delete" onClick={handleDeleteRating}>
                  Xóa
                </button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default RatingManagement;
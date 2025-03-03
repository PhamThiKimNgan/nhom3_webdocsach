import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAllComments, deleteComment } from "../../../api/apiComment";
import { getUserById } from "api/apiUser";
import { getNovelById } from "api/apiStory";
import Pagination from "../../../components/Pagination/Pagination";
import Modal from "../../../components/Modal/Modal";
import { ModalContent } from "../../../components/Modal/Modal";
import Loading from "../../../components/Loading/Loading";

import { Comment as CommentModel } from "../../../models/Comment";
import { Response } from "types/response";

interface Comment extends CommentModel {
  username?: string;
  novelName?: string;
}

const CommentManagement = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchComments();
  }, [currentPage]);

  interface Comment extends CommentModel {
    username?: string;
    novelName?: string;
  }

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response:Response = (await getAllComments());
      const {status, data} = response;
      const dataArr = data as Comment[];
      if (status == 200 &&  data) {
      const mapData = dataArr.map(async (comment) => {
        const { userId, novelId } = comment;
        if (userId) {
          const user = await getUserById(userId);
          const novel = await getNovelById(novelId);
          comment.username = user.username;
          comment.novelName = novel.name;
        }
        return comment
      });
        
      // Ensure data is an array
      const resolvedComments = await Promise.all(mapData);
      setComments(resolvedComments);
      }
     
      // console.log(data)
      setTotalPages(
        Math.ceil((Array.isArray(data) ? comments.length : 0) / itemsPerPage)
      );
      setLoading(false);
    } catch (error) {
      toast.error("Không thể tải danh sách bình luận");
      setComments([]); // Set empty array on error
      setTotalPages(1);
      setLoading(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!selectedComment) return;

    try {
      console.log(selectedComment._id)
      await deleteComment(selectedComment._id);
      toast.success("Đã xóa bình luận");
      setShowDeleteModal(false);
      fetchComments();
    } catch (error) {
      toast.error("Không thể xóa bình luận");
    }
  };

  const openDeleteModal = (comment: Comment) => {
    setSelectedComment(comment);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedComment(null);
  };

  // Get current page comments
  const indexOfLastComment = currentPage * itemsPerPage;
  const indexOfFirstComment = indexOfLastComment - itemsPerPage;
  const currentComments = Array.isArray(comments)
    ? comments.slice(indexOfFirstComment, indexOfLastComment)
    : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-card">
      <div className="admin-card__header">
        <h2>Quản lý bình luận</h2>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Người dùng</th>
            <th>Truyện</th>
            <th>Nội dung</th>
            <th>Thời gian</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentComments.map((comment) => (
            <tr key={comment._id}>
              <td>{comment._id}</td>
              <td>{comment.username || comment.userId}</td>
              <td>{comment.novelName || comment.novelId}</td>
              <td>{comment.content}</td>
              <td>{formatDate(comment.createdAt)}</td>
              <td className="action-buttons">
                <button
                  className="delete-btn"
                  onClick={() => openDeleteModal(comment)}
                >
                  <i className="bx bx-trash"></i> Xóa
                </button>
              </td>
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

      {showDeleteModal && (
        <Modal active={showDeleteModal}>
          <ModalContent onClose={closeDeleteModal}>
            <div className="delete-confirmation">
              <h3>Xác nhận xóa</h3>
              <p>
                Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể
                hoàn tác.
              </p>
              <div className="content-preview">
                <strong>Nội dung:</strong> {selectedComment?.content}
              </div>
              <div className="modal-actions">
                <button className="btn cancel" onClick={closeDeleteModal}>
                  Hủy bỏ
                </button>
                <button className="btn delete" onClick={handleDeleteComment}>
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

export default CommentManagement;

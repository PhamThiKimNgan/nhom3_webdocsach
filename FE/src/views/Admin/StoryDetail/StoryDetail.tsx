import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getNovelReviewById,
  getChaptersByNovelId,
  deleteNovelById,
} from "../../../api/apiStory";
import {
  getListCommentByNovelId,
  deleteComment,
} from "../../../api/apiComment";
import { getListRatingByNovelId, deleteRating } from "../../../api/apiRating";
import Modal from "../../../components/Modal/Modal";
import { ModalContent } from "../../../components/Modal/Modal";
import Loading from "../../../components/Loading/Loading";
import Pagination from "../../../components/Pagination/Pagination";
import { Chapter } from "../../../models/Chapter";
import { Comment } from "../../../models/Comment";
import { Story } from "../../../models/Story";
import { Rating } from "../../../models/Rating";


const StoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [novel, setNovel] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("chapters");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState<"comment" | "rating" | "story">(
    "comment"
  );

  const itemsPerPage = 10;

  useEffect(() => {
    if (id) {
      fetchNovelData();
    }
  }, [id]);

  useEffect(() => {
    // Reset pagination when changing tabs
    setCurrentPage(1);

    // Calculate total pages when tab changes
    if (activeTab === "chapters") {
      setTotalPages(Math.ceil(chapters.length / itemsPerPage));
    } else if (activeTab === "comments") {
      setTotalPages(Math.ceil(comments.length / itemsPerPage));
    } else if (activeTab === "ratings") {
      setTotalPages(Math.ceil(ratings.length / itemsPerPage));
    }
  }, [activeTab, chapters.length, comments.length, ratings.length]);

  const fetchNovelData = async () => {
    if (!id) return;

    try {
      setLoading(true);

      // Fetch novel data, chapters, comments, and ratings in parallel
      const [novelData, chaptersData, commentsData, ratingsData] =
        await Promise.all([
          getNovelReviewById(id),
          getChaptersByNovelId(id),
          getListCommentByNovelId(id),
          getListRatingByNovelId(id),
        ]);

      setNovel(novelData);
      setChapters(chaptersData);
      setComments(commentsData);
      setRatings(ratingsData);

      // Set initial total pages based on active tab
      if (activeTab === "chapters") {
        setTotalPages(Math.ceil(chaptersData.length / itemsPerPage));
      }

      setLoading(false);
    } catch (error) {
      toast.error("Không thể tải thông tin truyện");
      setLoading(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!selectedComment) return;

    try {
      await deleteComment(selectedComment.id);
      toast.success("Đã xóa bình luận");
      setShowDeleteModal(false);

      // Refresh comment list
      const updatedComments = comments.filter(
        (comment) => comment.id !== selectedComment.id
      );
      setComments(updatedComments);
      setTotalPages(Math.ceil(updatedComments.length / itemsPerPage));
    } catch (error) {
      toast.error("Không thể xóa bình luận");
    }
  };

  const handleDeleteRating = async () => {
    if (!selectedRating) return;

    try {
      await deleteRating({ id: selectedRating.id });
      toast.success("Đã xóa đánh giá");
      setShowDeleteModal(false);

      // Refresh rating list
      const updatedRatings = ratings.filter(
        (rating) => rating.id !== selectedRating.id
      );
      setRatings(updatedRatings);
      setTotalPages(Math.ceil(updatedRatings.length / itemsPerPage));

      // Update novel rating info if novel exists
      if (novel) {
        setNovel({
          ...novel,
          ratingCount: novel.ratingCount - 1,
          ratingAvg:
            updatedRatings.length > 0
              ? updatedRatings.reduce((acc, curr) => acc + curr.score, 0) /
                updatedRatings.length
              : 0,
        });
      }
    } catch (error) {
      toast.error("Không thể xóa đánh giá");
    }
  };

  const handleDeleteStory = async () => {
    if (!novel) return;

    try {
      await deleteNovelById(novel.id);
      toast.success(`Đã xóa truyện "${novel.name}"`);
      setShowDeleteModal(false);
      // Redirect back to story management
      window.location.href = "/admin/stories";
    } catch (error) {
      toast.error("Không thể xóa truyện");
    }
  };

  const openDeleteModal = (
    type: "comment" | "rating" | "story",
    item?: Comment | Rating
  ) => {
    setDeleteType(type);
    if (type === "comment" && item) {
      setSelectedComment(item as Comment);
    } else if (type === "rating" && item) {
      setSelectedRating(item as Rating);
    }
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedComment(null);
    setSelectedRating(null);
  };

  const handleDeleteAction = () => {
    if (deleteType === "comment") {
      handleDeleteComment();
    } else if (deleteType === "rating") {
      handleDeleteRating();
    } else if (deleteType === "story") {
      handleDeleteStory();
    }
  };

  const renderDeleteModalContent = () => {
    if (deleteType === "comment") {
      return (
        <div className="delete-confirmation">
          <h3>Xác nhận xóa bình luận</h3>
          <p>Bạn có chắc chắn muốn xóa bình luận này?</p>
          <div className="content-preview">
            <strong>Nội dung:</strong> {selectedComment?.content}
          </div>
        </div>
      );
    } else if (deleteType === "rating") {
      return (
        <div className="delete-confirmation">
          <h3>Xác nhận xóa đánh giá</h3>
          <p>Bạn có chắc chắn muốn xóa đánh giá này?</p>
          <div className="content-preview">
            <strong>Điểm:</strong> {renderStars(selectedRating?.score || 0)}
            {selectedRating?.comment && (
              <div>
                <strong>Nhận xét:</strong> {selectedRating.comment}
              </div>
            )}
          </div>
        </div>
      );
    } else if (deleteType === "story") {
      return (
        <div className="delete-confirmation">
          <h3>Xác nhận xóa truyện</h3>
          <p>
            Bạn có chắc chắn muốn xóa truyện <strong>"{novel?.name}"</strong>?
            <br />
            <span className="text-danger">
              Hành động này sẽ xóa tất cả các chương, bình luận và đánh giá liên
              quan. Không thể hoàn tác sau khi xóa.
            </span>
          </p>
        </div>
      );
    }
  };

  // Get current page items based on active tab
  const getCurrentPageItems = () => {
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;

    if (activeTab === "chapters") {
      return chapters.slice(indexOfFirst, indexOfLast);
    } else if (activeTab === "comments") {
      return comments.slice(indexOfFirst, indexOfLast);
    } else if (activeTab === "ratings") {
      return ratings.slice(indexOfFirst, indexOfLast);
    }

    return [];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  const renderStars = (score: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bx ${i <= score ? "bxs-star" : "bx-star"}`}
          style={{ color: i <= score ? "#f5a623" : "#ccc" }}
        ></i>
      );
    }
    return <div className="rating-stars">{stars}</div>;
  };

  if (loading) return <Loading />;
  if (!novel) return <div>Không tìm thấy truyện</div>;

  return (
    <div className="admin-story-detail">
      <div className="admin-card">
        <div className="admin-card__header">
          <h2>{novel.name}</h2>
          <div className="action-buttons">
            <Link to="/admin/stories" className="btn edit-btn">
              <i className="bx bx-arrow-back"></i> Quay lại
            </Link>
            <div className="story-detail-header__actions">
              <Link to={`/admin/stories/edit/${novel.id}`} className="btn-edit">
                <i className="bx bx-edit"></i> Chỉnh sửa truyện
              </Link>
              <button
                className="btn-delete"
                onClick={() => openDeleteModal("story")}
              >
                <i className="bx bx-trash"></i> Xóa truyện
              </button>
            </div>
          </div>
        </div>

        <div className="story-info">
          <div className="story-info__cover">
            {novel.coverImage ? (
              <img src={novel.coverImage} alt={novel.name} />
            ) : (
              <div className="placeholder-image">Không có ảnh bìa</div>
            )}
          </div>
          <div className="story-info__details">
            <div className="info-item">
              <span className="label">Tác giả:</span>
              <span>{novel.author}</span>
            </div>
            <div className="info-item">
              <span className="label">Thể loại:</span>
              <span>{novel.genres?.join(", ") || "Không có thể loại"}</span>
            </div>
            <div className="info-item">
              <span className="label">Trạng thái:</span>
              <span>{novel.status}</span>
            </div>
            <div className="info-item">
              <span className="label">Lượt xem:</span>
              <span>{novel.views}</span>
            </div>
            <div className="info-item">
              <span className="label">Đánh giá:</span>
              <span>
                {renderStars(novel.ratingAvg)} ({novel.ratingCount} đánh giá)
              </span>
            </div>
            <div className="info-item">
              <span className="label">Ngày tạo:</span>
              <span>{formatDate(novel.createdAt)}</span>
            </div>
            <div className="info-item">
              <span className="label">Cập nhật:</span>
              <span>{formatDate(novel.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="story-description">
          <h3>Tóm tắt</h3>
          <p>{novel.description}</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === "chapters" ? "active" : ""}`}
            onClick={() => setActiveTab("chapters")}
          >
            Danh sách chương ({chapters.length})
          </button>
          <button
            className={`admin-tab ${activeTab === "comments" ? "active" : ""}`}
            onClick={() => setActiveTab("comments")}
          >
            Bình luận ({comments.length})
          </button>
          <button
            className={`admin-tab ${activeTab === "ratings" ? "active" : ""}`}
            onClick={() => setActiveTab("ratings")}
          >
            Đánh giá ({ratings.length})
          </button>
        </div>

        <div className="admin-tab-content">
          {activeTab === "chapters" && (
            <>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Số chương</th>
                    <th>Tiêu đề</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPageItems().map((chapter: any) => (
                    <tr key={chapter.id}>
                      <td>Chương {chapter.chapterNumber}</td>
                      <td>{chapter.title}</td>
                      <td>{formatDate(chapter.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {chapters.length === 0 && (
                <div className="empty-message">Chưa có chương nào</div>
              )}
            </>
          )}

          {activeTab === "comments" && (
            <>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Nội dung</th>
                    <th>Thời gian</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPageItems().map((comment: any) => (
                    <tr key={comment.id}>
                      <td>{comment.username || comment.userId}</td>
                      <td>{comment.content}</td>
                      <td>{formatDate(comment.createdAt)}</td>
                      <td className="action-buttons">
                        <button
                          className="delete-btn"
                          onClick={() => openDeleteModal("comment", comment)}
                        >
                          <i className="bx bx-trash"></i> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {comments.length === 0 && (
                <div className="empty-message">Chưa có bình luận nào</div>
              )}
            </>
          )}

          {activeTab === "ratings" && (
            <>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Điểm</th>
                    <th>Nhận xét</th>
                    <th>Thời gian</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPageItems().map((rating: any) => (
                    <tr key={rating.id}>
                      <td>{rating.username || rating.userId}</td>
                      <td>{renderStars(rating.score)}</td>
                      <td>{rating.comment || "-"}</td>
                      <td>{formatDate(rating.createdAt)}</td>
                      <td className="action-buttons">
                        <button
                          className="delete-btn"
                          onClick={() => openDeleteModal("rating", rating)}
                        >
                          <i className="bx bx-trash"></i> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {ratings.length === 0 && (
                <div className="empty-message">Chưa có đánh giá nào</div>
              )}
            </>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPage={totalPages}
              handleSetPage={setCurrentPage}
            />
          )}
        </div>
      </div>

      {showDeleteModal && (
        <Modal active={showDeleteModal}>
          <ModalContent onClose={closeDeleteModal}>
            {renderDeleteModalContent()}
            <div className="modal-actions">
              <button className="btn cancel" onClick={closeDeleteModal}>
                Hủy bỏ
              </button>
              <button className="btn delete" onClick={handleDeleteAction}>
                Xóa
              </button>
            </div>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default StoryDetail;

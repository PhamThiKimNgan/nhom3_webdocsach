import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getNovels, deleteNovelByUrl } from "../../../api/apiStory";
import Pagination from "../../../components/Pagination/Pagination";
import Modal from "../../../components/Modal/Modal";
import { ModalContent } from "../../../components/Modal/Modal";
import Loading from "../../../components/Loading/Loading";
import "./StoryManagement.scss";
import { Story } from "../../../models/Story";

const StoryManagement = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchStories();
  }, [currentPage]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const data = await getNovels({});
      setStories(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
      setLoading(false);
    } catch (error) {
      toast.error("Không thể tải danh sách truyện");
      setLoading(false);
    }
  };

  const handleDeleteStory = async () => {
    if (!selectedStory) return;

    try {
      await deleteNovelByUrl(selectedStory.url);
      toast.success(`Đã xóa truyện ${selectedStory.name}`);
      setShowDeleteModal(false);
      fetchStories();
    } catch (error) {
      toast.error("Không thể xóa truyện");
    }
  };

  const openDeleteModal = (story: Story) => {
    setSelectedStory(story);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedStory(null);
  };

  // Get current page stories
  const indexOfLastStory = currentPage * itemsPerPage;
  const indexOfFirstStory = indexOfLastStory - itemsPerPage;
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory);

  if (loading) return <Loading />;

  return (
    <div className="admin-card">
      <div className="admin-card__header">
        <h2>Quản lý truyện</h2>
        <div className="actions">
          <Link to="/admin/stories/create" className="add-story-btn">
            <i className="bx bx-plus"></i> Thêm truyện mới
          </Link>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Ảnh bìa</th>
            <th>Tên truyện</th>
            <th>Tác giả</th>
            <th>Lượt xem</th>
            <th>Trạng thái</th>
            <th>Ngày đăng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentStories.map((story) => (
            <tr key={story.id} >
              <td>
                {story.coverImage ? (
                  <img
                    src={story.coverImage}
                    alt={story.name}
                    style={{
                      width: "50px",
                      height: "70px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src={story.image}
                    alt={story.name}
                    style={{
                      width: "50px",
                      height: "70px",
                      backgroundColor: "#eee",
                      objectFit: "cover",
                    }}
                  ></img>
                )}
              </td>
              <td>{story.name}</td>
              <td>{story.author}</td>
              <td>{story.reads}</td>
              <td>{story.state}</td>
              <td>{new Date(story.createdAt).toLocaleDateString("vi-VN")}</td>
              <td className="action-buttons">
                <Link to={`/truyen/${story.url}`} className="view-btn">
                  <i className="bx bx-show"></i> Xem
                </Link>
                <div className="story-actions">
                  <Link
                    to={`/admin/stories/edit/${story._id}`}
                    className="btn-edit view-btn"
                  >
                    <i className="bx bx-edit"></i>
                  </Link>
                  <button
                    className="btn-delete delete-btn"
                    onClick={() => openDeleteModal(story)}
                  >
                    <i className="bx bx-trash"></i>
                  </button>
                </div>
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
                Bạn có chắc chắn muốn xóa truyện{" "}
                <strong>{selectedStory?.name}</strong>? Hành động này không thể
                hoàn tác.
              </p>
              <div className="modal-actions">
                <button className="btn cancel" onClick={closeDeleteModal}>
                  Hủy bỏ
                </button>
                <button className="btn delete" onClick={handleDeleteStory}>
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

export default StoryManagement;

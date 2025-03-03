import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminStoryForm from "../AdminCreateStory/AdminStoryForm";
import AdminChaptersForm from "../AdminCreateStory/AdminChaptersForm";
import {
  getNovelById,
  updateStory,
  getChaptersByNovelId,
  updateStoryWithChapters,
} from "api/apiStory";
import { updateChapter } from "api/apiChapter";
import Loading from "components/Loading/Loading";
import "./AdminEditStory.scss";
import { Story } from "models/Story";
import { Chapter } from "models/Chapter";

const AdminEditStory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState<Story>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStoryData = async () => {
      if (!id) {
        toast.error("ID truyện không hợp lệ");
        navigate("/admin/stories");
        return;
      }

      try {
        const storyData = await getNovelById(id);
        setStory(storyData);

        const chaptersData = await getChaptersByNovelId(id);
        setChapters(chaptersData);

        setLoading(false);
      } catch (error) {
        toast.error("Không thể tải dữ liệu truyện");
        navigate("/admin/stories");
      }
    };

    fetchStoryData();
  }, [id, navigate]);

  const handleStoryChange = (updatedStory: Partial<Story>) => {
    setStory(updatedStory as Story);
  };

  const handleChaptersChange = (updatedChapters: Partial<Chapter>[]) => {
    setChapters(updatedChapters as Chapter[]);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (story) {
        // Update story and all chapters in a single request
        await updateStoryWithChapters({
          story: story,
          chapters: chapters.filter((chapter) => chapter._id),
        });

        toast.success("Cập nhật truyện thành công!");
        navigate("/admin/stories");
      } else {
        toast.error("Không có dữ liệu truyện để cập nhật");
      }
    } catch (error) {
      console.error("Error updating story:", error);
      toast.error("Có lỗi xảy ra khi cập nhật truyện");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-edit-story">
      <div className="admin-edit-story__header">
        <h1>Chỉnh sửa truyện</h1>
        <p>Chỉnh sửa thông tin và nội dung truyện</p>
      </div>

      <div className="admin-edit-story__section">
        <AdminStoryForm story={story || {}} onChange={handleStoryChange} />
      </div>

      <div className="admin-edit-story__section">
        <AdminChaptersForm
          chapters={chapters}
          onChange={handleChaptersChange}
        />
      </div>

      <div className="admin-edit-story__actions">
        <button
          className="admin-edit-story__cancel-btn"
          onClick={() => navigate("/admin/stories")}
        >
          Hủy bỏ
        </button>
        <button
          className="admin-edit-story__submit-btn"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <i className="bx bx-save"></i>
          {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
};

export default AdminEditStory;

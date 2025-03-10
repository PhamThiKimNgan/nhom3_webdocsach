import React from "react";
import { Story } from "models/Story";
import "./AdminStoryForm.scss";

interface AdminStoryFormProps {
  story: Partial<Story>;
  onChange: (story: Partial<Story>) => void;
}

const AdminStoryForm: React.FC<AdminStoryFormProps> = ({ story, onChange }) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    onChange({
      ...story,
      [e.target.name]: e.target.value,
    });
  };

  const categories = [
    "Hành động",
    "Phiêu lưu",
    "Kỳ ảo",
    "Lãng mạn",
    "Khoa học viễn tưởng",
    "Kinh dị",
    "Hài hước",
    "Drama",
    "Tiên Hiệp",
    "Kiếm Hiệp",
  ];

  const statuses = ["Đang ra", "Hoàn thành", "Tạm ngưng"];

  return (
    <div className="admin-story-form">
      <h2 className="admin-story-form__title">Thông tin truyện</h2>

      <div className="admin-story-form__grid">
        <div className="admin-story-form__field">
          <label className="admin-story-form__label" htmlFor="name">
            Tên truyện
          </label>
          <input
            id="name"
            name="name"
            className="admin-story-form__input"
            value={story.name || ""}
            onChange={handleChange}
            placeholder="Nhập tên truyện"
          />
        </div>

        <div className="admin-story-form__field">
          <label className="admin-story-form__label" htmlFor="author">
            Tác giả
          </label>
          <input
            id="author"
            name="author"
            className="admin-story-form__input"
            value={story.author || ""}
            onChange={handleChange}
            placeholder="Nhập tên tác giả"
          />
        </div>

        <div className="admin-story-form__field">
          <label className="admin-story-form__label" htmlFor="category">
            Thể loại
          </label>
          <select
            id="type"
            name="type"
            className="admin-story-form__select"
            value={story.type || console.log(story)}
            onChange={handleChange}
          >
            <option value="">-- Chọn thể loại --</option>
            {categories.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-story-form__field">
          <label className="admin-story-form__label" htmlFor="status">
            Trạng thái
          </label>
          <select
            id="state"
            name="state"
            className="admin-story-form__select"
            value={story.state || ""}
            onChange={handleChange}
          >
            <option value="">-- Chọn trạng thái --</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-story-form__field">
          <label className="admin-story-form__label" htmlFor="coverImage">
            Ảnh bìa URL
          </label>
          <input
            id="image"
            name="image"
            className="admin-story-form__input"
            value={story.image || ""}
            onChange={handleChange}
            placeholder="Nhập URL ảnh bìa"
          />
        </div>

        <div className="admin-story-form__field">
          <label className="admin-story-form__label" htmlFor="url">
            URL truyện
          </label>
          <input
            id="url"
            name="url"
            className="admin-story-form__input"
            value={story.url || ""}
            onChange={handleChange}
            placeholder="Nhập URL truyện (không bắt buộc)"
          />
          <p className="admin-story-form__helper-text">
            URL sẽ được tạo tự động nếu để trống
          </p>
        </div>
      </div>

      <div className="admin-story-form__field">
        <label className="admin-story-form__label" htmlFor="description">
          Mô tả
        </label>
        <textarea
          id="description"
          name="description"
          className="admin-story-form__textarea"
          value={story.description || ""}
          onChange={handleChange}
          placeholder="Nhập mô tả truyện"
        ></textarea>
      </div>
    </div>
  );
};

export default AdminStoryForm;

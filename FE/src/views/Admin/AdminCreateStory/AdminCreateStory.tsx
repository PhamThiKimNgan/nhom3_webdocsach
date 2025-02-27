import React, { useState } from "react";
import { Story } from "models/Story";
import { Chapter } from "models/Chapter";
import { createStoryWithChapters } from "api/apiStory";
import { useNavigate } from "react-router-dom";
import AdminStoryForm from "./AdminStoryForm";
import AdminChaptersForm from "./AdminChaptersForm";
import "./AdminCreateStory.scss";

const AdminCreateStory: React.FC = () => {
  const [story, setStory] = useState<Partial<Story>>({
    name: "",
    author: "",
    description: "",
    image: "",
    url: "",
  });
  const [chapters, setChapters] = useState<Partial<Chapter>[]>([
    { name: "Chapter 1", chapternumber: 1, content: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const navigate = useNavigate();

  // New state for bulk upload
  const [selectedStory, setSelectedStory] = useState("");
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [availableStories, setAvailableStories] = useState<
    { id: string; name: string }[]
  >([
    { id: "1", name: "Truyện 1" },
    { id: "2", name: "Truyện 2" },
  ]);

  const handleStoryChange = (updatedStory: Partial<Story>) => {
    console.log(updatedStory)
    setStory(updatedStory);
  };

  const handleChaptersChange = (updatedChapters: Partial<Chapter>[]) => {
    console.log(updatedChapters)
    setChapters(updatedChapters);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Generate a URL slug if not provided
      if (!story.url) {
        story.url =
          story.name
            ?.toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "") || "";
      }

      await createStoryWithChapters({
        story,
        chapters,
      });

      setNotification({
        open: true,
        message: "Story with chapters created successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/admin/stories");
      }, 2000);
    } catch (error) {
      console.error("Error creating story:", error);
      setNotification({
        open: true,
        message: "Failed to create story",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // New function for bulk upload
  const handleBulkUpload = async () => {
    if (!selectedStory || !zipFile) {
      setNotification({
        open: true,
        message: "Please select a story and upload a ZIP file",
        severity: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Here you would implement the logic to:
      // 1. Upload the ZIP file to the server
      // 2. Process the ZIP file on the server to extract chapters
      // 3. Add chapters to the selected story

      // This is a placeholder for the actual implementation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setNotification({
        open: true,
        message: "Chapters uploaded successfully!",
        severity: "success",
      });

      // Reset form
      setZipFile(null);
      setSelectedStory("");
    } catch (error) {
      console.error("Error uploading chapters:", error);
      setNotification({
        open: true,
        message: "Failed to upload chapters",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setZipFile(event.target.files[0]);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <div className="admin-create-story__container">
      <h1 className="admin-create-story__title">Create New Story</h1>

      <div className="admin-create-story__section">
        <AdminStoryForm story={story} onChange={handleStoryChange} />
      </div>

      <div className="admin-create-story__section">
        <AdminChaptersForm
          chapters={chapters}
          onChange={handleChaptersChange}
        />
      </div>

      <div className="admin-create-story__actions">
        <button
          className="admin-create-story__submit-btn"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <i className="bx bx-check"></i>
          {isSubmitting ? "Submitting..." : "Publish Story"}
        </button>
      </div>

      {/* Bulk Upload Tool - Added from Dashboard */}
      <div className="admin-create-story__section">
        <h2 className="bulk-upload__title">
          Công cụ đăng nhiều tập truyện cùng lúc
        </h2>
        <div className="admin-create-story__divider"></div>

        <div className="bulk-upload__form-group">
          <label className="bulk-upload__label" htmlFor="story-select">
            Chọn truyện
          </label>
          <select
            id="story-select"
            className="bulk-upload__select"
            value={selectedStory}
            onChange={(e) => setSelectedStory(e.target.value)}
          >
            <option value="">-- Chọn truyện --</option>
            {availableStories.map((story) => (
              <option key={story.id} value={story.id}>
                {story.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bulk-upload__form-group">
          <label className="bulk-upload__label">
            Tải lên file ZIP chứa các chương
          </label>
          <input
            type="file"
            accept=".zip"
            className="bulk-upload__file-input"
            onChange={handleFileChange}
          />
          <p>
            Định dạng: Mỗi file .txt là một chương, tên file là số thứ tự chương
          </p>
        </div>

        <button
          className="bulk-upload__button"
          onClick={handleBulkUpload}
          disabled={isSubmitting || !selectedStory || !zipFile}
        >
          {isSubmitting ? "Đang tải lên..." : "Tải lên các chương"}
        </button>
      </div>

      {notification.open && (
        <div className={`notification notification--${notification.severity}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default AdminCreateStory;

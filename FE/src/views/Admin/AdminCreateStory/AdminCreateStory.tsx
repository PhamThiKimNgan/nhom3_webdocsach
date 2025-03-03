import React, { useState } from "react";
import { Story } from "models/Story";
import { Chapter } from "models/Chapter";
import { createStoryWithChapters } from "api/apiStory";
import { useNavigate } from "react-router-dom";
import AdminStoryForm from "./AdminStoryForm";
import AdminChaptersForm from "./AdminChaptersForm";
import "./AdminCreateStory.scss";
import { Response } from "types/response";

const AdminCreateStory: React.FC = () => {
  const [story, setStory] = useState<Partial<Story>>({
    name: "",
    author: "",
    description: "",
    image: "",
    url: "",
    state:"",
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
        // Convert Vietnamese characters to non-diacritic form
        const removeVietnameseTones = (str: string) => {
          str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
          str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
          str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
          str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
          str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
          str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
          str = str.replace(/đ/g, "d");
          str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
          str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
          str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
          str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
          str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
          str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
          str = str.replace(/Đ/g, "D");
          return str;
        }
        
        story.url =
          removeVietnameseTones(story.name || "")
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "") || "";
      }

      const response:Response = await createStoryWithChapters({
        story,
        chapters,
      });

      if (response.status !== 200) {
        setNotification({
          open: true,
          message: response.details && typeof response.details === 'object' ? 
            (response.details as {message?: string})?.message || "Failed to create story" : 
            "Failed to create story",
          severity: "error",
        });
        return;
      }

      // Make sure details exists and has a message property
      const successMessage = typeof response.details === 'object' && response.details 
        ? (response.details as any).message || 'Story created successfully'
        : 'Story created successfully';

      setNotification({
        open: true,
        message: successMessage,
        severity: "success",
      });

      setTimeout(() => {
        navigate('/admin/stories');
      }, 2000);
      
    } catch (error: unknown) {
      console.error("Error creating story:", error);
      setNotification({
        open: true,
        message:  "Failed to create story",
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

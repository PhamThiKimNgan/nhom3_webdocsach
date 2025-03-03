import React, { useState } from "react";
import { Chapter } from "models/Chapter";
import "./AdminChaptersForm.scss";

interface AdminChaptersFormProps {
  chapters: Partial<Chapter>[];
  onChange: (chapters: Partial<Chapter>[]) => void;
}

const AdminChaptersForm: React.FC<AdminChaptersFormProps> = ({
  chapters,
  onChange,
}) => {
  const [expandedChapter, setExpandedChapter] = useState<number | null>(0);

  const handleAddChapter = () => {
    const newChapterNumber = chapters.length + 1;
    const newChapter = {
      name: `Chapter ${newChapterNumber}`,
      chapternumber: newChapterNumber,
      content: "",
    };

    const newChapters = [...chapters, newChapter];
    onChange(newChapters);
    setExpandedChapter(newChapters.length - 1);
  };

  const handleRemoveChapter = (index: number) => {
    const newChapters = [...chapters];
    newChapters.splice(index, 1);

    // Renumber chapters
    const renumberedChapters = newChapters.map((chapter, idx) => ({
      ...chapter,
      chapternumber: idx + 1,
      name:
        chapter.name?.replace(/\d+/, (idx + 1).toString()) ||
        `Chapter ${idx + 1}`,
    }));

    onChange(renumberedChapters);

    // Adjust expanded chapter if necessary
    if (expandedChapter === index) {
      setExpandedChapter(null);
    } else if (expandedChapter !== null && expandedChapter > index) {
      setExpandedChapter(expandedChapter - 1);
    }
  };

  const handleChapterChange = (
    index: number,
    field: keyof Chapter,
    value: string
  ) => {
    const newChapters = [...chapters];
    newChapters[index] = {
      ...newChapters[index],
      [field]: value,
    };
    onChange(newChapters);
  };

  const toggleChapter = (index: number) => {
    setExpandedChapter(expandedChapter === index ? null : index);
  };

  return (
    <div className="admin-chapters-form">
      <div className="admin-chapters-form__header">
        <h2 className="admin-chapters-form__title">Nội dung chương</h2>
        <button
          className="admin-chapters-form__add-btn"
          onClick={handleAddChapter}
        >
          <i className="bx bx-plus"></i>
          Thêm chương
        </button>
      </div>

      <div>
        {chapters.map((chapter, index) => (
          <div key={index} className="admin-chapters-form__chapter">
            <div
              className={`admin-chapters-form__chapter-header ${
                expandedChapter === index ? "expanded" : ""
              }`}
              onClick={() => toggleChapter(index)}
            >
              <div className="admin-chapters-form__chapter-title">
                <span>
                  Chapter {chapter.chapternumber}: {chapter.chaptername}
                </span>
              </div>
              <i
                className={`bx bx-chevron-down admin-chapters-form__chapter-toggle ${
                  expandedChapter === index ? "expanded" : ""
                }`}
              ></i>
            </div>

            {expandedChapter === index && (
              <div className="admin-chapters-form__chapter-content">
                <div className="admin-chapters-form__field">
                  <label
                    className="admin-chapters-form__label"
                    htmlFor={`chapter-title-${index}`}
                  >
                    Tên chương
                  </label>
                  <input
                    id={`chapter-title-${index}`}
                    className="admin-chapters-form__input"
                    value={chapter.chaptername || ""}
                    onChange={(e) =>
                      handleChapterChange(index, "chaptername", e.target.value)
                    }
                    placeholder="Nhập tên chương"
                  />
                </div>

                <div className="admin-chapters-form__field">
                  <label
                    className="admin-chapters-form__label"
                    htmlFor={`chapter-content-${index}`}
                  >
                    Nội dung
                  </label>
                  <textarea
                    id={`chapter-content-${index}`}
                    className="admin-chapters-form__textarea"
                    value={chapter.content || ""}
                    onChange={(e) =>
                      handleChapterChange(index, "content", e.target.value)
                    }
                    placeholder="Nhập nội dung chương"
                  ></textarea>
                </div>

                <div className="admin-chapters-form__actions">
                  <button
                    className="admin-chapters-form__remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveChapter(index);
                    }}
                  >
                    <i className="bx bx-trash"></i>
                    Xóa chương
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminChaptersForm;

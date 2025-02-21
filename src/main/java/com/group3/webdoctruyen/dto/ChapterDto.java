package com.group3.webdoctruyen.dto;

import lombok.Value;

import java.io.Serializable;
import java.util.Date;

/**
 * DTO for {@link com.group3.webdoctruyen.model.Chapter}
 */
@Value
public class ChapterDto implements Serializable {
    int chapterId;
    String chapterName;
    int view;
    Date createAt;
    Date updateAt;
}
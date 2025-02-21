package com.group3.webdoctruyen.dto;

import lombok.Value;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * DTO for {@link com.group3.webdoctruyen.model.Story}
 */
@Value
public class StoryDto implements Serializable {
    Integer storyId;
    String storyName;
    String storyDescription;
    String imageUrl;
    String source;
    Date createTime;
    Date updateTime;
    Integer view;
    List<ChapterDto> chapters;
    AuthorDto author;
}
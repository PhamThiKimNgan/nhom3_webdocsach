package com.group3.webdoctruyen.mapper;

import com.group3.webdoctruyen.dto.StoryDto;
import com.group3.webdoctruyen.model.Story;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper
public interface StoryMapper {
    StoryDto toDto(Story story);
    List<StoryDto> toDto(List<Story> storyList);
}

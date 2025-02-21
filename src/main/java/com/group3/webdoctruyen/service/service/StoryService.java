package com.group3.webdoctruyen.service.service;

import com.group3.webdoctruyen.dto.StoryDto;
import com.group3.webdoctruyen.model.Story;

import java.util.List;

public interface StoryService {
    List<StoryDto> findAll();
}

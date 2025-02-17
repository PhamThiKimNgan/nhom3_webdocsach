package com.group3.webdoctruyen.service.serviceimpl;

import com.group3.webdoctruyen.dto.StoryDto;
import com.group3.webdoctruyen.mapper.StoryMapper;
import com.group3.webdoctruyen.model.Story;
import com.group3.webdoctruyen.repository.StoryRepoitory;
import com.group3.webdoctruyen.service.service.StoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StoryServiceimpl implements StoryService {


    @Autowired
    private StoryRepoitory storyRepoitory;
    @Autowired
    private StoryMapper storyMapper;
    @Override
    public List<StoryDto> findAll() {
        List<Story> storyList = storyRepoitory.findAll();
        List<StoryDto> storyDtoList = storyMapper.toDto(storyList) ;
        return storyDtoList;

    }

}

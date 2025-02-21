package com.group3.webdoctruyen.controller;

import com.group3.webdoctruyen.dto.StoryDto;
import com.group3.webdoctruyen.service.service.StoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/story")
public class StoryController {
    @Autowired
    private StoryService storyService;
    @GetMapping("/list")
    public ResponseEntity<List<StoryDto>> getAllStory(){
        List<StoryDto> list = storyService.findAll();
        return new ResponseEntity<>(list , HttpStatus.OK);


    }
}

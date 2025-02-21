package com.group3.webdoctruyen.repository;

import com.group3.webdoctruyen.model.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

@Repository
public interface StoryRepoitory extends JpaRepository<Story, Integer> {

}

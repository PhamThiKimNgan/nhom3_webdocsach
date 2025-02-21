package com.group3.webdoctruyen.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Chapter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column( nullable = false)
    private int chapterId;
    @Column(nullable = false)
    private String chapterName;
    @Column(nullable = false)
    private int view;
    @Column(nullable = false)
    private Date createAt;
    @Column(nullable = false)
    private Date updateAt;
    
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "story_id")
    private Story story;
}

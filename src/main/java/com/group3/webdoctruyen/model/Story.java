package com.group3.webdoctruyen.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Story {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column( nullable = false)
    private Integer storyId;
    @Column( nullable = false )
    private String storyName;
    @Column( nullable = false )
    private String storyDescription;
    @Column( nullable = false )
    private String imageUrl;
    @Column( nullable = false )
    private String source;
    @Column( nullable = false )
    private Date createTime;
    @Column( nullable = false )
    private Date updateTime;
    @Column( nullable = false )
    private Integer view;

    @OneToMany(cascade = CascadeType.ALL , mappedBy = "story")
    private List<Chapter> chapters;

    @OneToMany(cascade = CascadeType.ALL , mappedBy = "story")
    private List<Story_Category> storyCategories;

    @OneToMany(cascade = CascadeType.ALL , mappedBy = "story")
    private List<User_Role> userRoles;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "author_id")
    private Author author;

}

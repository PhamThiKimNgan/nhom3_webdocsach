package com.group3.webdoctruyen.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column( nullable = false)
    private int categoryId;

    @Column( nullable = false)
    private String categoryName;
    @OneToMany(cascade = CascadeType.ALL , mappedBy = "category")
    private List<Story_Category> storyCategories;

}

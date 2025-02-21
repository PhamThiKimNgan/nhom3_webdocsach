package com.group3.webdoctruyen.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column( nullable = false)
    private int authorId;

    @Column( nullable = false)

    private String authorName;
    @Column( nullable = false)

    private String description;
    @Column( nullable = false)

    private String email;
    @Column( nullable = false)

    private Date createAt;
    @OneToMany(cascade = CascadeType.ALL , mappedBy = "story")
    private List<Story> stories;

}

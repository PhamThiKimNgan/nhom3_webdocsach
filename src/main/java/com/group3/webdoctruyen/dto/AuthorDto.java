package com.group3.webdoctruyen.dto;

import lombok.Value;

import java.io.Serializable;
import java.util.Date;

/**
 * DTO for {@link com.group3.webdoctruyen.model.Author}
 */
@Value
public class AuthorDto implements Serializable {
    int authorId;
    String authorName;
    String description;
    String email;
    Date createAt;
}
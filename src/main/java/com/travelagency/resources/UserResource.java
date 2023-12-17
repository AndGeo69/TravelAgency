package com.travelagency.resources;

import com.travelagency.UserTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResource {
    private Long id;
    private String name;
    private UserTypeEnum type;
}

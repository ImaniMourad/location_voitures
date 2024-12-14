package com.location.mappers;

import com.location.dto.UserDTO;
import com.location.model.Client;
import com.location.model.User;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;


@Service
public class UserMapperImpl {

    public UserDTO fromUser(User user){
        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user,userDTO);
        return userDTO;
    }

    public User fromUserDTO(UserDTO userDTO){
        User user = new Client();
        BeanUtils.copyProperties(userDTO,user);
        return user;
    }
}


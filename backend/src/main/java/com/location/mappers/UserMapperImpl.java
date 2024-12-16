package com.location.mappers;

import com.location.dto.UserDTO;
import com.location.model.Client;
import com.location.model.User;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


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

    public List<UserDTO> fromUserList(@NotNull List<User> users) {
        List<UserDTO> userDTOList = new ArrayList<>();
        for(User user: users){
            userDTOList.add(fromUser(user));
        }
        // make password null
        for(UserDTO userDTO: userDTOList){
            userDTO.setPassword(null);
        }
        return userDTOList;
    }
}


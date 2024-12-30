package com.location.mappers;

import com.location.dto.ClientDTO;
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
        BeanUtils.copyProperties(user,userDTO,"password");
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
    
    public List<ClientDTO> fromClientList(@NotNull List<Client> clients) {
        List<ClientDTO> clientDTOList = new ArrayList<>();
        for(Client client: clients){
            clientDTOList.add(fromClient(client));
        }
        return clientDTOList;
    }

    public ClientDTO fromClient(Client client){
        ClientDTO clientDTO = new ClientDTO();
        BeanUtils.copyProperties(client,clientDTO);
        return clientDTO;
    }

    public Client fromClientDTO(ClientDTO clientDTO){
        Client client = new Client();
        BeanUtils.copyProperties(clientDTO,client);
        return client;
    }

}


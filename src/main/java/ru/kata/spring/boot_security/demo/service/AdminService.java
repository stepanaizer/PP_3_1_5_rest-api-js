package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface AdminService {
    public List<User> findAll();
    public User findById(Long id);
    public void addUser(User createdUser);
    public void updateUser(User updatedUser);
    public void deleteUserById(Long id);
    public List<Role> findAllRoles();
}

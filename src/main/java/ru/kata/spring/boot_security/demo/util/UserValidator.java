package ru.kata.spring.boot_security.demo.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserValidationService;

import java.util.Optional;
@Component
public class UserValidator implements Validator {
    private final UserValidationService userValidationService;
    @Autowired
    public UserValidator(UserValidationService userValidationService) {
        this.userValidationService = userValidationService;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return User.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        User userFromView = (User) target;
        Optional<User> userToValidate = userValidationService.findByUsername(userFromView.getUsername());

        if(userToValidate.isPresent()){
            errors.rejectValue("username","", "Человек с таким именем пользователя уже существует");
        }
    }
}

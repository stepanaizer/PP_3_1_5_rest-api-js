package ru.kata.spring.boot_security.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;


@Component
public class SetupDataLoader implements ApplicationListener<ContextRefreshedEvent> {
    private boolean alreadySetup = false;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    public SetupDataLoader(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {

        if (alreadySetup) {
            return;
        }
        createRoleIfNotFound("ROLE_ADMIN");
        createRoleIfNotFound("ROLE_USER");

        Role adminRole = roleRepository.findByRoleName("ROLE_ADMIN");
        Role userRole = roleRepository.findByRoleName("ROLE_USER");

        User admin;
        if (userRepository.findByEmail("admin@mail.ru").isEmpty()) {
            admin = new User();
            admin.setFirstName("admin");
            admin.setLastName("admin");
            admin.setAge(99);
            admin.setEmail("admin@mail.ru");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.addRole(userRole);
            admin.addRole(adminRole);
            userRepository.save(admin);
        }
        alreadySetup = true;
    }

    @Transactional
    public void createRoleIfNotFound(String roleName) {
        Role role = roleRepository.findByRoleName(roleName);

        if (role == null) {
            role = new Role(roleName);
            roleRepository.save(role);
        }
    }
}

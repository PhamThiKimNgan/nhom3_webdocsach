// package mobile.config;

// import mobile.model.Entity.User;
// import mobile.model.Entity.Role;
// import mobile.repository.UserRepository;
// import mobile.repository.RoleRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Component;

// import java.util.HashSet;
// import java.util.Set;

// @Component
// public class AdminInitializer implements CommandLineRunner {

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private RoleRepository roleRepository;

//     @Autowired
//     private PasswordEncoder passwordEncoder;

//     @Override
//     public void run(String... args) throws Exception {
//         // Initialize ADMIN role if it doesn't exist
//         Role adminRole = roleRepository.findByName("ROLE_ADMIN")
//                 .orElseGet(() -> {
//                     Role newRole = new Role("ADMIN");
//                     return roleRepository.save(newRole);
//                 });

//         if (userRepository.findByUsername("admin").isEmpty()) {
//             User admin = new User();
//             admin.setUsername("admin");
//             admin.setEmail("admin@example.com");
//             admin.setPassword(passwordEncoder.encode("admin123"));
            
//             Set<Role> roles = new HashSet<>();
//             roles.add(adminRole);
//             admin.setRoles(roles);
            
//             admin.setActive(true);
//             userRepository.save(admin);
//             System.out.println("Admin account created successfully!");
//         }
//     }
// }
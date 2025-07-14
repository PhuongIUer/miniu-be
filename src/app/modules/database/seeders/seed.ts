import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { Role } from "../../roles/entities/roles.entity";
import { User } from "../../users/entities/user.entity";

config();

const configService = new ConfigService();

// Hàm hash password
// async function hashPassword(password: string): Promise<string> {
//   const salt = await bcrypt.genSalt(10);
//   return bcrypt.hash(password, salt);
// }

async function seedDatabase() {
  const dataSource = new DataSource({
    type: "postgres",
    host: configService.getOrThrow('POSTGRES_HOST'),
    port: configService.getOrThrow('POSTGRES_PORT'),
    database: configService.getOrThrow('POSTGRES_DB'),
    username: configService.getOrThrow('POSTGRES_USER'),
    password: configService.getOrThrow('POSTGRES_PASSWORD'),
    entities: [Role, User],
    synchronize: false,
    logging: true
  });

  try {
    await dataSource.initialize();
    console.log("Database initialized");

    // Seed roles
    const roleRepository = dataSource.getRepository(Role);
    const roleCount = await roleRepository.count();
    if (roleCount === 0) {
      const roles = [
        roleRepository.create({ name: 'admin', description: 'Administrator with full access' }),
        roleRepository.create({ name: 'teacher', description: 'Teacher with course management access' }),
        roleRepository.create({ name: 'student', description: 'Student with limited access' }),
      ];
      
      await roleRepository.save(roles);
      console.log("Roles seeded successfully");
    }

    // Seed users
    const userRepository = dataSource.getRepository(User);
    const userCount = await userRepository.count();
    let users: User[];
    if (userCount === 0) {
      const roles = await roleRepository.find();
      const roleMap = new Map(roles.map(role => [role.name, role]));
      
      // Hash passwords
      const hashedAdminPassword = '$2a$12$390EuXFKd1nbXur/OpesmOmabkMHmpOuDaU1ezvDarRi14U7ldi96';
      const hashedTeacherPassword = '$2a$12$390EuXFKd1nbXur/OpesmOmabkMHmpOuDaU1ezvDarRi14U7ldi96';
      const hashedStudentPassword = '$2a$12$390EuXFKd1nbXur/OpesmOmabkMHmpOuDaU1ezvDarRi14U7ldi96';
      
      users = [
        userRepository.create({ 
          email: 'admin@example.com', 
          password: hashedAdminPassword,
          userName: 'admin',
          isVerified: true,
          role: roleMap.get('admin')
        }),
        
        userRepository.create({ 
          email: 'teacher@example.com', 
          password: hashedTeacherPassword,
          userName: 'teacher',
          isVerified: true,
          role: roleMap.get('teacher')
        }),
        userRepository.create({ 
          email: 'student@example.com', 
          password: hashedStudentPassword,
          userName: 'student',
          isVerified: true,
          role: roleMap.get('student')
        }),
      ];
      
      await userRepository.save(users);
      console.log("Users seeded successfully");
    }
    
  } catch (error) {
    console.error("Error during database seeding", error);
  } finally {
    await dataSource.destroy();
  }
}

seedDatabase().catch(error => console.error(error));

# CourseHub

CourseHub is a web application designed to facilitate online courses, instructor management, and student registrations. This application allows users to create, read, update, and delete courses, instructors, and registrations, providing a comprehensive platform for managing educational content.

## Features

- **User Authentication**: Users can register and log in to access the platform. Admin users have special privileges to manage courses and instructors.
- **Course Management**: Admins can create, edit, and delete courses. Each course can have associated materials and a list of registered participants.
- **Instructor Management**: Admins can manage instructors, including adding new instructors and editing existing ones.
- **Registration Management**: Users can register for courses, and the system prevents duplicate registrations for the same course.
- **Material Upload**: Instructors can upload materials related to their courses for students to access.
- **Statistics Dashboard**: Admins can view statistics related to courses and registrations.

## Database Structure

The application uses the following tables:

- **Users**: Stores user information and roles.
- **Instructors**: Contains details about instructors.
- **Courses**: Holds information about courses, including duration, cost, and associated instructor.
- **Students**: Stores participant information.
- **Registrations**: Manages course registrations, linking students to courses.
- **Materials**: Contains course materials uploaded by instructors.

## Technologies Used

- **AdonisJS 6**: A Node.js MVC framework for building web applications.
- **Edge**: The view engine used for rendering HTML templates.
- **Bootstrap/Tailwind CSS**: For styling the application and ensuring a responsive design.

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/coursehub.git
   cd coursehub
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up the environment variables:

   - Copy the `.env.example` to `.env` and configure your database settings.

4. Run migrations and seed the database:

   ```
   npm run migrate
   npm run seed
   ```

5. Start the development server:

   ```
   npm run dev
   ```

6. Access the application at `http://localhost:3333`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

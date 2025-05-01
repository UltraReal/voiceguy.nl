# VoiceGuy Website

This is the official website for VoiceGuy, a voice-over artist and content creator.

## Features

- User authentication system
- Admin dashboard
- Profile management
- Social media integration
- Content management

## Installation

1. Clone this repository
2. Create a database for the project
3. Copy `config/database.sample.php` to `config/database.php` and update with your database credentials
4. Import the database structure using `config/setup_database.php` (visit this file in your browser)
5. Access the website through your local server

## Configuration

Update the database configuration in `config/database.php`:

```php
$db_host = "localhost";
$db_user = "your_username";
$db_pass = "your_password";
$db_name = "your_database";
```

## Admin Access

Default admin credentials:
- Username: admin
- Email: admin@voiceguy.nl
- Password: admin123

**Important:** Change the default admin password after first login!

## License

This project is proprietary and not licensed for redistribution.

## Contact

For more information, visit [VoiceGuy's social media channels](#).
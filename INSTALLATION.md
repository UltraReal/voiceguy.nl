# Installation Guide

Follow these steps to set up the VoiceGuy website on your local environment:

## Prerequisites

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache, Nginx, etc.)

## Installation Steps

1. **Clone the repository**
   ```
   git clone https://github.com/yourusername/voiceguy-website.git
   cd voiceguy-website
   ```

2. **Set up the database**
   - Create a new MySQL database for the project
   - Copy the sample configuration files:
     ```
     cp config/database.sample.php config/database.php
     cp config/setup_database.sample.php config/setup_database.php
     ```
   - Edit `config/database.php` and `config/setup_database.php` with your database credentials

3. **Initialize the database**
   - Run the database setup script by visiting `http://localhost/your-project-path/config/setup_database.php` in your browser
   - This will create all necessary tables and a default admin account

4. **Configure your web server**
   - Point your web server to the project directory
   - Make sure PHP is properly configured
   - Ensure the `.htaccess` file is being processed (for Apache)

5. **Access the website**
   - Visit `http://localhost/your-project-path/` in your browser
   - Log in with the default admin credentials (see README.md)
   - Change the default admin password immediately

## Troubleshooting

- **Database Connection Issues**
  - Verify your database credentials in `config/database.php`
  - Make sure your MySQL server is running

- **Permission Issues**
  - Ensure the web server has appropriate permissions to read/write to the project directory

- **404 Errors**
  - Check that your web server is properly configured to use the `.htaccess` file
  - For Apache, make sure `mod_rewrite` is enabled

## Development Setup

For local development, you can use tools like:
- XAMPP
- WAMP
- MAMP
- Docker

These provide an easy way to set up a local development environment with PHP, MySQL, and a web server.
## Prerequisites/Setup on local environment 
- Node v20.9.0
- Yarn 1.22.22
- XAMPP for Windows/ (LEMP stack) on Ubuntu

# Steps to run the project
- Create database named taskmgmt and taskmgmt_test
- Install project dependencies using command: npm i
- Run migration using command: node knex_migrate.js
- Run test cases using command: yarn test
- Created openAPI doc build using command: yarn openapi
- Now you can access api doc on http://localhost:5500/api-doc

# Node.js MySQL Project on EC2

This repository contains a Node.js project that connects to a MySQL database and is designed to run on an AWS EC2 instance.

## Prerequisites

- AWS EC2 instance running Amazon Linux 2
- SSH access to the EC2 instance
- Node.js and npm installed
- MySQL server installed and running
- Git installed

## Installation Steps

### 1. Connect to Your EC2 Instance

Use SSH to connect to your EC2 instance. Replace `your-key.pem`, `ec2-user`, and `your-ec2-instance-public-dns` with your actual values:

```bash
ssh -i "your-key.pem" ec2-user@your-ec2-instance-public-dns

## Steps to Set Up a LEMP Stack on EC2 instance
- Update and Upgrade the System:
    sudo apt update
    sudo apt upgrade

- Install Nginx:
    sudo apt install nginx

- Enable Nginx to start on boot and verify the status:
    sudo systemctl enable nginx
    sudo systemctl start nginx
    sudo systemctl status nginx

- Install MySQL:
    sudo apt install mysql-server
    sudo mysql_secure_installation

- Install PHP-Required to run phpmyadmin:
    sudo apt install php-fpm php-mysql

- Configure Nginx to Use PHP Processor:
    sudo nano /etc/nginx/sites-available/domain

- Add the following configuration (replace domain with your domain name or IP address):
    server {
        listen 80;
        server_name domain;

        root /var/www/domain;
        index index.php index.html index.htm;

        location / {
            try_files $uri $uri/ =404;
        }

        location ~ \.php$ {
            include snippets/fastcgi-php.conf;
            fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        }

        location ~ /\.ht {
            deny all;
        }
    }
- Enable the new configuration:
    sudo ln -s /etc/nginx/sites-available/domain /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx

- Adjust Firewall Settings:
    sudo ufw allow 'Nginx Full'
    sudo ufw enable
    sudo ufw status

- Now install node
    curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
    sudo bash nodesource_setup.sh
    sudo apt install nodejs


    node -v
    npm -v

- Now install yarn
    sudo apt install yarn
    
- Verify the installation:
    yarn --version

# Steps to run the project
- Create database named taskmgmt and taskmgmt_test
- Install project dependencies using command: npm i
- Run migration using command: node knex_migrate.js
- Run test cases using command: yarn test
- Created openAPI doc build using command: yarn openapi
- Now you can access api doc on http://domain:5500/api-doc



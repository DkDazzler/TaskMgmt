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

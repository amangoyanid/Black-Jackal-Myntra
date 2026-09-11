# Use the official PHP image
FROM php:8.1-apache

# Copy the current directory contents into the container at /var/www/html
COPY . /var/www/html/

# Set the working directory
WORKDIR /var/www/html

# Expose the port the app runs on
EXPOSE 80

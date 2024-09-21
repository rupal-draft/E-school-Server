# Learnopia: E-Learning Platform Server

## Overview

Learnopia is a comprehensive e-learning platform built with Node.js and Express.js for the server-side functionality. The application utilizes MongoDB for data storage, Cloudinary for image media storage, and AWS S3 for course video storage. In addition, a course recommendation model has been implemented using machine learning algorithms with FastAPI.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Node.js APIs](#nodejs-apis)
- [Course Recommendation Model](#course-recommendation-model)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization
- Course creation and management
- Image and video uploads
- Course recommendations based on user input

## Technologies Used

- **Node.js** - JavaScript runtime for the server-side
- **Express.js** - Web framework for building APIs
- **MongoDB** - NoSQL database for data storage
- **Cloudinary** - Image and media storage
- **AWS S3** - Cloud storage for videos
- **FastAPI** - Web framework for building APIs in Python
- **scikit-learn** - Machine learning library for Python
- **Pandas** - Data manipulation and analysis library for Python

## Setup Instructions

### Node.js Server Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd E-school-Server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add the required environment variables (e.g., database URI, Cloudinary credentials).

4. **Run the server:**
   ```bash
   npm start
   ```

### ML Model Server Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ML-Model-Server
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add the required environment variables.

4. **Run the FastAPI server:**
   ```bash
   uvicorn main:app --reload
   ```

## Node.js APIs

### Authentication API

- **POST `/register`**: Register a new user.
- **POST `/login`**: Authenticate user and issue token.
- **GET `/logout`**: Log the user out.
- **GET `/current-user`**: Get current user info (requires sign-in).
- **POST `/forgot-password`**: Initiate password reset.
- **POST `/reset-password/:id`**: Reset user password.
- **GET `/user/get-courses`**: Fetch user’s enrolled courses (requires sign-in).
- **GET `/user/mycart`**: Retrieve user’s cart (requires sign-in).

### Course Management API

- **GET `/courses`**: List all courses.
- **GET `/courseView/:slug`**: View course details.
- **POST `/course/upload-image`**: Upload course image (requires sign-in).
- **POST `/course/create-course`**: Create a new course (requires sign-in, instructor).
- **GET `/course/:slug`**: Fetch course details.
- **POST `/course/video-upload/:id`**: Upload course video (requires sign-in).
- **POST `/course/lesson/:slug/:id`**: Add lesson to course (requires sign-in).
- **PUT `/course/publish/:courseId`**: Publish a course.
- **GET `/check-enrollment/:courseId`**: Check course enrollment status (requires sign-in).

### Instructor Management API

- **POST `/make-instructor`**: Promote user to instructor (requires sign-in).
- **POST `/instructor-image`**: Upload instructor profile image (requires sign-in).
- **GET `/instructor-courses`**: Get instructor’s courses (requires sign-in).
- **GET `/instructor-payments`**: View instructor payment records (requires sign-in).

### Product Management API

- **GET `/products`**: List all products.
- **POST `/products/upload-image`**: Upload product image (requires sign-in).
- **POST `/products/createproduct`**: Create new product (requires sign-in, instructor).
- **POST `/products/addtocart`**: Add product to cart (requires sign-in).

## Course Recommendation Model

- **Technology**: Built using FastAPI and scikit-learn.
  
- **Functionality**: 
  - **Data Loading**: Loads course data from a CSV file.
  - **Preprocessing**: Cleans the dataset by removing unnecessary columns and filling NaNs.
  - **Text Vectorization**: Uses TF-IDF to convert course subjects into a numerical format for analysis.
  - **Similarity Calculation**: Computes similarity scores between courses using a sigmoid kernel.
  
- **Key Function**: 
  - **`recommend_course(course)`**: Takes a course title as input and returns the top 10 similar courses based on content similarity.

## Usage

- Access the e-learning platform at the designated URL after starting the Node.js server.
- Use the `/recommend` endpoint on the FastAPI server to get course recommendations by sending a course title as input.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue to discuss changes.


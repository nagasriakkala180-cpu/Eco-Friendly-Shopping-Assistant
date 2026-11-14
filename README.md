# 🌿 Eco-Friendly Shopping Assistant

### GreenCart – Make Smarter Choices. Shop Sustainably. Protect the Planet.

## 📌 Project Overview

The **Eco-Friendly Shopping Assistant** is a full-stack web application designed to encourage sustainable and environmentally responsible shopping.

The application helps users explore, evaluate, and compare products based on their environmental impact. It uses an eco-rating system from Grade A to Grade F to help users identify more sustainable products.

GreenCart provides features such as product search, advanced filtering, eco-score calculation, product comparison, user authentication, wishlist management, and product administration.

The main objective of this project is to make eco-friendly shopping easier, smarter, and more accessible while promoting environmental awareness and responsible consumption.

## 🎯 Project Objectives

- To encourage environmentally responsible shopping.
- To help users identify sustainable products.
- To evaluate products using an eco-rating system.
- To compare products based on sustainability factors.
- To provide secure user registration and login.
- To allow users to manage personalized wishlists.
- To store and manage product information using a database.
- To provide a user-friendly and responsive shopping experience.

## ✨ Key Features

### 1. User Authentication
- User registration and login.
- User account management.
- Authentication-based access to application features.

### 2. Eco-Rating System
Products are classified into six environmental grades:

| Grade | Score | Description |
|---|---:|---|
| A | 80–100 | Excellent |
| B | 65–79 | Good |
| C | 50–64 | Fair |
| D | 35–49 | Poor |
| E | 20–34 | Very Poor |
| F | 0–19 | Worst |

### 3. Product Management
- Display available eco-friendly products.
- View product details and prices.
- Organize products by category.
- Manage product information through the admin module.

### 4. Product Search and Filtering
- Search products by name.
- Filter products by eco-grade.
- Filter products by category.
- Filter products according to price.
- Sort products based on eco-score and price.

### 5. Product Comparison
- Compare multiple products.
- Evaluate their environmental performance.
- Compare prices and sustainability scores.
- Identify better eco-friendly alternatives.

### 6. Wishlist Management
- Add products to a wishlist.
- View saved products.
- Remove products from the wishlist.
- Manage personalized shopping preferences.

### 7. Admin Module
- Manage product information.
- Add, update, and delete product records.
- Maintain product categories and eco-rating information.

## 🌱 Sustainability Evaluation Factors

The application evaluates products using six important sustainability parameters.

| Sustainability Factor | Weight |
|---|---:|
| Carbon Footprint | 30% |
| Recycled Materials | 20% |
| Packaging | 15% |
| Ethical Certification | 15% |
| Water Usage | 10% |
| Durability | 10% |
| **Total** | **100%** |

### Eco-Score Calculation

The overall eco-score is calculated using a weighted average of the available sustainability factors.

Eco-Score = Sum of (Factor Score × Factor Weight) / Sum of Available Factor Weights.

The final score is used to assign an eco-grade from A to F.

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Python
- Flask Framework

### Database
- MySQL

### Development Tools
- Visual Studio Code
- MySQL Workbench
- Git
- GitHub

## 🏗️ System Architecture

The application follows a three-layer architecture:

1. **Presentation Layer:** HTML, CSS, and JavaScript provide the user interface.
2. **Application Layer:** Python Flask handles application logic, user requests, and backend processing.
3. **Database Layer:** MySQL stores user, product, and wishlist information.

## 📂 Project Structure

```text
Eco-Friendly-Shopping-Assistant/
│
├── app.py
├── schema.sql
├── requirements.txt
│
├── templates/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── products.html
│   ├── compare.html
│   ├── wishlist.html
│   └── admin.html
│
├── static/
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       └── app.js
│
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

- Python 3.x
- MySQL Server
- MySQL Workbench
- Visual Studio Code
- Web Browser

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### Step 2: Open the Project

Open the downloaded project folder in Visual Studio Code.

### Step 3: Create a Virtual Environment

```bash
py -m venv .venv
```

### Step 4: Activate the Virtual Environment

For Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

### Step 5: Install Dependencies

```bash
py -m pip install -r requirements.txt
```

### Step 6: Configure MySQL Database

1. Start your MySQL Server.
2. Open MySQL Workbench.
3. Execute the SQL commands available in `schema.sql`.
4. Configure the database connection details required by the Flask application.

### Step 7: Run the Application

```bash
py app.py
```

Open the local URL displayed in the terminal in your browser.

## 🔮 Future Enhancements

- Integration of real-time sustainability data.
- AI-based eco-friendly product recommendations.
- Advanced product analytics and visualizations.
- Improved product certification verification.
- Personalized shopping recommendations.
- Enhanced mobile-friendly experience.
- Integration with sustainable shopping platforms.

## 🌍 Project Impact

The Eco-Friendly Shopping Assistant aims to create awareness about sustainable consumption and help users make environmentally conscious purchasing decisions.

By providing product sustainability scores and comparison features, the application encourages consumers to choose products that contribute to a greener and healthier environment.

## 👩‍💻 Developer

**Project Title:** Eco-Friendly Shopping Assistant

**Application Name:** GreenCart

**Project Domain:** Full Stack Web Development

**Technologies:** HTML, CSS, JavaScript, Python Flask, MySQL

## 📜 License

This project is developed for educational purposes.

---

### 🌿 GreenCart – Shop Green, Live Clean!

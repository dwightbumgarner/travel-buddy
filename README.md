# TravelBuddy: A Tour Guide in your Pocket
Travel Buddy is a mobile app designed to redefine your travel experience. By combining the power of generative AI with image-based landmark detection, TravelBuddy offers you an on-demand, interactive tour guide experience.

## Demo

Click the image below to watch the demo video for TravelBuddy! It can also be found here: https://www.youtube.com/watch?v=SOnoVV6EN8Q

[![Travel Buddy Demo Video](https://img.youtube.com/vi/SOnoVV6EN8Q/0.jpg)](https://www.youtube.com/watch?v=SOnoVV6EN8Q)

## Getting Started

### Prerequisites
- Node.js installed on your computer
- Expo CLI installed
- A Firebase project
- A Google Cloud (GCP) service account with a key
- An OpenAI key

### Installation

1. **Clone the Repository**

    Start by cloning the repository to your local machine.

    ```
    git clone https://github.com/dwightbumgarner/travel-buddy.git
    ```

2. **Set Up the Backend**

    Navigate to the `backend` folder and rename the `.env.test` file to `.env`. Edit this file to include your port number (default is 8000), Firebase project details, GCP Client key, and OpenAI key.

    ```
    cd backend
    npm install
    npm start
    ```

3. **Install and Run ngrok**

    Open a new terminal and install ngrok to create a secure tunnel to your localhost. This allows you to run the application on your phone.

    ```
    brew install ngrok
    ngrok http http://localhost:8000
    ```

    Follow the sign up instructions if it's your first time using ngrok.

4. **Configure the Frontend**

    Create a `consts.js` file in the `frontend` folder. Export the ngrok forwarding address with '/api' added to the end.

    ```
    cd ../frontend
    npm install
    npx expo start --tunnel
    ```

    Scan the generated QR code with the Expo Go app on your phone to launch TravelBuddy.

### Sign Up and Log In

Upon opening the app, you'll be prompted to log in or sign up. After signing up with your email and password, the app will automatically log you in and request access to your location.

## Features

- **Landmark Identification**: Upload or take a photo of a landmark to learn more about it, along with community ratings and a chat feature to ask the AI questions.

- **Profile Customization**: View and edit your profile, including changing your profile picture and name.

- **Discover Nearby Points of Interest**: Explore locations close to you with community ratings and photos.

- **Interactive Forum**: Participate in discussions, rate points of interest, and view posts from other users in the forums.

## Conclusion

TravelBuddy aims to make your travel experiences richer and more informed by combining cutting-edge technology with a user-friendly interface. We hope you enjoy exploring the world with TravelBuddy as your guide!

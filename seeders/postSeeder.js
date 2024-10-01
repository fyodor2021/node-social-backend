const postModel = require("../models/Post.js");
const userModel = require("../models/User.js");
const commentModel = require("../models/Comment.js");
const mongoose = require("mongoose");
MONGO_BASE_URL = "mongodb://localhost:27017/social-server";
function generatePosts(user) {
  const posts = [
    new postModel({
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
      content:
        '"Success is not final, failure is not fatal: It is the courage to continue that counts." – Winston Churchill. Stay motivated and keep pushing forward, no matter the obstacles you face. 🚀💪 #Inspiration #MotivationMonday',
      fileName: 'success.jpg',
      status: "public",
    }),
    new postModel({
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
      fileName: "honey.jpg",
      content:
        "'Did you know? Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible! 🍯🐝 #FunFact #DidYouKnow",
      status: "public",
    }),
    new postModel({
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
      fileName: "water.jpg",
      content:
        "Tip of the Day: Stay hydrated! Drinking enough water can boost your energy levels and improve concentration. Aim for at least 8 glasses a day. 💧💪 #HealthTips #StayHydrated",
      status: "public",
    }),
    new postModel({
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
      fileName: "film-set.png",

      content:
        "Here’s a sneak peek behind the scenes of our latest project! We’re excited to share more details soon. Stay tuned for updates! 🎥👀 #BehindTheScenes #SneakPeek",
      status: "public",
    }),
    new postModel({
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
      fileName: "customer.jpeg",

      content:
        "We love hearing from our amazing customers! Here’s what [Customer’s Name] had to say about their recent experience: 'The service was top-notch, and I couldn't be happier with my purchase!' Thank you for the feedback, [Customer’s Name]! 🌟🙌 #CustomerSpotlight #Testimonial",
      status: "public",
    }),
    new postModel({
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
      fileName: "webinar.jpeg",

      content:
        "Exciting news! We’re hosting a webinar on [Date] about [Topic]. Join us for insights, tips, and a Q&A session with industry experts. Register now to secure your spot! 🌐📅 #Webinar #EventAnnouncement",
      status: "public",
    }),
    new postModel({
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
      fileName: "book.jpg",
      content:
        "Looking for your next great read? Check out [Book Title] by [Author]. It's a captivating story that will keep you hooked from start to finish. 📚✨ Have you read it? Share your thoughts! #BookRecommendation #MustRead",
      status: "public",
    }),
    new postModel({
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
      fileName: "weekend.jpg",

      content:
        "Happy weekend, everyone! 🎉 How are you planning to spend your time? Whether it’s relaxing at home or exploring new places, make sure to enjoy every moment. #WeekendVibes #TGIF",
      status: "public",
    }),
    new postModel({
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
      fileName: "learning.jpg",
      content:
        "Challenge of the Week: Try to learn 5 new words in a different language and use them in a sentence by Friday! 🌍📚 Share your progress and new favorite words with us! #LanguageChallenge #FunChallenge",
      status: "public",
    }),
    new postModel({
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
      fileName: "habit.jpg",

      content:
        "Start a new healthy habit today: Incorporate a 10-minute walk into your daily routine. 🚶‍♀️🚶‍♂️ It’s a great way to clear your mind and get some fresh air. What’s your favorite way to stay active? #HealthyHabits #FitnessTips",
      status: "public",
    }),
    new postModel({
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
      fileName: "phone-battery.png",

      content:
        "Tech Tip: To save battery life on your smartphone, turn off background app refresh and reduce screen brightness. 📱🔋 These simple adjustments can make a big difference! What are your go-to tips for saving battery? #TechTip #SmartphoneHacks",
      status: "public",
    }),
    new postModel({
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
      fileName:"thinker.jpeg",

      content:
        "'The best way to predict the future is to invent it.' – Alan Kay. Take control of your destiny and start building the future you envision today. 🌟✨ #QuoteOfTheDay #Inspiration",
      status: "public",
    }),
    new postModel({
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
      fileName: "dog.jpg",

      content:
        "Meet [Pet’s Name], our adorable office mascot! 🐶🐱 They always brighten up our day. Share a photo of your pets and tell us what makes them special! #PetFeature #OfficePets",
      status: "public",
    }),
    new postModel({
      user: {
        _id: user._id.toString(),
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
      fileName: "weekend.jpg",
      content:
        "Dreaming of a quick escape? How about a weekend getaway to [Destination]? 🏞️ From scenic trails to charming local shops, it’s the perfect place to unwind and explore. Where’s your favorite weekend destination? #TravelTuesday #WeekendGetaway",
      status: "public",
    }),
  ];
  return posts;
}

mongoose
  .connect(MONGO_BASE_URL, {
    auth: {
      username: "root",
      password: "root",
    },
  })
  .then(() => console.log("connected"))
  .catch((error) => console.log(error));

async function getUsersAndCreatePosts() {
  const users = await userModel.find({}).exec();
  let posts = [];
  if (users) {
    for (let user of users) {
      user._id = user._id.toString();
      posts = [...posts, ...generatePosts(user)];
    }
  }
  posts = suffleArray(posts);
  await Promise.all(
    posts.map(async (post) => {
      await post.save();
    })
  );
  process.exit();
}

function suffleArray(array) {
  let currentIndex = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}
getUsersAndCreatePosts();

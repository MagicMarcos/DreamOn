#DreamOn

<p> A platform focused on finding scholarships for DACA recipients.</p>
<p> See it live at <a href="https://dreamingon.herokuapp.com">DreamOn</a> </p>
<h1>How It's Made:</h1>
<p>Utilized: </p> 
    <ul> 
        <li>JavaScript</li>
        <li>Node</li>
        <li>Express</li>
        <li>EJS</li>
        <li>CSS</li>
        <li>Bootstrap 5</li>
        <li>MongoDB</li>
        <li>Mongoose</li>
        <li>Passport</li>
        <li>Microsoft Azure AI Computer Vision</li>
        <li>Twilio</li>
    </ul>
<p>This was a project I held near and dear to my heart, as a DACA recipient who struggled to find financial aid when going to college.</p> 
<p>Users are able to sign up / log in as either a provider or a student. Providers can upload scholarships while students can browse and save scholarships.<p/>
<p>Scholarships will be automatically deleted upon apply by date, although users have the freedom to delete them individually. Additionally, users can comment on scholarships and students will receive text notifications a week before the due date.<p/>
<p>Scholarship content is filtered through Microsoft Azure Computer Vision to determine whether they allow DACA applicants or not.<p/>

<h1>Lessons Learned:</h1>
<p>This was a really cool project to explore neumorphism style of design. It was also a joy to work with computer vision and seeing all the amazing features Azure Ai has built in as well as twilio. Implementing MVC structure is always very satisfying and absolutely worth the effort. Lastly, having started with regular promises and then converting to sync/await was a great learning experience reinforcing my knowledge on both syntaxes.</p>

<h1>Optimizations</h1>
<p>Styling can always be better and updated.</p>
<p>Upcoming features: </p>
    <ul> 
        <li>Accessibilty features like, high contrast and zoom in options</li>
        <li>More costumizability for costumers</li>
        <li>Currently Cloudinary is a free account, thus limiting submissions to images only (no pdfs) </li> 
        <li>Currently Twilio is a free account, thus limiting phone numbers to your individual number </li>
    </ul>

# HOW TO RUN THIS LOCALLY

`npm install`

---

# Things to add

- Create a `.env` file and add the following as `key = value`
  - PORT = 2121 (can be any port example: 3000)
  - DB_STRING = `your database URI`
  - CLOUD_NAME = `your cloudinary cloud name`
  - API_KEY = `your cloudinary api key`
  - API_SECRET = `your cloudinary api secret`
  - MS_COMPUTER_VISION_SUBSCRIPTION_KEY = `your azure computer vision subscription key`
  - MS_COMPUTER_VISION_ENDPOINT = `your azure computer vision endpoint`
  - TWILIO_ACCOUNT_SID= `your twilio account SID`
  - TWILIO_AUTH_TOKEN= `your twilio auth token`
  - TWILIO_PHONE_NUMBER= `your twilio phone number`
  - (note: this version of the app, requires you to input a custom phone number -- as twilio account it's based on is a free account -- to use a full twilio account simple change the phoneNumber variable in controllers/posts.js )

---

# Run

`npm start`

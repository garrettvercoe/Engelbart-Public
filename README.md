# Engelbart

Engelbart is a real-time web application that brings online conversations from Twitter into a collective public space. Attention-driven algorithms push us towards people to follow, things to buy, ads to click. In relevance to social media, these algorithms drive us to echo chambers of people who share our same ideologies. Engelbart attempts to refute that by providing a space to view all Twitter activity in an empathic way. Follow Engelbart around in cyberspace to not only see what people are talking about, but how they're talking about it. Then, join in on the conversation yourself on Twitter.


✨ Features
---

* View live, real-time Twitter conversations
* Discover the most popular topics currently being talked about
* Find out how people are feeling towards today's topics
* Join in on the conversations yourself

🚀 Getting Started
---

To join Engelbart on his crazy adventures into Twitter, you'll have to follow these steps.

1. **Get the code**

  In your terminal, clone this repo.
```git clone git@github.com:garrettvercoe/Engelbart-Public.git```

2. **Getting Credentials**

  Since Engelbart pulls directly from Twitter, you'll need to be authenticated on Twitter.  Head over to the [Application management on Twitter](https://developer.twitter.com/en/apps) to create an application.
  
  Once you've created your application, click on the Keys and access tokens tab to retrieve `your consumer_key`, `consumer_secret`, `access_token` and `access_token_secret`.
![Twitter Authentication Page](https://camo.githubusercontent.com/c8c251be2fdc49039fb26a2e67d89feff3e63d34/68747470733a2f2f7370617469652e6769746875622e696f2f747769747465722d73747265616d696e672d6170692f696d616765732f747769747465722e6a7067)

  kjdncjd- Where it goes ---.SDMkm

3. **Install Docker**

  Download [Docker](https://docs.docker.com/get-docker/) for your operating system and make sure that it's running for the next step.

⚡️ Running Engelbart
---

```

cd Engelbart-Public

```

```

docker-compose build

```

We use Docker for ensuring a stable build across platforms. This will install the dependencies for this project on a virtual machine that will run the app.

```

docker-compose up

```

This should start 4 containers, which gets our frontend and backend working together and linked up. 
Once the last command has been started up, visit `http://localhost:5001/` in your browser. You should see Engelbart's loading page.

**Loading Image**

Because the app is being run locally instead of on a dedicated online server, you'll need to give it some time to pull Live tweets before it can visualize them.
Click "Teach Engelbart about Twitter" which will pull live Tweets for 5 minutes, and then give you a link to view those Tweets in Cyberspace.



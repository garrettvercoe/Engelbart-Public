# Engelbart

Engelbart is a real-time web application that brings online conversations from Twitter into a collective public space. Attention-driven algorithms push us towards people to follow, things to buy, ads to click. In relevance to social media, these algorithms drive us to echo chambers of people who share our same ideologies. Engelbart attempts to refute that by providing a space to view all Twitter activity in an empathic way. Follow Engelbart around in cyberspace to not only see what people are talking about, but how they're talking about it. Then, join in on the conversation yourself on Twitter.

&nbsp;
![cover](/Engelbart.png)

&nbsp;
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
  &nbsp;
  
![Twitter Authentication Page](https://camo.githubusercontent.com/c8c251be2fdc49039fb26a2e67d89feff3e63d34/68747470733a2f2f7370617469652e6769746875622e696f2f747769747465722d73747265616d696e672d6170692f696d616765732f747769747465722e6a7067)

&nbsp;

Then, go to `tasks.py` in the backend, and edit the lines below with your new credentials from Twitter.

&nbsp;

  ![auth](/auth.png)
  
&nbsp;
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

This command actually runs the application and should start 4 containers, which gets our frontend and backend working together and linked up. Once the last command has been started up, visit `http://localhost:5001/` in your browser. You should see Engelbart's loading page.

&nbsp;

![loader](/Loader.png)

&nbsp;

Because the app is being run locally instead of on a dedicated online server, you'll need to give it some time to pull Live tweets before it can visualize them.
Click "Wake up Engelbart" which will pull live Tweets for 5 minutes, and then give you a link to view those Tweets in Cyberspace.


Once you run the loader, tweets will start to be read in and processed by Engelbart. We've setup a backend monitoring system utilizing Flower + Celery to help keep track and manage data flows and calls.

&nbsp;

![monitoring](/monitoring.png)

&nbsp;

Once everything is done loading, click "Joing Engelbart in Cyberspace" to hop into the app. If, when you go to the app, it gets stuck on "Loading...", this just means there is a lot of traffic on Twitter currently and it needs a few more seconds to finish processing. After waiting a few seconds, just reload and everything should work.


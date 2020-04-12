# Lab 2 - Programmatic interaction with Apache Kafka

In the previous lab, you have produced and consumed messages manually, using Kafka Console and the Apache Kafka HQ GUI. In this lab, you will also produce and consume messages - this time in a programmatic way. You will use the Apache Kafka platform that you have prepared prior to the workshop using [the instructions on the environment](../environment/readme.md) as well as the Node run time environment.

You will start with a HelloWorld application in Node - to get going easily with Node. Then you will switch gears and start interacting with Kafka from Node.

Note: the resources for this lab are in the lab2 folder in the [Git repo on GitHub](https://github.com/AMIS-Services/kafka-introduction-workshop). 

## Gentle introduction to Node application

We will very quickly take a look at Node applications. If you have seen Node in action before, you skip this section and continue on to the next section where you will produce to and consume from Apache Kafka from a Node application.
    
### HelloWorld in Node

On the machine and environment with the Node runtime, create a folder called *hello-world*. In this folder, create a file called *app.js*. Edit this file and add the following line of code:
```
console.log("Hello World!")
```
Save the file. On the command line, execute:
`node app.js`

This will run the Node runtime, load file app.js and interpret and execute its contents. You should see the string *Hello World* printed in the console. It may not be much yet, but it is your first Node application right there!

### HelloWorld with NPM

On the machine and environment with the Node runtime, create a folder called *hello-world-npm*. Navigate to this folder and run `npm init` to create a new application.

```
cd hello-world-npm
npm init
```
Walk through the command line wizard. Feel free to either accept all default answers or provide your own values. When asked `Is this OK? (yes)` press enter. NPM will now create a package.json file based on your responses. Inspect the contents of this file.

Add a line with this content: `,    "start": "node index.js"` to the file, inside the `scripts` element and right under the line with the *test* script property. Save the file. 

Create a new file called *index.js* in this same directory. Add the line
```
console.log("Hello World!")
```
to this file. Now type `npm start` at the command line and press enter. We now leverage npm to take care of running the application. For this very simple application, you will not really see any difference yet: the code in *index.js* is executed.

### Handle HTTP Request with Node
We will make a Node application now that is a little bit more interesting than what we did before. This application will be capable of handling an HTTP request that passes in a query parameter; it will read the parameter and return an appropriate and friendly message.

On the machine and environment with the Node runtime, create a folder called *hello-world-web*. Navigate to this folder and run `npm init` to create a new application.

```
cd hello-world-web
npm init
```
Walk through the command line wizard. Feel free to either accept all default answers or provide your own values. When asked `Is this OK? (yes)` press enter. NPM will now create a package.json file based on your responses. Inspect the contents of this file.

Add a line with this content: `,    "start": "node index.js"` to the file, inside the `scripts` element and right under the line with the *test* script property. Save the file. 

Create a new file called *index.js* in this same directory. Add the following contents to the file:

```
const http = require('http')
const url = require('url')
const PORT = 3000

// create an HTTP server that handles HTTP requests; it is handed to parameters: the request and response objects
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        // get all query parameters from the URL
        const query = url.parse(req.url, true).query
        // return the HTTP response; use the value of the name parameter if it was provided, or use World if it was not
		res.setHeader('Content-Type', 'text/html');
        res.end(`Hello ${query.name ? query.name : "World"}`)
    }
})
server.listen(PORT);
console.log(`HTTP Server is listening at port ${PORT} for HTTP GET requests`)
```
Save the file.

On the command line, type `npm start` to execute the application. The HTTP Server is now listening for HTTP Requests at `localhost`, on *port 3000*.

From the command line using *curl* or *wget* or from your browser send an HTTP Request: [http://localhost:3000?name=John+Doe](http://localhost:3000?name=John+Doe)

Resource: [Node documentation on http-module](https://nodejs.org/api/http.html)

## Node interacting with Apache Kafka

The NPM module repository returns over 550 modules when searched for the keyword *kafka*. Not all of them are libraries to facilitate the interaction from your Node application with Apache Kafka clusters - but over a dozen are. In this lab, we will work with the *node-rdkafka* NPM module, [node-rdkafka on GitHub](https://github.com/Blizzard/node-rdkafka) for details on this particular library and [Reference Docs](https://blizzard.github.io/node-rdkafka/current/) for the API specification. The node-rdkafka library is a high-performance NodeJS client for Apache Kafka that wraps the native (C based) *librdkafka* library. All the complexity of balancing writes across partitions and managing (possibly ever-changing) brokers should be encapsulated in the library.

The source for this part of the lab are in the directory *node-kafka-client* in the lab2 directory in the Git repo.

### Producing to test-topic in Node

Take a look at the *package.json* file. You will see a dependency configured on *node-rdkafka*:
```
  "dependencies": {
    "node-rdkafka": "^2.2.0"
  }
```
Now look at the file *produce.js*. The first line of this Node application also refers to *node-rdkafka*. When we execute *produce.js*, the Node runtime will try to load the module *node-rdkafka*. It will try to do so by locating a directory called *node-rdkafka* under the directory *node-modules* that lives in the root of the application. At this moment, you probably do not yet have this *node-modules* directory. It gets created when you instruct *npm* to download all libraries on which the application depends - as configured in *package.json*.

To get going, open a command line window and navigate to directory *lab2-programmatic-consume-and-produce\node-kafka-client*. Then execute
```
npm install
```
This instructs *npm* to download and install in directory *node-modules* all modules that are required directly or indirectly by the application - as defined in the *dependencies* property in *package.json*.

It will take some time to complete this command. About 45MB worth of npm modules are downloaded.

This is as good a time as any to open file *produce.js* again and interpret what it does.

* compose configuration (primarily Kafka Broker endpoints)
* create a Producer (based on the configuration)
* prepare the Producer (with event handlers to respond)
* connect the Producer
* generate and produce events (Feel free to change the contents of the generated messages)
* disconnect the producer

Before you can run the producer application, make sure that the KAFKA_BROKERS configuration in *configure.js* is correct for your environment - and that the KAFKA_TOPIC refers to a topic that already exists on your Kafka Cluster.

When these conditions ar met - and `npm install` is done installing the required node modules, it is time to produce some messages to the topic.  

Run this command:
```
node produce.js
```
You should see the following output:
```
Producer connection to Kafka Cluster is ready; message production starts now
producer rdkafka#producer-1 is done producing messages to Kafka Topic test-topic.
```
When you check either in Kafka Console or in Apache Kafka HQ, you should be able to see a batch of fresh messages published to the `test-topic` (or the topic you have specified if you have changed the name of the topic).

### Consuming from test-topic in Node
The obvious next step is the consumption of messages. We will again use a Node application for this. But please realize that their is absolutely no need for this. Once messages have been produced, we cannot even tell from which type of client they have been produced. So the producing application could have been Java, Python, C, .NET just as well as Node. And the consuming application could be implemented in any technology that has a way to interact with the Kafka Cluster. The choice for Node here is one of convenience.

Check the contents of the file *consume.js*. It has the same dependencies as *produce.js*, on both NPM module *node-rdkafka* and local file *config.js*. The implementation of consume.js has been done using the Stream Consumer; for the *traditional* approach, see *consume-non-stream.js*.

What goes on in the *consume.js* application?

* compose configuration (consists primarily of the Kafka Broker endpoints as well as the Configuration Group Id)
* create a StreamReader (based on the configuration, with the offset to the earliest message available on the topic and with subscription(s) on the topic(s) defined in config.js )
* prepare the StreamReader (with event handlers to respond to data events on the Stream that are emitted when a message is read from the Kafka Topic)
* define event handler for the disconnected event
* disconnect the consumer after 30 seconds (30000 ms)

Run the Kafka Consumer application:
```
node consume.js
```
This should print all messages on the *test-topic* to the console.

If you run the consumer application a second time, you will probably not see any messages - or only new ones. This is the effect of using a Consumer Group Id. The Kafka Cluster retains the Consumer Group Id and its corresponding offset. In the second run, the consuming applications joins the same Consumer Group as before. This group has already consumed all messages. If you now change the Consumer Group Id and run the Node application again, you will see all messages on the topic once more. This is because for this new Consumer Group, no messages at all have been read from the topic, and Kafka will offer up all messages from the beginning of time.

### Check in Apache Kafka HQ
Open AKHQ in a browser. It has been started as part of the **Kafka platform ** and can be reached on <http://kafka:28042/> (provided you added the IP address to the *hosts* file associated with the host name *kafka*).

Go to the Topics page and focus on *test-topic*. Verify that the messages published from the Node application show up. Take note of the consumer group registered for this topic: you should see the same label(s) as defined in the Node application.

Open the Consumer Groups page. You will see the consumer group details. If you run the *consume.js* application once more, you will the number of members for the consumer group go up nu one. When you drill down into the consumer group and inspect the members, you can see the type of client and the IP address for the member a well as the partition the member is linked to.

On the Topic page, you can produce a message to the *test-topic*. This message will of course be consumed by the *consume.js* application.


## Bonus: Node Web Application
From the previous step it is but a small additional step to allow users to enter messages into a Web User Interface and send them for publication to a Kafka Topic. The first section shows such a (very simple) web application in Node, that allows you to send messages as query parameter in an HTTP GET request, for example by entering a URL in the location bar of your browser. 

The next section does something similar on the consuming end: publish a web application that makes the messages visible that have been consumed from the Kafka topic. To set the expectations at the right level: the response to an HTTP Request will be a JSON document with all messages received by the consumer. A more fancy UI is left as an exercise to the reader ;)
 
### Node Web Application for Producing Messages
Earlier in this lab we looked at a very simple Node web application: *hello-world-web*. Now we combine that web application with the Kafka Producer we worked on just before. Look in directory  lab2-programmatic-consume-and-produce\node-kafka-web-client and open file *web-producer.js*.

This Node application starts an HTTP Server to handle GET requests. It uses a query parameter called *message* for the content of the message to publish to the Kafka Topic. A module referenced as *./produce* is *required* into the *web-producer.js*. This is interpreted by the Node runtime as: find a local file *produce.js*, load it and make available as public objects anything in *module.exports*. The file *produce.js* is largely the same as before, only this time it does not automatically start generating and publishing messages and it has a function called *produceMessage* that produces one message to the KAFKA_TOPIC. This function is exported in *module.exports* and as such available in *web-producer.js*. Note: *producer.js* imports *config.js* - the file with the KAFKA Broker endpoints.  

Before you can run the application, you need to bring in the dependencies. From the command line in the directory that contains file *package.json* run:
```
npm install
```
to download all required NPM modules into the directory node-modules.

Now you can run the web application:
```
node web-producer.js
```
The HTTP server is started and listens on port 3001. You can send GET requests to this port that have a query parameter called *message*. Whatever value *message* has is used as the content of a message published to the Kafka Topic *test-topic*.

From a browser - or from the command line using tools such as *curl* or *wget* - make a GET request such as this one: [http://localhost:3001?message=My+Message+is+Hello+World](http://localhost:3001?message=My+Message+is+Hello+World).

You can check in Apache Kafka HQ or in the Kafka Console Consumer if the message arrives. Or go to the next section for the consuming web application in Node.


### Node Web Application for Consuming Messages

The consuming web application is very similar in structure to the producer we just discussed. The file *web-consumer.js* starts an HTTP Server that handles HTTP GET Requests. It will return a JSON document with whatever value is returned by the function *consumer.getMessages*. This function is loaded from module *./consume* and exported in *consume.js* in *module.exports*. 

Check the contents of *consume.js*: it should look familiar. New compared to the earlier implementation of *consume.js* is the *messages* array in which all messages consumed from the Kafka Topic are collected - the latest at the top or beginning of the array. The *on data* handler on the stream adds the message contents to this array and the function *getMessages* returns the array. This function is exported for the benefit of external consumers in *module.exports*. 

Run the web application:
```
node web-consumer.js
```
The HTTP server is started and listens on port 3002. You can send GET requests to this port to get a JSON document with all messages consumed from Kafka Topic *test-topic*: [http://localhost:3002](http://localhost:3002).

If you keep both web producer and web consumer running at the same time, you can see the effect of one in the other.

Publish another message: 
[http://localhost:3001?message=A+brand+new+message](http://localhost:3001?message=A+brand+new+message).
const Kafka = require("node-rdkafka");

// create a Kafka Producer - connected to the KAFKA_BROKERS defined in config.js
const producer = new Kafka.Producer({
    "metadata.broker.list": "kafka:9092,kafka:9093,kafka:9094"
});

// initialize the connection of the Producer to the Kafka Cluster
producer.connect();

// event handler attached to the Kafka Producer to handle the ready event that is emitted when the Producer has connected sucessfully to the Kafka Cluster
producer.on("ready", function (arg) {
    // produce one message
    producer.produce("test-topic", -1, new Buffer.from("Hello World - through Kafka"), 42);
    // after 10 seconds, disconnect the producer from the Kafka Cluster
    setTimeout(() => producer.disconnect(), 10000);
});

producer.on("disconnected", function (arg) {
    process.exit();
});

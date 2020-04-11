//Configuration Details for the Kafka Brokers and Topic
const config = {
    // If you added kafka to the hosts file mapped to the IP address of the Docker Host machine, then you can work with these Broker Endpoints
    KAFKA_BROKERS: "kafka:9092,kafka:9093,kafka:9094"
    // If you did not (add kafka to the hosts file) you need to uncomment this next line, comment out the previous line and make sure the right IP address is used
    //KAFKA_BROKERS: "192.168.188.110:9092,192.168.188.110:9093,192.168.188.110:9094" 
    , KAFKA_TOPIC: "test-topic"
};
module.exports = { config };
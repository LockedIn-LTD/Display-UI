import zmq from "zeromq";

async function main() {
    const sock = new zmq.Subscriber();

    const SENSOR_TOPIC = "tcp://*:5557";
    sock.connect("tcp://localhost:5557");
    sock.subscribe(SENSOR_TOPIC);

    console.log("Display-UI subscriber connected and listening on port 5557:", SENSOR_TOPIC);

    for await (const [topicFrame, jsonFrame] of sock) {
        const topic = topicFrame.toString();
        const payload = JSON.parse(jsonFrame.toString());

        console.log("Received topic:", topic);
        console.log("Received data:", payload);
    }
}

main();
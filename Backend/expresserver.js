const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

const app = express();
const port = 8008;

const uri = "mongodb+srv://mount4304:mOngodb@myproject.p8hnjmc.mongodb.net/?retryWrites=true&w=majority&appName=MyProject";

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); 
    }
}
connectDB().catch(console.error);

app.get("/tasks", async (req, res) => {
    try {
        const database = client.db("ToDoDB");
        const tasks = await database.collection("Tasks").find({}).toArray();
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ status: "error", message: "Server error" });
    }
});

app.post("/tasks", async (req, res) => {
    try {
        const { title } = req.body;
        const database = client.db("ToDoDB");
        const result = await database.collection("Tasks").insertOne({ title });
        if (result.insertedId) {
            res.json({ status: "success", data: result });
        } else {
            res.json({ status: "error", message: "Task Creation Failed" });
        }
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).json({ status: "error", message: "Server error" });
    }
});

app.delete("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const database = client.db("ToDoDB");
        const result = await database.collection("Tasks").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
            res.json({ status: "success", message: "Task deleted" });
        } else {
            res.json({ status: "error", message: "Task not found" });
        }
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ status: "error", message: "Server error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

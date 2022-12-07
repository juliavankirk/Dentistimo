const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        // bypass the requests with no origin (like curl requests, mobile apps, etc )
        if (!origin) return callback(null, true);
        return callback(null, true);
    }
}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }))

const db = require("./models");
const Role = db.role;

//to add the 3 rows manually in the db and remove the params from sync and function initial
db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and resync DB');
    initial();
})

async function initial() {
    Role.bulkCreate([
        { id: 1, name: "user" },
        { id: 2, name: "patient" },
        { id: 3, name: "dental-office-admin" },
        { id: 4, name: "dentist" }
    ]).then(() => console.log("Roles are created ..."));
};

//test route
app.get("/", (req, res) => {
    res.json({ message: "Authentication service"})
});

// routes
require('./routes/auth.routes.js')(app);
require('./routes/user.routes.js')(app);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

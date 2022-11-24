const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }))

const db = require("./models");
const Role = db.role;


//to add the 3 rows manually in the db and remove the params from sync and function initial
db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and resync DB');
    initial();
})

function initial() {
    Role.create({
        id: 1,
        name: "user"
    });

    Role.create({
        id: 2,
        name: "patient"
    });

    Role.create({
        id: 3,
        name: "dental-office-admin"
    });

    Role.create({
        id: 4,
        name: "dentist"
    });
}

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
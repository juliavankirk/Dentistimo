const express = require("express");
const app = express();
const axios = require("axios");
const HOST = process.env.HOSTNAME || "localhost";
const PORT = process.env.PORT || 3001;

app.use(express.json());

const bodyParser = require("body-parser");
const cors = require("cors");

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

app.listen(PORT, () => {
    axios({
      method: "POST",
      url: "http://mockapi.e-nomads.com:3001/",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        serviceName: "authentication-service",
        protocol: "http",
        host: HOST,
        port: PORT,
        enabled: true
      },
    }).then((response) => {
      console.log(response.data);
    });
    console.log("Authentication service server started on port " + PORT);
  });
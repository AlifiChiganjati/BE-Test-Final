const { WebSocket } = require("ws");
const jwt = require("jsonwebtoken");
const { redisClient } = require("../config/redis");

const db = require("../models");
const { secret } = require("../config/auth");

exports.refactoreMe1 = (req, res) => {
  db.sequelize.query(`select * from "surveys"`).then((data) => {
    const totalSurveys = data[0].map((survey) => {
      const surveyValues = survey.values;

      return surveyValues.reduce((a, b) => a + b, 0) / 10;
    });

    res.status(200).send({
      statusCode: 200,
      success: true,
      data: totalSurveys,
    });
  });
};

exports.refactoreMe2 = (req, res) => {
  const { userId, values } = req.body;

  const createSurvey = (userId, values) => {
    return db.sequelize.query(
      `INSERT INTO "surveys" ("userId", "values", "createdAt", "updatedAt") VALUES (${userId}, ARRAY [${values}], NOW(), NOW())`,
    );
  };

  const updateDoSurvey = (userId) => {
    return db.sequelize.query(
      `UPDATE "users" SET "dosurvey" = true WHERE "id" = ${userId}`,
    );
  };

  createSurvey(userId, values)
    .then((data) => {
      console.log("berhasil buat survey", data);

      updateDoSurvey(userId)
        .then(() => {
          console.log("success");
        })
        .catch((err) => console.log(err));

      res.status(201).send({
        statusCode: 201,
        message: "Survey sent successfully!",
        success: true,
        data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        statusCode: 500,
        message: "Cannot post survey.",
        success: false,
      });
    });
};

exports.callmeWebSocket = (req, res) => {
  if (req.headers.upgrade !== "websocket") {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Expected WebSocket connection");
    return;
  }

  const server = req.connection.server;
  const wss = new WebSocket.Server({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://livethreatmap.radware.com/api/map/attacks?limit=10",
        );
        const data = await response.json();

        const attacks = {};

        data.forEach((attackGroup) => {
          attackGroup.forEach((attack) => {
            if (!attacks.hasOwnProperty(attack.sourceCountry)) {
              if (attack.sourceCountry === "  ") {
                attacks["NO_COUNTRY"] = 1;
              } else {
                attacks[attack.sourceCountry] = 1;
              }
            } else {
              if (attack.sourceCountry === "  ") {
                attacks["NO_COUNTRY"] += 1;
              } else {
                attacks[attack.sourceCountry] += 1;
              }
            }

            if (!attacks.hasOwnProperty(attack.destinationCountry)) {
              if (attack.destinationCountry === "  ") {
                attacks["NO_COUNTRY"] = 1;
              } else {
                attacks[attack.destinationCountry] = 1;
              }
            } else {
              if (attack.destinationCountry === "  ") {
                attacks["NO_COUNTRY"] += 1;
              } else {
                attacks[attack.destinationCountry] += 1;
              }
            }
          });
        });

        let countriesList = Object.keys(attacks);
        countriesList = JSON.stringify(countriesList).replace(/"/g, "'");
        const totalList = Object.values(attacks);

        db.sequelize.query(
          `INSERT INTO "attacks" (countries, total) VALUES (ARRAY${countriesList}, ARRAY[${totalList}])`,
        );

        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 180000);

    ws.on("close", () => {
      console.log("Client disconnected");
      clearInterval(intervalId);
    });
  });

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server running");
};

exports.getData = async (req, res) => {
  const cacheKey = "get-data";
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Cache hit");
      return res.status(200).send({
        success: true,
        statusCode: 200,
        data: JSON.parse(cachedData),
      });
    }

    const getLatestData = () => {
      return db.sequelize.query("SELECT * FROM attacks LIMIT 1");
    };

    const result = await getLatestData();
    const { countries, total } = result[0][0];

    const dataToCache = JSON.stringify({ label: countries, total });
    await redisClient.set(cacheKey, dataToCache, {
      EX: 3600,
    });

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: { label: countries, total },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      statusCode: 500,
      message: error.message,
    });
  }
};

exports.login = (req, res) => {
  const { id } = req.body;

  const getUserById = () =>
    db.sequelize.query(`SELECT * FROM users WHERE id = ${id}`);

  getUserById()
    .then((data) => {
      const user = data[0][0];

      const accessToken = jwt.sign(user, secret, { expiresIn: "5h" });
      res.status(200).send({
        success: true,
        msg: "Login success!",
        statusCode: 200,
        data: {
          accessToken,
        },
      });
    })
    .catch((error) => {
      res.status(500).send({
        success: false,
        message: "Login failed.",
        statusCode: 500,
      });
    });
};

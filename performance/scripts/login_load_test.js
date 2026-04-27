import http from "k6/http";
import { check, group } from "k6";
import { Rate, Trend } from "k6/metrics";
import { SharedArray } from "k6/data";

const errorRate = new Rate("error_rate");
const responseTime = new Trend("response_time");

const csvData = new SharedArray("csv_data", () => {
  const csvContent = open("../data/data_test.csv");
  const lines = csvContent.split("\n");
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && line.length > 0) {
      const parts = line.split(",");
      if (parts.length >= 2) {
        data.push({
          user: parts[0].trim(),
          passwd: parts[1].trim(),
        });
      }
    }
  }

  console.log("Usuarios cargados: " + data.length);
  return data;
});

export const options = {
  scenarios: {
    login_load: {
      executor: "constant-arrival-rate",
      rate: 20,
      timeUnit: "1s",
      duration: "2m",
      preAllocatedVUs: 30,
      maxVUs: 50,
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<1500"],
    error_rate: ["rate<0.03"],
  },
};

export default function () {
  const user = csvData[Math.floor(Math.random() * csvData.length)];

  if (!user || !user.user || !user.passwd) {
    console.error("Datos de usuario inválidos");
    return;
  }

  const payload = {
    username: user.user,
    password: user.passwd,
  };

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
    timeout: "5s",
  };

  group("Login Load Test", () => {
    const response = http.post(
      "https://fakestoreapi.com/auth/login",
      JSON.stringify(payload),
      params,
    );

    responseTime.add(response.timings.duration);

    const isSuccess = check(response, {
      "status es 2xx": (r) => r.status >= 200 && r.status < 300,
      "tiempo de respuesta < 1500ms": (r) => r.timings.duration < 1500,
      "respuesta contiene token": (r) => r.body && r.body.includes("token"),
    });

    errorRate.add(!isSuccess);
  });
}

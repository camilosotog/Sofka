import { test, expect } from "@playwright/test";

const BASE_URL = "https://petstore.swagger.io/v2";

function attach(testInfo: any, name: string, body: any) {
  const content =
    typeof body === "string" ? body : JSON.stringify(body, null, 2);
  testInfo.attach(name, { body: content, contentType: "application/json" });
}

async function parseResponseBody(response: any) {
  const rawBody = await response.text();
  try {
    return JSON.parse(rawBody);
  } catch {
    return rawBody;
  }
}

test.describe("PetStore API Negative Tests", () => {
  test.use({ baseURL: BASE_URL });

  test("TC-NEG-01: POST /pet con body vacío", async ({ request }) => {
    // Valida que el servicio rechace la creación de mascota cuando no se envía payload.
    await test.step("Entradas", async () => {
      attach(test.info(), "Request - POST /pet (body vacío)", {
        method: "POST",
        url: `${BASE_URL}/pet`,
        headers: { "Content-Type": "application/json" },
        body: {},
      });
    });

    const startTime = Date.now();
    const response = await request.post(`${BASE_URL}/pet`, {
      data: {},
      headers: { "Content-Type": "application/json" },
    });
    const duration = Date.now() - startTime;
    const responseBody = await parseResponseBody(response);

    await test.step("Salidas capturadas", async () => {
      attach(test.info(), "Response - POST /pet (body vacío)", {
        statusCode: response.status(),
        duration: `${duration}ms`,
        body: responseBody,
      });
    });

    await test.step("Assertions", async () => {
      expect(
        [400, 405],
        "Status code debe ser 400 o 405 para body vacío",
      ).toContain(response.status());
    });
  });

  test("TC-NEG-02: GET /pet/{id} con ID inexistente", async ({ request }) => {
    // Valida que consultar un recurso inexistente responda con not found.
    const nonExistentId = 999999999;

    await test.step("Entradas", async () => {
      attach(test.info(), "Request - GET /pet/{id} inexistente", {
        method: "GET",
        url: `${BASE_URL}/pet/${nonExistentId}`,
        headers: { Accept: "application/json" },
        variables: { nonExistentId },
      });
    });

    const startTime = Date.now();
    const response = await request.get(`${BASE_URL}/pet/${nonExistentId}`);
    const duration = Date.now() - startTime;
    const responseBody = await parseResponseBody(response);

    await test.step("Salidas capturadas", async () => {
      attach(test.info(), "Response - GET /pet/{id} inexistente", {
        statusCode: response.status(),
        duration: `${duration}ms`,
        body: responseBody,
      });
    });

    await test.step("Assertions", async () => {
      expect(response.status(), "Status code debe ser 404").toBe(404);
    });
  });

  test("TC-NEG-03: GET /pet/{id} con ID inválido (texto)", async ({
    request,
  }) => {
    // Valida que un identificador con tipo inválido sea rechazado por la API.
    const invalidId = "abc";

    await test.step("Entradas", async () => {
      attach(test.info(), "Request - GET /pet/{id} inválido", {
        method: "GET",
        url: `${BASE_URL}/pet/${invalidId}`,
        headers: { Accept: "application/json" },
        variables: { invalidId },
      });
    });

    const startTime = Date.now();
    const response = await request.get(`${BASE_URL}/pet/${invalidId}`);
    const duration = Date.now() - startTime;
    const responseBody = await parseResponseBody(response);

    await test.step("Salidas capturadas", async () => {
      attach(test.info(), "Response - GET /pet/{id} inválido", {
        statusCode: response.status(),
        duration: `${duration}ms`,
        body: responseBody,
      });
    });

    await test.step("Assertions", async () => {
      expect(
        [400, 404],
        "Status code debe ser 400 o 404 para ID inválido",
      ).toContain(response.status());
    });
  });

  test("TC-NEG-04: GET /pet/findByStatus con status inválido", async ({
    request,
  }) => {
    // Valida que el endpoint rechace valores de status fuera del contrato.
    const invalidStatus = "invalidstatus";

    await test.step("Entradas", async () => {
      attach(test.info(), "Request - GET /pet/findByStatus inválido", {
        method: "GET",
        url: `${BASE_URL}/pet/findByStatus?status=${invalidStatus}`,
        headers: { Accept: "application/json" },
        queryParams: { status: invalidStatus },
      });
    });

    const startTime = Date.now();
    const response = await request.get(
      `${BASE_URL}/pet/findByStatus?status=${invalidStatus}`,
    );
    const duration = Date.now() - startTime;
    const responseBody = await parseResponseBody(response);

    await test.step("Salidas capturadas", async () => {
      attach(test.info(), "Response - GET /pet/findByStatus inválido", {
        statusCode: response.status(),
        duration: `${duration}ms`,
        body: responseBody,
      });
    });

    await test.step("Assertions", async () => {
      expect(response.status(), "Status code debe ser 400").toBe(400);
    });
  });

  test("TC-NEG-05: PUT /pet con ID inexistente", async ({ request }) => {
    // Valida que no se pueda actualizar una mascota que no existe previamente.
    const nonExistentId = 999999999;
    const requestBody = {
      id: nonExistentId,
      category: { id: 1, name: "dogs" },
      name: "ghost-pet",
      photoUrls: ["https://example.com/ghost.jpg"],
      tags: [{ id: 1, name: "ghost" }],
      status: "sold",
    };

    await test.step("Entradas", async () => {
      attach(test.info(), "Request - PUT /pet con ID inexistente", {
        method: "PUT",
        url: `${BASE_URL}/pet`,
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });
    });

    const startTime = Date.now();
    const response = await request.put(`${BASE_URL}/pet`, {
      data: requestBody,
      headers: { "Content-Type": "application/json" },
    });
    const duration = Date.now() - startTime;
    const responseBody = await parseResponseBody(response);

    await test.step("Salidas capturadas", async () => {
      attach(test.info(), "Response - PUT /pet con ID inexistente", {
        statusCode: response.status(),
        duration: `${duration}ms`,
        body: responseBody,
      });
    });

    await test.step("Assertions", async () => {
      expect(response.status(), "Status code debe ser 404").toBe(404);
    });
  });
});

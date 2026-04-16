import { test, expect } from "@playwright/test";
import { readCsv } from "../../src/csv-reader";

const BASE_URL = "https://petstore.swagger.io/v2";

interface PetTestData {
  [key: string]: string;
  testId: string;
  name: string;
  newName: string;
  category: string;
  categoryId: string;
  status: string;
  newStatus: string;
  photoUrl: string;
  tagName: string;
}

let petId: number;
let petName: string;
let testData: PetTestData[];

function attach(testInfo: any, name: string, body: any) {
  const content = typeof body === "string" ? body : JSON.stringify(body, null, 2);
  testInfo.attach(name, { body: content, contentType: "application/json" });
}

test.describe.serial("PetStore API Tests", () => {
  test.use({ baseURL: BASE_URL });

  test.beforeAll(async () => {
    testData = readCsv<PetTestData>("tests/data/csv/petstore-tests.csv");
  });

  test("TC-01: Añadir una mascota a la tienda", async ({ request }) => {
    const csv = testData.find((d) => d.testId === "test1")!;
    const requestBody = {
      id: Date.now(),
      category: { id: parseInt(csv.categoryId), name: csv.category },
      name: csv.name,
      photoUrls: [csv.photoUrl],
      tags: [{ id: 1, name: csv.tagName }],
      status: csv.status,
    };

    await test.step("Entradas: POST /pet", async () => {
      attach(test.info(), "Request - POST /pet", {
        method: "POST",
        url: `${BASE_URL}/pet`,
        headers: { "Content-Type": "application/json" },
        body: requestBody,
        csvSource: "petstore-tests.csv → test1",
      });
    });

    const startTime = Date.now();
    const response = await request.post(`${BASE_URL}/pet`, {
      data: requestBody,
      headers: { "Content-Type": "application/json" },
    });
    const duration = Date.now() - startTime;
    const responseBody = await response.json();

    await test.step("Salidas capturadas", async () => {
      attach(test.info(), "Response - POST /pet", {
        statusCode: response.status(),
        duration: `${duration}ms`,
        body: responseBody,
      });
    });

    await test.step("Variables / fixtures", async () => {
      petId = responseBody.id;
      petName = responseBody.name;
      attach(test.info(), "Variables capturadas", {
        petId,
        petName,
        status: responseBody.status,
      });
    });

    await test.step("Assertions", async () => {
      expect(response.status(), "Status code debe ser 200").toBe(200);
      expect(responseBody.id, "ID debe estar definido").toBeDefined();
      expect(responseBody.name, `Nombre debe ser ${csv.name}`).toBe(csv.name);
      expect(responseBody.status, `Status debe ser ${csv.status}`).toBe(csv.status);
    });
  });

  test("TC-02: Consultar la mascota ingresada previamente (Búsqueda por ID)", async ({ request }) => {
    const csv = testData.find((d) => d.testId === "test2")!;

    await test.step("Entradas: GET /pet/{petId}", async () => {
      attach(test.info(), "Request - GET /pet/{petId}", {
        method: "GET",
        url: `${BASE_URL}/pet/${petId}`,
        headers: { Accept: "application/json" },
        variables: { petId },
        csvSource: "petstore-tests.csv → test2",
      });
    });

    const startTime = Date.now();
    const response = await request.get(`${BASE_URL}/pet/${petId}`);
    const duration = Date.now() - startTime;
    const responseBody = await response.json();

    await test.step("Salidas capturadas", async () => {
      attach(test.info(), "Response - GET /pet/{petId}", {
        statusCode: response.status(),
        duration: `${duration}ms`,
        body: responseBody,
      });
    });

    await test.step("Variables / fixtures", async () => {
      attach(test.info(), "Variables compartidas", {
        petId,
        petName: responseBody.name,
        status: responseBody.status,
        source: "petId extraído del TC-01",
      });
    });

    await test.step("Assertions", async () => {
      expect(response.status(), "Status code debe ser 200").toBe(200);
      expect(responseBody.id, "ID debe coincidir con el creado").toBe(petId);
      expect(responseBody.name, `Nombre debe ser ${csv.name}`).toBe(csv.name);
      expect(responseBody.status, `Status debe ser ${csv.status}`).toBe(csv.status);
    });
  });

  test('TC-03: Actualizar el nombre de la mascota y el estatus a "sold"', async ({ request }) => {
    const csv = testData.find((d) => d.testId === "test3")!;
    const requestBody = {
      id: petId,
      category: { id: parseInt(csv.categoryId), name: csv.category },
      name: csv.newName,
      photoUrls: [csv.photoUrl],
      tags: [{ id: 1, name: csv.tagName }],
      status: csv.newStatus,
    };

    await test.step("Entradas: PUT /pet", async () => {
      attach(test.info(), "Request - PUT /pet", {
        method: "PUT",
        url: `${BASE_URL}/pet`,
        headers: { "Content-Type": "application/json" },
        body: requestBody,
        variables: { petId, previousName: petName, newName: csv.newName, newStatus: csv.newStatus },
        csvSource: "petstore-tests.csv → test3",
      });
    });

    const startTime = Date.now();
    const response = await request.put(`${BASE_URL}/pet`, {
      data: requestBody,
      headers: { "Content-Type": "application/json" },
    });
    const duration = Date.now() - startTime;
    const responseBody = await response.json();

    await test.step("Salidas capturadas", async () => {
      attach(test.info(), "Response - PUT /pet", {
        statusCode: response.status(),
        duration: `${duration}ms`,
        body: responseBody,
      });
    });

    await test.step("Variables / fixtures", async () => {
      petName = responseBody.name;
      attach(test.info(), "Variables actualizadas", {
        petId,
        petName,
        status: responseBody.status,
        source: "petId del TC-01, nombre y status actualizados desde CSV",
      });
    });

    await test.step("Assertions", async () => {
      expect(response.status(), "Status code debe ser 200").toBe(200);
      expect(responseBody.id, "ID debe mantenerse igual").toBe(petId);
      expect(responseBody.name, `Nombre debe ser ${csv.newName}`).toBe(csv.newName);
      expect(responseBody.status, `Status debe ser ${csv.newStatus}`).toBe(csv.newStatus);
    });
  });

  test("TC-04: Consultar la mascota modificada por estatus (Búsqueda por estatus)", async ({ request }) => {
    const csv = testData.find((d) => d.testId === "test4")!;

    await test.step("Entradas: GET /pet/findByStatus?status=" + csv.status, async () => {
      attach(test.info(), "Request - GET /pet/findByStatus", {
        method: "GET",
        url: `${BASE_URL}/pet/findByStatus?status=${csv.status}`,
        headers: { Accept: "application/json" },
        queryParams: { status: csv.status },
        variables: { petId, expectedName: petName },
        csvSource: "petstore-tests.csv → test4",
      });
    });

    const startTime = Date.now();
    const response = await request.get(`${BASE_URL}/pet/findByStatus?status=${csv.status}`);
    const duration = Date.now() - startTime;
    const responseBody = await response.json();
    const ourPet = responseBody.find((pet: any) => pet.id === petId);

    await test.step("Salidas capturadas", async () => {
      attach(test.info(), "Response - GET /pet/findByStatus", {
        statusCode: response.status(),
        duration: `${duration}ms`,
        totalResults: responseBody.length,
        targetPet: ourPet,
      });
    });

    await test.step("Variables / fixtures", async () => {
      attach(test.info(), "Variables del flujo completo", {
        petId,
        petName,
        searchStatus: csv.status,
        found: !!ourPet,
        source: "petId del TC-01, nombre actualizado en TC-03",
      });
    });

    await test.step("Assertions", async () => {
      expect(response.status(), "Status code debe ser 200").toBe(200);
      expect(Array.isArray(responseBody), "Respuesta debe ser un array").toBeTruthy();
      expect(responseBody.length, "Debe haber al menos una mascota").toBeGreaterThan(0);

      const allMatchStatus = responseBody.every((pet: any) => pet.status === csv.status);
      expect(allMatchStatus, `Todas las mascotas deben tener status "${csv.status}"`).toBeTruthy();

      expect(ourPet, "Nuestra mascota debe estar en los resultados").toBeDefined();
      expect(ourPet.name, `Nombre debe ser ${csv.name}`).toBe(csv.name);
    });
  });
});

const request = require("supertest");
const app = require("../app");

describe("server", () => {
    test("Home Page", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
    });
    test("get topics happy flow", async () => {
        const response = await request(app).get("/api/topics?search=nasa").set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
        expect(response.body[0]).toBe('nasa');
    });
    test("get topics - without search params", async () => {
        const response = await request(app).get("/api/topics").set('Accept', 'application/json');
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('You must provide query params!');
    });

    test("get topic's context happy flow", async () => {
        const response = await request(app).get("/api/topic/context?title=NASA").set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
    test("get topic's context  - without title params", async () => {
        const response = await request(app).get("/api/topic/context").set('Accept', 'application/json');
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('You must provide query params!');
    });
});
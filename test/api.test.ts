import request from "supertest"
import App from "../src/app"

describe('GET /api/v1', () => {
    it("should reeturn 200 ok", () => {
        return request(new App().app).get("/api/v1")
            .expect(200)
    })
});
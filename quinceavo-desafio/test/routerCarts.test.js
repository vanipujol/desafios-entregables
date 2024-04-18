import { app } from "../src/app.js";
import { expect } from 'chai';
import supertest from "supertest";

const requester = supertest(app);

describe("Testing the carts router", () => {

        it("The endpoint get /api/carts/ should return all carts", async function () {
            const result = await requester.get("/api/carts/");
            const { statusCode, body } = result;
            expect(statusCode).to.be.equal(200);
            expect(body.carts).to.be.an('array');
        })

        it("The endpoint post /api/carts/ creates a product successfully ", async function () {
            const cartsMock = {
                products: [
                    {
                        product: "6071ef280a2bfc2a50fb41dd",
                        quantity: 2
                    }
                ]
            }
            const result = await requester.post("/api/carts/").send(cartsMock);
            const { statusCode, body } = result;
            expect(statusCode).to.be.equal(201);
            expect(body.status).to.be.equal("success");
        })

        it("The endpoint get /api/carts/:cid should return a specific cart", async function () {
            const existingCartId = '660ca3e06e484532355f5758';
            const result = await requester.get(`/api/carts/${existingCartId}`);
            const { statusCode, body } = result;
            expect(statusCode).to.be.equal(200);
            expect(body).to.have.property('product');
        })
})

import {app} from "../src/app.js";
import {expect} from 'chai';

import supertest from "supertest";

const requester = supertest(app);

let ck;

describe("Testing the products router", () => {

    it("GET /api/products/ should return all products", async () => {
        const result = await requester.get("/api/products/");
        const {statusCode, body} = result;
        expect(statusCode).to.be.equal(200);
        expect(body.products.msg.docs).to.be.an('array');
    });

    it("The endpoint post /api/products/ creates a product successfully ", async function () {

        const userMock = {
            email: "testadmin@gmail.com",
            password: "vani"
        }
        const responseSigned = await requester.post('/api/sessions/login').send(userMock);
        expect(responseSigned.statusCode).to.be.equal(200)
        const cookieResult = responseSigned.headers['set-cookie'][0];
        expect(cookieResult).to.be.ok;

        // Split the string based on semicolon to get individual parts
        const parts = cookieResult.split(";");

        // Iterate over the parts to find the one containing the cookie value
        let cookieValue;
        parts.forEach(part => {
            const keyValue = part.trim().split("=");
            if (keyValue.length === 2 && keyValue[0] === "connect.sid") {
                cookieValue = keyValue[1];
            }
        });


        let cookie = {
            name: cookieResult.split('=')[0],
            value: cookieValue,
            full: cookieResult
        };
        expect(cookie.name).to.be.ok.and.eql('connect.sid');
        expect(cookie.value).to.be.ok;
        const productMock = {
            title: "Musculosa blanca",
            description: "Remera musculosa blanca",
            price: 6000,
            code: "RMB",
            stock: 33,
            category: "indumentaria",
            thumbnail: "google.com",
            owner: "admin"
        }
        ck = [`${cookie.name}=${cookie.value}`]
        const result = await requester.post("/api/products/").send(productMock).set('Cookie', ck);
        const {statusCode, _body} = result;
        expect(statusCode).to.be.equal(200)
        expect(_body.status).to.be.equal("success")
    })

    it("PUT /api/products/:pid most return 200", async function () {
        const productMock = {
            title: "Musculosa blanca",
            description: "Remera musculosa blanca",
            price: 6000,
            code: "RMB",
            stock: 33,
            category: "indumentaria",
            thumbnail: "google.com",
            owner: "admin"
        }
        const {body, statusCode, ok} = await requester.post("/api/products").send(productMock).set('Cookie', ck);
        const response = await requester.put(`/api/products/${body.message._id}`).send({title: "Pantalon"}).set('Cookie', ck);
        expect(response.status).to.be.equal(200)
    })

    it("DELETE /api/products/:pid most return 200", async function () {
        const productMock = {
            title: "Musculosa blanca",
            description: "Remera musculosa blanca",
            price: 6000,
            code: "RMB",
            stock: 33,
            category: "indumentaria",
            thumbnail: "google.com",
            owner: "admin"
        }
        const {body, statusCode, ok} = await requester.post("/api/products").send(productMock).set('Cookie', ck);
        const responseDelete = await requester.delete(`/api/products/${body.message._id}`)
        const response = await requester.get(`/api/products/${body.message._id}`)
        expect(response.body.payload).to.be.equal(undefined);

    })
})



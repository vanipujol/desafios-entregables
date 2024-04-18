import { app } from "../src/app.js";
import { expect } from 'chai';

import supertest from "supertest";
import userModel from "../src/dao/models/users.model.js";

const requester = supertest(app);
let cookie;

describe("Testing the users router", () => {

        it('You must correctly register a user', async function () {
            await userModel.deleteOne({email: "test@gmail.com" });
            const userMock = {
                first_name: "Vanina",
                last_name: "Pujol",
                age: 27,
                email: "test@gmail.com",
                password: "2123"
            }
            const responseSigned = await requester.post('/api/sessions/register').send(userMock);
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

            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieValue,
                full: cookieResult
            };

            expect(cookie.name).to.be.ok.and.eql('connect.sid');
            expect(cookie.value).to.be.ok;
        })

        it("login", async function(){
            const userMock = {
                email: "test@gmail.com",
                password: "2123"
            }
            const responseSigned = await requester.post('/api/sessions/login').send(userMock);
            expect(responseSigned.statusCode).to.be.equal(200)
        })

        it("You must send the cookie containing the user and return it", async function(){

            const ck =  [`${cookie.name}=${cookie.value}`]
            const {_body} = await requester.get('/api/sessions/current').set('Cookie', ck)
            expect(_body.user.email).to.be.eql('test@gmail.com')
        })
});
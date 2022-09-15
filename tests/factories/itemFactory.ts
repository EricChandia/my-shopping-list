import { faker } from "@faker-js/faker";

export default function itemFactory(){
    return{
        title: faker.commerce.productName(),
        url: faker.internet.url(),
        description: faker.commerce.productDescription(),
        amount: Number(faker.random.numeric(3))
    }
}
import supertest from 'supertest';
import app from '../src/app';
import itemFactory from './factories/itemFactory'
import * as itemRepository from '../src/repositories/itemRepository';
import { prisma } from '../src/database';

const item = itemFactory();

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "items"`;
});


describe('Testa POST /items ', () => {
  
  it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
    const result = await supertest(app).post(`/items`).send(item);

    expect(result.status).toBe(201);
  });

  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {
    await supertest(app).post(`/items`).send(item);
    const result = await supertest(app).post(`/items`).send(item);

    expect(result.status).toBe(409);
  });
});

describe('Testa GET /items ', () => {

  it('Deve retornar status 200 e o body no formato de Array', async () => {
    const result = await supertest(app).get(`/items`).send();

    expect(result.status).toBe(200);
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {
    await supertest(app).post(`/items`).send(item);
    const itemData = await itemRepository.findByTitle(item.title);

    const result = await supertest(app).get(`/items/${itemData.id}`).send();
    delete result.body.id;

    expect(result.status).toBe(200);
    expect(result.body).toEqual(item);
  });
  it('Deve retornar status 404 caso não exista um item com esse id', async () => {
    const result = await supertest(app).get(`/items/1`).send();

    expect(result.status).toBe(404);
  });
});

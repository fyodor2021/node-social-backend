print('START');


db = db.getSiblingDB('social-server');

db.createUser({
    user:'root',
    pwd: 'root',
    roles: [{role: 'readWrite', db: 'social-server'}],
});

db.createCollection('social-collection');


print('END');
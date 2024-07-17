INSERT INTO users (id, name,  created_at) VALUES
    ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Pedro',  '2024-01-01'),
    ('5f3c5b44-79b5-4eb9-9d45-4df07e925f5b', 'Alisa', '2024-07-17');

INSERT INTO carts (id, user_id, created_at, updated_at, status) VALUES
    ('6c54f1ee-d290-4b01-90e6-d701748f0852', 'd290f1ee-6c54-4b01-90e6-d701748f0851', '2023-03-01', '2023-03-01', 'OPEN'),
    ('79b5f3c5-5b44-4eb9-9d45-4df07e925f5b', '5f3c5b44-79b5-4eb9-9d45-4df07e925f5b', '2023-04-01', '2023-04-01', 'ORDERED');

INSERT INTO orders (id, user_id, cart_id, payment, delivery, comments, status, total) VALUES
    ('90e6f1ee-d290-4b01-90e6-d701748f0853', 'd290f1ee-6c54-4b01-90e6-d701748f0851', '6c54f1ee-d290-4b01-90e6-d701748f0852', '{"method": "credit_card", "amount": 100.00}', '{"address": "123 Main St"}', 'Fast delivery, please!', 'PENDING', 100.00),
    ('90e6d701-6c54-4b01-90e6-d701748f0854', '5f3c5b44-79b5-4eb9-9d45-4df07e925f5b', '79b5f3c5-5b44-4eb9-9d45-4df07e925f5b', '{"method": "paypal", "amount": 150.00}', '{"address": "456 Oak St"}', 'Leave at the door.', 'COMPLETED', 150.00);

INSERT INTO cart_items (cart_id, product_id, count) VALUES
    ('6c54f1ee-d290-4b01-90e6-d701748f0852', 'd290f1ee-6c54-4b01-90e6-d701748f0855', 2),
    ('6c54f1ee-d290-4b01-90e6-d701748f0852', 'd290f1ee-6c54-4b01-90e6-d701748f0856', 3),
    ('79b5f3c5-5b44-4eb9-9d45-4df07e925f5b', '5f3c5b44-79b5-4eb9-9d45-4df07e925f5c', 10),
    ('79b5f3c5-5b44-4eb9-9d45-4df07e925f5b', '5f3c5b44-79b5-4eb9-9d45-4df07e925f5d', 4);

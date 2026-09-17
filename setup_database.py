import sqlite3

conn = sqlite3.connect('database.db')

foods = [
    ('Chicken Pizza', 'Pizza',
     'Chicken, cheese and fresh toppings', 600, 'chicken.jpg'),

    ('Beef Pizza', 'Pizza',
     'Beef, cheese and fresh toppings', 650, 'beef.jpg'),

    ('Fried Chicken', 'Chicken',
     'Crispy fried chicken', 350, 'fried.jpg'),

    ('Chicken & Chips', 'Chicken',
     'Chicken served with crispy chips', 500, 'chips.jpg'),

    ('Fish & Ugali', 'Fish',
     'Fresh fish served with ugali', 400, 'fish.jpg'),

    ('Fresh Juice', 'Drinks',
     'Freshly prepared fruit juice', 150, 'soda.jpg'),

    ('Soda', 'Drinks',
     'Refreshing soft drink', 80, 'pizza.jpg')
]

conn.executemany('''
    INSERT INTO menu_items
    (name, category, description, price, image)
    VALUES (?, ?, ?, ?, ?)
''', foods)

conn.commit()
conn.close()

print("Food items added successfully!")
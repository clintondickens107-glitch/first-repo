from flask import Flask, redirect, url_for, render_template, request
import json
import sqlite3


app=Flask(__name__)


def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn


@app.route('/menu')
def menu():
    conn = get_db_connection()
    items = conn.execute('SELECT * FROM menu_items ORDER BY category, name').fetchall()
    conn.close()
    return render_template('menu.html', menu_items=items)


@app.route('/menu.html')
def menu_html():
    return redirect(url_for('menu'))


@app.route('/')
def home():
    return render_template('template.html')


@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/order', methods=['GET', 'POST'])
def order():
    if request.method == 'POST':
        data = request.get_json(silent=True) or request.form

        customer_name = str(data.get('name', '')).strip()
        phone = str(data.get('phone', '')).strip()
        address = str(data.get('address', '')).strip()
        instructions = str(data.get('instructions', '')).strip()

        try:
            requested_items = data.get('items', [])
            if isinstance(requested_items, str):
                requested_items = json.loads(requested_items)
            requested_items = [
                {'id': int(item['id']), 'quantity': int(item['quantity'])}
                for item in requested_items
                if int(item['quantity']) > 0
            ]
        except (KeyError, TypeError, ValueError, json.JSONDecodeError):
            return {'error': 'Please select valid food items and quantities.'}, 400

        if not customer_name or not phone or not requested_items:
            return {'error': 'Please provide customer details and select at least one item.'}, 400

        conn = get_db_connection()
        menu_ids = [item['id'] for item in requested_items]
        placeholders = ','.join('?' for _ in menu_ids)
        menu_items = conn.execute(
            f'SELECT id, name, price FROM menu_items WHERE id IN ({placeholders})',
            menu_ids
        ).fetchall()
        menu_by_id = {item['id']: item for item in menu_items}

        if len(menu_by_id) != len(set(menu_ids)):
            conn.close()
            return {'error': 'One or more selected food items are unavailable.'}, 400

        quantity = sum(item['quantity'] for item in requested_items)
        total_price = sum(
            menu_by_id[item['id']]['price'] * item['quantity']
            for item in requested_items
        )
        cursor = conn.execute(
            '''INSERT INTO orders
               (customer_name, phone, address, instructions, quantity, total_price)
               VALUES (?, ?, ?, ?, ?, ?)''',
            (customer_name, phone, address, instructions, quantity, total_price)
        )
        order_id = cursor.lastrowid
        conn.executemany(
            '''INSERT INTO order_items (order_id, menu_item_id, item_name, unit_price, quantity)
               VALUES (?, ?, ?, ?, ?)''',
            [
                (order_id, item['id'], menu_by_id[item['id']]['name'],
                 menu_by_id[item['id']]['price'], item['quantity'])
                for item in requested_items
            ]
        )
        conn.commit()
        conn.close()

        return {'message': 'Order received successfully.', 'order_id': order_id}, 201

    conn = get_db_connection()
    menu_items = conn.execute(
        'SELECT id, name, price FROM menu_items WHERE available = 1 ORDER BY category, name'
    ).fetchall()
    conn.close()
    return render_template(
        'order.html',
        menu_items=menu_items,
        selected_food=request.args.get('food', '')
    )


if __name__ == '__main__':
    app.run(debug=True)
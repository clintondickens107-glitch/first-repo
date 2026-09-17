from flask import Flask,redirect,url_for,render_template
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


@app.route('/')
def home():
    return render_template('template.html')


@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')


if __name__ == '__main__':
    app.run(debug=True)
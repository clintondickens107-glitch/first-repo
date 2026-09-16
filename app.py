from flask import Flask,redirect,url_for,render_template

app=Flask(__name__)

@app.route('/')
def home():
    return render_template('template.html')


@app.route('/menu')
def menu():
    return render_template('menu.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')


if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, jsonify, request, Response
from flask_mysqldb import MySQL
from flask_cors import CORS
from flask_bcrypt import Bcrypt

app = Flask(__name__)
bcrypt = Bcrypt(app)

app.config["MYSQL_USER"] = "<YOUR_ROOT_DB_USER>"
app.config["MYSQL_PASSWORD"] = "<YOUR_DB_PASSWORD>"
app.config["MYSQL_DB"] = "news"
app.config["MYSQL_CURSORCLASS"] = "DictCursor"

mysql = MySQL(app)
CORS(app)



@app.route("/api/user/login", methods=["POST"])
def check_login():
    cur = cur = mysql.connection.cursor()
    email = request.get_json()["email"]
    password = request.get_json()["password"]
    checkemail = cur.execute(
        "SELECT * FROM users.auth WHERE email = '{x1}'".format(x1=email)
    )

    if checkemail == 0:
        return jsonify({"error": "user with provided email does not exist"}), 404
    else:
        if bcrypt.check_password_hash(cur.fetchall()[0]["password"], password):
            return jsonify({"email": email, "password": password})
        else:
            return jsonify({"error": "incorrect password"}), 404


@app.route("/api/user/register", methods=["POST"])
def add_task():
    cur = mysql.connection.cursor()
    username = request.get_json()["name"]
    email = request.get_json()["email"]

    check = cur.execute(
        "SELECT username FROM users.auth WHERE username = '{x1}'".format(x1=username)
    )

    if check == 0:
        passw = request.get_json()["password"]
        password = bcrypt.generate_password_hash(passw)
        confirmpassword = request.get_json()["password2"]
        if bcrypt.check_password_hash(password, confirmpassword):
            cur.execute(
                """INSERT INTO users.auth (username, password, confirmpassword, email) VALUES (%s, %s, %s, %s)""",
                (username, password, password, email),
            )
            mysql.connection.commit()
            result = {
                "email": email,
                "username": username,
                "password": password,
                "confirmpassword": password,
            }
            js = jsonify(result)
            return js

        else:
            return jsonify(exception="passwords dont match"), 404
    else:
        js = jsonify({"error": "user already  exists"})

        return jsonify(exception="user already exists"), 404








if __name__ == "__main__":
    app.run(debug=True)

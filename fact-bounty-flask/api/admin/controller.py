import psutil
import os
import time
from flask import make_response, jsonify, request, current_app
from flask.views import MethodView
from api.admin.model import Admin
from api.helpers import admin_token_required
from werkzeug.security import generate_password_hash, check_password_hash
import jwt

PERIOD = 1  # 1 sec


class Register(MethodView):
    """This registers new admin"""
    @staticmethod
    def post():
        """Handle POST request for this view. Url --> /api/admin/register"""
        # getting JSON data from request
        post_data = request.get_json(silent=True)
        try:
            name = post_data['name']
            email = post_data['email']
            password = post_data['password']
            password2 = post_data['password2']
        except Exception:
            response = {"message": "Please provide all the required fields."}
            return make_response(jsonify(response)), 404

        # Querying the database with requested email
        admin = Admin.find_by_email(email)

        if admin:
            # There is an existing admin. We don't want to register admin twice
            # Return a message to the admin telling them that they they already
            # exist
            response = {"message": "Admin already exists. Please login."}
            return make_response(jsonify(response)), 202

        # There is no user so we'll try to register them

        # If passwords don't match, return error
        if password != password2:
            response = {"message": "Both passwords does not match"}
            return make_response(jsonify(response)), 401

        # Register the admin
        try:
            hashed_password = generate_password_hash(password)
            # store the password by hashing it
            admin = Admin(email=email, password=hashed_password, name=name)
            admin.save()
        except Exception as err:
            print("Error occured: ", err)
            response = {"message": "Something went wrong!!"}
            return make_response(jsonify(response)), 500

        response = {"message": "You registered successfully. Please log in."}

        # return a response notifying the admin that they registered
        # successfully
        return make_response(jsonify(response)), 201

class Login(MethodView):
    """This class-based view handles admin login and access token generation."""
    @staticmethod
    def post():
        """Handle POST request for this view. Url ---> /api/admin/login"""
        app = current_app._get_current_object()
        email = request.json.get('email')
        password = request.json.get('password')
        if not email or not password:
            return jsonify({'message': 'please fill all the fields'}), 401

        # Get the admin object using their email (unique to every admin)
        admin = Admin.find_by_email(email)

        if not admin:
            return jsonify({'message': 'The email address is not registered'}), 401

        if check_password_hash(admin.password, request.json.get('password')):
            # if email id and password are verified
            token = jwt.encode(
                {
                    'admin_id': admin.id,
                    'name': admin.name,
                    'email': admin.email,
                },
                app.config['ADMIN_TOKEN_KEY']
            )
            # this token should be posted every time in headers before loggin in
            return jsonify({'token': token.decode('UTF-8')})
        return jsonify({'message': 'Could not verify'}), 401


class Logout(MethodView):
    @staticmethod
    def post(current_user):
        return jsonify({'message': 'logged out'})


class SystemPanel(MethodView):
    @staticmethod
    def get(current_user):

        io_data_start = psutil.net_io_counters()

        time.sleep(PERIOD)

        cpu_data = psutil.cpu_percent(interval=None)
        ram_data = psutil.virtual_memory()
        disk_data = psutil.disk_usage("/")
        # user_data = psutil.users()
        io_data = psutil.net_io_counters()

        data = {
            "cpu": {"percent": cpu_data},
            "ram": {
                "percent": ram_data.percent,
                "total": ram_data.total >> 20,
                "used": ram_data.total - ram_data.available >> 20,
            },
            "disk": {
                "total": disk_data.total >> 30,
                "used": disk_data.used >> 30,
            },
            "io": {
                "sent_bytes_sec": (
                    io_data.bytes_sent - io_data_start.bytes_sent
                ),
                "received_bytes_sec": (
                    io_data.bytes_recv - io_data_start.bytes_recv
                ),
            },
        }

        response = {"message": "Data fetched successfully!", "data": data}
        return make_response(jsonify(response)), 200


adminController = {
    "system": SystemPanel.as_view("system_panel"),
    "register": Register.as_view("register"),
    "login": Login.as_view("login"),
    "logout": admin_token_required(Logout.as_view("logout"), Admin)
}
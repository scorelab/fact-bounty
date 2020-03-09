from threading import Thread
from flask import current_app, jsonify, request
from flask_mail import Message
from api.extensions import mail
from functools import wraps
import jwt

def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)


def send_email(to, subject, body):
    app = current_app._get_current_object()
    msg = Message(app.config['FACTBOUNTY_MAIL_SUBJECT_PREFIX'] + subject, sender=app.config['FACTBOUNTY_MAIL_SENDER'], recipients=[to])
    msg.body = body
    thr = Thread(target=send_async_email, args=[app, msg])
    thr.start()
    return thr


def admin_token_required(f, model):
    def decorated(*args, **kwargs):
        app = current_app._get_current_object()
        token = None
        if 'x-access-token' in request.headers: 
            token = request.headers['x-access-token']
        if not token:
            return jsonify({'message': 'token is missing'}), 401
        try:
            data = jwt.decode(token, app.config['ADMIN_TOKEN_KEY'])
            current_user = model.query.filter_by(id=data['admin_id']).first()
        except:
            return jsonify({'message': 'Token is Invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated
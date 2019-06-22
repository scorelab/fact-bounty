from threading import Thread
from flask import current_app
from flask_mail import Message
from api.extensions import mail

def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)

def send_email(to, subject, body):
    app = current_app._get_current_object()
    msg = Message(app.config['FACTBOUNTY_MAIL_SUBJECT_PREFIX'] + subject,
        sender=app.config['FACTBOUNTY_MAIL_SENDER'], recipients=[to])
    msg.body = body
    thr = Thread(target=send_async_email, args=[app, msg])
    thr.start()
    return thr

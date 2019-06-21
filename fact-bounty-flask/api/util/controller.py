from flask.views import MethodView
from flask import make_response, request, jsonify, current_app
from api.helpers import send_email

class ContactUs(MethodView):
    """This class-based view handles user complaints send through contact us form request"""
    def post(self):
        try:
            # get the request data
            data = request.get_json(silent=True)

            # extract data from dict
            phone = data['phone']
            email = data['email']
            subject = data['subject']
            message = data['message']

            # compose mail body
            body = """
            From: <%s>
            %s
            Contact: %s
            """ % (email, message, phone)

            # send mail to admin
            send_email(current_app.config['FLASKY_ADMIN'], subject, body)

            response = {
                'message': 'Form submitted Successfully!',
            }
            # return a response notifying the user that form submitted successfully
            return make_response(jsonify(response)), 201
        except Exception as e:
            # An error occured, therefore return a string message containing the error
            response = {
                'message': str(e)
            }
            return make_response(jsonify(response)), 404


utilController = {
    'contact_us': ContactUs.as_view('contactus')
}
from flask.views import MethodView
from flask import make_response, request, jsonify, current_app
from .utils import cron_crawlers


class SetCronJob(MethodView):
    def get(self):
        try:
            jobs = []
            for job in current_app.scheduler.get_jobs():
                job_obj = {}
                job_obj['id'] = job.id
                job_obj['name'] = job.name
                job_obj['trigger'] = str(job.trigger)
                job_obj['next_run'] = job.next_run_time
                jobs.append(job_obj)

            response = {
                'message': 'Jobs fetched successfully',
                'jobs': jobs
            }
            return make_response(jsonify(response)), 200
        except Exception as e:
            # An error occured, therefore return a string message containing the error
            response = {
                'message': str(e)
            }
            return make_response(jsonify(response)), 404

    def post(self):
        try:
            data = request.get_json(silent=True)
    
            month = data['month']
            day = data['day']
            
            job = current_app.scheduler.add_job(cron_crawlers, 'cron', month=month, day=day)

            response = {
                'message': 'Job created successfully',
                'data': 'job details: %s' % job
            }
            return make_response(jsonify(response)), 200
        except Exception as e:
            # An error occured, therefore return a string message containing the error
            response = {
                'message': str(e)
            }
            return make_response(jsonify(response)), 404

    def put(self):
        try:
            data = request.get_json(silent=True)

            job_id = data['id']
            month = data['month']
            day = data['day']

            job = current_app.scheduler.reschedule_job(job_id, trigger='cron', month=month, day=day)

            response = {
                'message': 'Job updated successfully',
                'data': 'job details: %s' % job
            }
            return make_response(jsonify(response)), 200
        except Exception as e:
            # An error occured, therefore return a string message containing the error
            response = {
                'message': str(e)
            }
            return make_response(jsonify(response)), 404

    def delete(self):
        try:
            data = request.get_json(silent=True)

            job_id = data['id']

            current_app.scheduler.remove_job(job_id)

            response = {
                'message': 'Job deleted successfully'
            }
            return make_response(jsonify(response)), 200
        except Exception as e:
            # An error occured, therefore return a string message containing the error
            response = {
                'message': str(e)
            }
            return make_response(jsonify(response)), 404


crawlerController = {
    'setcronjob': SetCronJob.as_view('setjob'),
}

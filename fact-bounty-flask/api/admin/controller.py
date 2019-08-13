import psutil
import os
import time
from flask import make_response, jsonify
from flask.views import MethodView

PERIOD = 1  # 1 sec


class SystemPanel(MethodView):
    def get(self):

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


adminController = {"system": SystemPanel.as_view("system_panel")}

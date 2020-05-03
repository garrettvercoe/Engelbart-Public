from flask import Flask
from flask import url_for, jsonify, render_template
from worker import celery
import celery.states as states

app = Flask(__name__)


@app.route('/data/<string:task_id>')
def load_data(task_id: str) -> str:
    res = celery.AsyncResult(task_id)
    if res.state == states.PENDING:
        return res.state
    else:
        return jsonify(res.result)


@app.route('/<path:path>')
def static_proxy(path):
    # send_static_file will guess the correct MIME type
    return app.send_static_file(path)


@app.route('/dataload', methods=['POST'])
def dataload():
    stream = celery.send_task('tasks.stream')
    processData = celery.send_task('tasks.getData')
    progressBar = celery.send_task('tasks.long_task')
    return jsonify({'dataLocation': url_for('load_data', task_id=processData.id)}), 202, {'progressLocation': url_for('taskstatus',
                                                                                                                      task_id=progressBar.id)}


@app.route('/status/<task_id>')
def taskstatus(task_id):
    task = celery.AsyncResult(task_id)
    if task.state == 'PENDING':
        # job did not start yet
        response = {
            'state': task.state,
            'current': 0,
            'total': 1,
            'status': 'Pending...'
        }
    elif task.state != 'FAILURE':
        response = {
            'state': task.state,
            'current': task.info.get('current', 0),
            'total': task.info.get('total', 1),
            'status': task.info.get('status', '')
        }
        if 'result' in task.info:
            response['result'] = task.info['result']
    else:
        # something went wrong in the background job
        response = {
            'state': task.state,
            'current': 1,
            'total': 1,
            'status': str(task.info),  # this is the exception raised
        }
    return jsonify(response)


@app.route("/")
def start():
    return render_template('loader.html')



@app.route("/app")
def engelbart():
    return app.send_static_file('index.html')

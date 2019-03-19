# Fact-Bounty flask api
A flask-driven restful API for Fact Bounty project


## Technologies used
*   **[Python3](https://www.python.org/downloads/)** - A programming language that lets you work more quickly (The universe loves speed!).
*   **[Flask](flask.pocoo.org/)** - A microframework for Python based on Werkzeug, Jinja 2 and good intentions
*   **[Virtualenv](https://virtualenv.pypa.io/en/stable/)** - A tool to create isolated virtual environments
*   **[SQLite](https://www.sqlite.org/)** - An in-process library that implements a self-contained, serverless, zero-configuration, transactional SQL database engine
*   **[Elasticsearch](https://www.elastic.co/downloads/elasticsearch)** - A search engine based on the Lucene library
*   Minor dependencies can be found in the requirements.txt file.


## Installation / Usage
*  First ensure you have python3 globally installed in your computer. If not, you can get python3 [here](https://www.python.org).
*  After this, ensure you have installed virtualenv globally as well. If not, run this:
    ```
    $ pip install virtualenv
    ```


*  #### Dependencies

    1. Create and fire up your virtual environment in python3:
    ```
	$ virtualenv -p python3 venv
	$ source venv/bin/activate
    ```

*   #### Environment Variables
    Create a .env file and add the following:
    ```
	export FLASK_APP="app.py"
	export FLASK_ENV="development"
	export SECRET_KEY="some-very-long-string-of-random-characters-CHANGE-TO-YOUR-LIKING"
	export FLASK_CONFIG="development"
    ```

    Save the file.

*   #### Install your requirements
    ```
    (venv)$ pip install -r requirements.txt
    ```

*   #### Running It
    On your terminal, run the server using this one simple command:
    ```
    (venv)$ flask run
    ```

*   #### Add sample data
    Browse to db folder and run:
    ```
    (venv)$ python add_es.py
    ```

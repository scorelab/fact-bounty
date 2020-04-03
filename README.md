# Fact Bounty

[![Build Status](https://travis-ci.com/scorelab/fact-Bounty.svg?branch=master)](https://travis-ci.com/scorelab/fact-Bounty)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7574ef8d36d8451fa979a42e2884504f)](https://app.codacy.com/app/ivantha/fact-Bounty?utm_source=github.com&utm_medium=referral&utm_content=scorelab/fact-Bounty&utm_campaign=Badge_Grade_Settings)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fscorelab%2Ffact-Bounty.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fscorelab%2Ffact-Bounty?ref=badge_shield)

The recent decade has witnessed the birth of social media ecosystems that brings social organizations, media content and various stakeholders together, and now it appears significant advantages of comprehensiveness, diversity and wisdom that provide users with higher quality of experiences. Meanwhile, social media ecosystems suffer from security, privacy and trustworthiness threats. How to leverage the power of intelligent crowds to improve the ecosystem’s efficacy and efficiency, as well as ensure its security and privacy become burning and challenging issues.

#### Fact Bounty is a crowd sourced fact checking platform.

## User Guide

#### How to Setup

-   Clone the repository.

    ```bash
    git clone https://github.com/scorelab/fact-Bounty.git
    ```

-   Change directory to the folder.

    ```bash
    cd fact-Bounty/
    ```

## Set up react server

-   Run npm install in fact-bounty-client folder.

    ```bash
    cd fact-bounty-client
    npm install
    ```

-   Duplicate and rename the `.env.example` file as `.env` inside the `fact-bounty-client` folder.
    Set up environment values in `.env` in order to use the twitter search function and Google, Facebook login (OAuth).

    ```bash
    cp .env.example .env
    ```

## Set up flask server

### Technologies required

-   **[Python3](https://www.python.org/downloads/)** - A programming language that lets you work more quickly (The universe loves speed!).
-   **[Flask](http://flask.pocoo.org/)** - A microframework for Python based on Werkzeug, Jinja 2 and good intentions
-   **[Virtualenv](https://virtualenv.pypa.io/en/stable/)** - A tool to create isolated virtual environments
-   **[SQLite](https://www.sqlite.org/)** - An in-process library that implements a self-contained, serverless, zero-configuration, transactional SQL database engine
-   **[Elasticsearch](https://www.elastic.co/downloads/elasticsearch)** - A search engine based on the Lucene library
-   Minor dependencies can be found in the requirements.txt file.

### Installation / Usage

-   First ensure you have python3 globally installed in your computer. If not, you can get python3 [here](https://www.python.org).

-   After this, ensure you have installed virtualenv globally as well. If not, run this:

    ```bash
    pip install virtualenv
    ```

    Error: If you encounter the following error, then follow the fix below

    ```python
    ERROR: Could not install packages due to an EnvironmentError: [Errno 13] Permission denied: ...
    ```

    ```bash
    sudo -H pip install virtualenv
    ```

-   #### Dependencies

    -   Create and fire up your virtual environment in python3:

        ```bash
        virtualenv -p python3 venv
        source venv/bin/activate
        ```

        For _Windows_ you can use -

            venv/Scipts/activate.bat

-   #### Environment Variables

    -   Change directory to the folder

        ```bash
        $ cd fact-bounty-flask
        ```

    -   Create a .env file in the `fact-bounty-flask` folder and add the following:

        ```bash
        export FLASK_APP="app.py"
        export SECRET_KEY="some-very-long-string-of-random-characters-CHANGE-TO-YOUR-LIKING"
        export FLASK_ENV="development"
        export FLASK_CONFIG="development"

        export DEV_DATABASE_URL=""
        export TEST_DATABASE_URL=""
        export DATABASE_URL=""

        export ELASTIC_SEARCH_URL=""
        export ELASTIC_SEARCH_USERNAME=""
        export ELASTIC_SEARCH_PASSWORD=""

        export TZ="Asia/Colombo"

        export MAIL_USERNAME=""
        export MAIL_PASSWORD=""
        export FACTBOUNTY_ADMIN=""
        export MAIL_PORT="587"
        export MAIL_USE_TLS="true"
        export MAIL_SERVER="smtp.gmail.com"
        ```

    Save the file.

-   #### Install your requirements

    ```bash
        (venv)$ pip install -r requirements.txt
    ```

-   #### Set up github pre-hook

    ```bash
        (venv)$ pre-commit install
    ```

-   #### Running It

    On your terminal, run the server using this one simple command:

    ```bash
        (venv)$ flask run
    ```

-   #### Add sample data
    Browse to db folder inside `fact-Bounty` and run:
    ```bash
    (venv)$ cd db
    (venv)$ python add_es.py
    ```

### How to install Elasticsearch and start elasticsearch server

-   #### Elasticsearch v7.6.0 can be installed as follows

    ```bash
    wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.6.0-amd64.deb
    wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.6.0-amd64.deb.sha512
    shasum -a 512 -c elasticsearch-7.6.0-amd64.deb.sha512
    sudo dpkg -i elasticsearch-7.6.0-amd64.deb

    ```

    If you're an Arch Linux user, install it using the package manager, pacman

    ```bash
    sudo pacman -S elasticsearch
    ```

-   #### Check whether your system uses `init` or `systemd` by running command

    ```bash
    ps -p 1
    ```

-   #### Running Elasticsearch with SysV `init`

    -   Use the update-rc.d command to configure Elasticsearch to start automatically when the system boots up:
        ```bash
        sudo update-rc.d elasticsearch defaults 95 10
        ```
    -   Elasticsearch can be started and stopped using the service command:
        ```bash
        sudo -i service elasticsearch start
        sudo -i service elasticsearch stop
        ```

-   #### Running Elasticsearch with SysV `systemd`

    -   To configure Elasticsearch to start automatically when the system boots up, run the following commands:
        ```bash
        sudo /bin/systemctl daemon-reload
        sudo /bin/systemctl enable elasticsearch.service
        ```

    -   Elasticsearch can be started and stopped using the service command:
        ```bash
        sudo systemctl start elasticsearch.service sudo systemctl stop elasticsearch.service
        ```

    -   If you're facing issues in starting `elasticsearch.service`, check your system default Java version as Elasticsearch requires at least OpenJDK 10.

-   #### Check Elasticsearch server is running by
    `CURL` request:
    ```bash
    (venv)$ curl -X GET "localhost:9200/"
    ```
    or open <localhost:9200>

### How to Use

-   Use two terminals, one for `fact-bounty-flask` and the other for `fact-bounty-client`.

-   Run the flask server in the `fact-bounty-flask` folder:

    ```bash
    (venv)$ flask run
    ```

-   Start the npm server in fact-bounty-client directory.

    ```bash
    npm start
    ```

And use <localhost:3000> to browse.

> **NOTE**: This version is only supporting for Chrome browser. And make sure to install the extension -> Redux Dev Tools in chrome extension library.

### Running with Docker

-   #### Set DEV_DATABASE_URL as environment variable in fact-bounty-flask else it will connect to default i.e `data-dev.sqlite`

-   #### In the root of the project directory, run `docker-compose build`

    If you are on Linux machine, execute the following steps to install compose.

    ```bash
    sudo curl -L https://github.com/docker/compose/releases/download/1.17.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    ```

-   #### Set Environment Variables

    Create a .env file inside fact-bounty-flask and add the following:

    ```bash
    FLASK_APP="app.py"
    SECRET_KEY="some-very-long-string-of-random-characters-CHANGE-TO-YOUR-LIKING"
    FLASK_ENV="development"
    FLASK_CONFIG="development"

    DEV_DATABASE_URL=""
    TEST_DATABASE_URL=""
    DATABASE_URL=""

    ELASTIC_SEARCH_URL=""
    ELASTIC_SEARCH_USERNAME=""
    ELASTIC_SEARCH_PASSWORD=""

    TZ=“Asia/Colombo”
    ```

    Save the file.

-   #### Once build completes, run `docker-compose up`

## Setting up an OAuth Daemon

[How to setup OAuth Daemon](OAuthdSetup.md)

# How to Contribute

-   First fork the repository and clone it.
-   You can open issue regarding any problem according to the given issue template.
-   Make changes and do the PR according to the given template.

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fscorelab%2Ffact-Bounty.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fscorelab%2Ffact-Bounty?ref=badge_large)

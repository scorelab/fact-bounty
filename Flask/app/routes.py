from flask import render_template, flash, redirect, url_for, request
from app import app
from app.forms import LoginForm, RegistrationForm
from flask_login import current_user, login_user
from app.models import User
from flask_login import logout_user, login_required
from werkzeug.urls import url_parse
import os

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html',title='Home')

@app.route('/login', methods=['GET','POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index2')
        return redirect(next_page)
    return render_template('login.html',title='Sign In', form=form)
@app.route('/')
@app.route('/index2')
@login_required
def index2():
    return render_template('index2.html',title='Home')
    
@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index2'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index2'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        flash('Congratulations,You are now registered {},Please Login')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)


# Django Commands
- Created with `python -m pip install Django ` & `django-admin startproject backend`
- To create new apps: `python manage.py startapp appname`
- To create a django admin account: `python manage.py createsuperuser`
- To apply DB changes: `python manage.py makemigrations` & `python manage.py migrate`

# Django Libraries
- <b>django-cors-headers</b>: to avoid the 403 forbidden errors that are raised by using ReactJS as frontend
- <b>djangorestframework</b>: so we can use django rest framework for the views.py which simplifies syntax. so no need to have `@csrf_exempt`, or `json.loads(request.body)`. use `request.data` instead. has built in support for djangorestframework-simplejwt which we'll need for login
- <b>djangorestframework-simplejwt</b>: for stateless session tracking and login shinanigans. can use rest_framework.authtoken if you want it to be stateful
- <b>drf-spectacular</b>: creates api documentation. see http://localhost:8000/api/docs/



# Django Admin Accounts Created
- Username: CoreAdmin Email: nimashariat77@gmail.com Password: Goofy6540
- 


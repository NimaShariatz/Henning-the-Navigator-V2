# Startup
- Create a virtual environment
- CD to /backend and `pip install -r requirements.txt` followed by `python manage.py runserver`
- CD to /frontend and `npm install` followed by `npm run dev`


# Some Random Notes
- If a user is not logged in, GET requests are fine, but others will be rejected by backend --BASED ON THE SESSION PERMISSION STATUS--
- Limits on points is enforced on backend and frontend. Though frontend acts first, preventing a PUT request in the first place


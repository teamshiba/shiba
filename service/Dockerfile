FROM python:3.9.0

WORKDIR /app/

COPY requirements.txt /app/
RUN pip install -r requirements.txt

# Explicitly copy the file so that docker will raise an error if the
# file doesn't exist
COPY fbConfigs.json environ.json /app/
COPY . /app/

CMD gunicorn -w $(nproc) -b 0.0.0.0:8000 app:app

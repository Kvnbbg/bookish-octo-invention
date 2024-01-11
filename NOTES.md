## Error: 500 Internal Server Error

**Date:** 10/Jan/2024 06:22:20

**Description:** The server encountered an internal error and was unable to complete the request. This could be due to the server being overloaded or an error in the application.

**Details:**

The error occurred while trying to render the 'index.html' template. The traceback indicates a `TemplateSyntaxError` in 'base.html' due to a block name containing a hyphen, which is not allowed in Jinja. Block names must be valid Python identifiers and cannot contain hyphens. Use an underscore instead.

During the handling of this exception, another exception occurred. The application tried to render a '500.html' error page, but the 'macros.html' template could not be found, leading to a `TemplateNotFound` error.

**Traceback:**
ERROR:app:Server Error: 500 Internal Server Error: The server encountered an internal error and was unable to complete your request. Either the server is overloaded or there is an error in the application.
INFO:werkzeug:127.0.0.1 - - [10/Jan/2024 06:22:20] "[35m[1mGET / HTTP/1.1[0m" 500 -
ERROR:werkzeug:Error on request:
Traceback (most recent call last):
  File "/home/kevin/Documents/Github/bookish-octo-invention/app.py", line 81, in index
    return render_template('index.html') # Render the template located in /templates/index.html
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/flask/templating.py", line 152, in render_template
    return _render(app, template, context)
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/flask/templating.py", line 133, in _render
    rv = template.render(context)
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/jinja2/environment.py", line 1301, in render
    self.environment.handle_exception()
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/jinja2/environment.py", line 936, in handle_exception
    raise rewrite_traceback_stack(source=source)
  File "/home/kevin/Documents/Github/bookish-octo-invention/templates/index.html", line 2, in top-level template code
    {% extends 'base.html' %}
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/jinja2/environment.py", line 936, in handle_exception
    raise rewrite_traceback_stack(source=source)
  File "/home/kevin/Documents/Github/bookish-octo-invention/templates/base.html", line 19, in template
    <h1>{% block title-header %} Welcome {% endblock %}</h1>
jinja2.exceptions.TemplateSyntaxError: Block names in Jinja have to be valid Python identifiers and may not contain hyphens, use an underscore instead.

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/flask/app.py", line 1455, in wsgi_app
    response = self.full_dispatch_request()
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/flask/app.py", line 869, in full_dispatch_request
    rv = self.handle_user_exception(e)
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/flask/app.py", line 867, in full_dispatch_request
    rv = self.dispatch_request()
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/flask/app.py", line 852, in dispatch_request
    return self.ensure_sync(self.view_functions[rule.endpoint])(**view_args)
  File "/home/kevin/Documents/Github/bookish-octo-invention/app.py", line 84, in index
    return render_template('500.html'), 500
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/flask/templating.py", line 152, in render_template
    return _render(app, template, context)
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/flask/templating.py", line 133, in _render
    rv = template.render(context)
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/jinja2/environment.py", line 1301, in render
    self.environment.handle_exception()
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/jinja2/environment.py", line 936, in handle_exception
    raise rewrite_traceback_stack(source=source)
  File "/home/kevin/Documents/Github/bookish-octo-invention/templates/500.html", line 1, in top-level template code
    {% import 'macros.html' as macros %}
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/flask/templating.py", line 65, in get_source
    return self._get_source_fast(environment, template)
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/flask/templating.py", line 99, in _get_source_fast
    raise TemplateNotFound(template)
jinja2.exceptions.TemplateNotFound: macros.html

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/werkzeug/serving.py", line 362, in run_wsgi
    execute(self.server.app)
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/werkzeug/serving.py", line 323, in execute
    application_iter = app(environ, start_response)
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/flask/app.py", line 1478, in __call__
    return self.wsgi_app(environ, start_response)
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/flask/app.py", line 1458, in wsgi_app
    response = self.handle_exception(e)
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/flask/app.py", line 810, in handle_exception
    server_error = self.ensure_sync(handler)(server_error)
  File "/home/kevin/Documents/Github/bookish-octo-invention/app.py", line 216, in internal_server_error
    return render_template('500.html'), 500
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/flask/templating.py", line 152, in render_template
    return _render(app, template, context)
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/flask/templating.py", line 133, in _render
    rv = template.render(context)
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/jinja2/environment.py", line 1301, in render
    self.environment.handle_exception()
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/jinja2/environment.py", line 936, in handle_exception
    raise rewrite_traceback_stack(source=source)
  File "/home/kevin/Documents/Github/bookish-octo-invention/templates/500.html", line 1, in top-level template code
    {% import 'macros.html' as macros %}
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/flask/templating.py", line 65, in get_source
    return self._get_source_fast(environment, template)
  File "/home/kevin/Documents/Github/bookish-octo-invention/myflaskenv/lib/python3.10/site-packages/flask/templating.py", line 99, in _get_source_fast
    raise TemplateNotFound(template)
jinja2.exceptions.TemplateNotFound: macros.html


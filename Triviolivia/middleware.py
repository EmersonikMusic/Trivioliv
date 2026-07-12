from django.http import HttpResponsePermanentRedirect

class DomainRedirectMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        host = request.get_host()
        path = request.path

        # If the user is on the Heroku domain...
        if 'triviolivia.herokuapp.com' in host:
            # ...AND they are NOT trying to access /admin or /configure...
            if not (path.startswith('/admin') or path.startswith('/configure')):
                # ...redirect them to the custom domain.
                return HttpResponsePermanentRedirect('https://triviolivia.com' + path)

        # Otherwise, process the request normally on the current domain
        return self.get_response(request)
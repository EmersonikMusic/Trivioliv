from django.http import HttpResponsePermanentRedirect

class HerokuToCustomDomainRedirectMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check the host of the incoming request
        host = request.get_host()
        
        # If the request is hitting the Heroku domain, redirect it
        if host == 'triviolivia.herokuapp.com':
            # Construct the new URL keeping the exact path the user requested
            new_url = f"https://triviolivia.com{request.get_full_path()}"
            return HttpResponsePermanentRedirect(new_url)

        # Otherwise, process the request normally
        response = self.get_response(request)
        return response
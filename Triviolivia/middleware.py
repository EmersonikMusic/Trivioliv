from django.http import HttpResponsePermanentRedirect

class HerokuToCustomDomainRedirectMiddleware:
    """
    Redirects traffic from triviolivia.herokuapp.com to https://triviolivia.com
    while excluding specific paths.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        host = request.get_host()
        
        # Check if the request is coming from the Heroku app domain
        if host == 'triviolivia.herokuapp.com':
            path = request.path
            
            # Define the base paths that should NOT redirect
            excluded_paths = (
                '/api', 
                '/configure', 
                '/admin',       # Keep Django admin accessible on Heroku if needed
                '/static',      # Required if your excluded pages need to load CSS/JS
                '/images',      # Keep media files accessible just in case
            )
            
            # If the path does NOT start with any of the excluded paths, redirect (301)
            if not path.startswith(excluded_paths):
                # Construct the new URL and redirect
                new_url = f"https://triviolivia.com{path}"
                # Preserve query strings (e.g. ?q=search) if they exist
                if request.META.get('QUERY_STRING'):
                    new_url += f"?{request.META['QUERY_STRING']}"
                
                return HttpResponsePermanentRedirect(new_url)
        
        # Proceed as normal if it's not the heroku domain or it is an excluded path
        response = self.get_response(request)
        return response
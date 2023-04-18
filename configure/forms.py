from django.forms import ModelForm

from .models import *

class QuestionUpdateForm(ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['eras'].widget.attrs['class'] = 'multi-proof'

    class Meta:
        model=Question
        fields = ['text', 'answer','category', 'eras', 'difficulty',]
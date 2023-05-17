from django.forms import ModelForm

from .models import *

class QuestionUpdateForm(ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['eras'].widget.attrs['class'] = 'multi-proof'

    class Meta:
        model=Question
        fields = ['text', 'answer','category', 'eras', 'difficulty',]

class QuestionCreateForm(ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['subcategory'].queryset = Subcategory.objects.none()

        if 'category' in self.data:
            try:
                category_id = int(self.data.get('category'))
                self.fields['subcategory'].queryset = Subcategory.objects.filter(category_id=category_id).order_by('name')
                print('here')
            except (ValueError, TypeError):
                print('pass')
                pass
                
        elif self.instance.pk:
            self.fields['subcategory'].queryset = self.instance.category.subcategory_set.order_by('name')
            print('elif here')

    class Meta:
        model=Question
        fields = ['text', 'answer','category', 'eras', 'difficulty',]

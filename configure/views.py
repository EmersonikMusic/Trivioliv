from django.shortcuts import render
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse, reverse_lazy
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect
from django.http import HttpResponse

from .models import *
from .forms import *

import pandas as pd
import csv

# Create your views here.

@login_required
def export_to_csv(request):
    questions = Question.objects.all()

    response = HttpResponse('text/csv')
    response['Content-Disposition'] = 'attachment; filename=questions_export.csv'
    writer = csv.writer(response)
    writer.writerow(['name','text','response','answer','score','difficulty','eras','category','subcategory','tags','author','date_created','active'])
    question_fields = questions.values_list('name','text','response','answer','score','difficulty','eras','category','subcategory','tags','author','date_created','active')
    for question in question_fields:
        question.category= Category.objects.get(id=question.cateogry)
        writer.writerow(question)
    return(response)


@login_required
def main(request):

    context = {
        'categories': Category.objects.all()[:25],
        'eras': Era.objects.all()[:25],
        'difficulties': Difficulty.objects.all()[:25],
        'questions': Question.objects.all()[:25],
    }
    return render(request, 'configure/main.html',context)

def  question_list(request):

    if request.method=="POST":
        start_num=int(request.POST.get('start_num'))
        df=pd.read_csv('trivia_questions2.csv',sep=',')

        for q in range(start_num,len(df)):
            print(str(q)+ '. ' + df.iloc[q][4])
            question, created = Question.objects.update_or_create(text=df.iloc[q][4],
                                                    defaults={'answer':df.iloc[q][5],
                                                                'subcategory':Subcategory.objects.get(name=df.iloc[q][0]),
                                                                'category':Category.objects.get(name=df.iloc[q][1]),
                                                                'difficulty':Difficulty.objects.get(score=int(df.iloc[q][2])),
                                                                'author':request.user,
                                                                })


        return redirect('configure:question-list')
           
    context = {
        'questions': Question.objects.all()[:20],
    }

    return render(request, 'configure/question_list.html',context)
    

class QuestionCreateView(LoginRequiredMixin, CreateView):
    model = Question
    template_name = 'configure/question_create.html'
    fields = ['text', 'answer','category', 'subcategory', 'eras', 'difficulty', ]


    def get_success_url(self):
        return reverse('configure:question-list')
    
    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)
    
def batch(request,start_num=0):

    context={}

    return render(request, 'configure/question_batch.html',context)

def delete_all(request):

    Question.objects.all().delete()

    return reverse('configure:main')

def search_questions(request):
    question_results=[]
    if request.method == "POST":
        searched = request.POST['searched']
        question_results = Question.objects.filter(text__contains=searched)

    context={
        'results':question_results
    }

    return render(request, 'configure/search_questions.html', context)

class QuestionUpdateView(UpdateView):
    model = Question
    template_name = 'configure/question_update.html'
    form_class = QuestionUpdateForm
    success_url = reverse_lazy('configure:question-list')

class QuestionDeleteView(DeleteView):
    model = Question
    template_name = 'configure/question_delete.html'
    success_url =  reverse_lazy('configure:question-list')

class CategoryListView(ListView):
    model = Category
    template_name = 'configure/category_list.html'
    context_object_name = 'categories'
    paginate_by = 25

class CategoryDetailView(DetailView):
    model = Category
    template_name = 'configure/category_detail.html'
    context_object_name = 'category'

class CategoryCreateView(CreateView):
    model = Category
    template_name = 'configure/category_create.html'
    fields = ['name', 'description']

    def get_success_url(self):
        return reverse('configure:category-list')

class CategoryUpdateView(UpdateView):
    model = Category
    template_name = 'configure/category_update.html'
    fields = ['name', 'description','title']
    success_url =  reverse_lazy('configure:category-list')

class CategoryDeleteView(DeleteView):
    model = Category
    template_name = 'configure/category_delete.html'
    success_url =  reverse_lazy('configure:category-list')


class SubcategoryListView(ListView):
    model = Subcategory
    template_name = 'configure/subcategory_list.html'
    context_object_name = 'subcategories'
    paginate_by = 25

    def post(self, request, *args, **kwargs):
        df=pd.read_csv('subcategories.csv',sep=',')
        for i in range(len(df)):
            print(df.iloc[i][0])
            subcategory, created = Subcategory.objects.update_or_create(name=df.iloc[i][1],
                                                    defaults={'category':Category.objects.get(name=df.iloc[i][0]),
                                                                })
        return redirect('configure:subcategory-list')

class SubcategoryDetailView(DetailView):
    model = Subcategory
    template_name = 'configure/subcategory_detail.html'
    context_object_name = 'subcategory'

class SubcategoryCreateView(CreateView):
    model = Subcategory
    template_name = 'configure/subcategory_create.html'
    fields = ['name', 'description']

    def get_success_url(self):
        return reverse('configure:subcategory-list')

class SubcategoryUpdateView(UpdateView):
    model = Subcategory
    template_name = 'configure/subcategory_update.html'
    fields = ['name', 'description','title']
    success_url =  reverse_lazy('configure:subcategory-list')

class SubcategoryDeleteView(DeleteView):
    model = Subcategory
    template_name = 'configure/subcategory_delete.html'
    success_url =  reverse_lazy('configure:subcategory-list')

class EraListView(ListView):
    model = Era
    template_name = 'configure/era_list.html'
    context_object_name = 'eras'
    paginate_by = 25

class EraCreateView(CreateView):
    model = Era
    template_name = 'configure/era_create.html'
    fields = ['name', 'description','title']

    def get_success_url(self):
        return reverse('configure:era-list')

class EraUpdateView(UpdateView):
    model = Era
    template_name = 'configure/era_update.html'
    fields = ['name', 'description']
    success_url =  reverse_lazy('configure:era-list')

class EraDeleteView(DeleteView):
    model = Era
    template_name = 'configure/era_delete.html'
    success_url =  reverse_lazy('configure:era-list')

class DifficultyListView(ListView):
    model = Difficulty
    template_name = 'configure/difficulty_list.html'
    context_object_name = 'difficulties'
    paginate_by = 25

class DifficultyCreateView(CreateView):
    model = Difficulty
    template_name = 'configure/difficulty_create.html'
    fields = ['name', 'description','score']

    def get_success_url(self):
        return reverse('configure:difficulty-list')

class DifficultyUpdateView(UpdateView):
    model = Difficulty
    template_name = 'configure/difficulty_update.html'
    fields = ['name', 'description']
    success_url =  reverse_lazy('configure:difficulty-list')

class DifficultyDeleteView(DeleteView):
    model = Difficulty
    template_name = 'configure/difficulty_delete.html'
    success_url =  reverse_lazy('configure:difficulty-list')

def load_subcategories(request):
    category_id = request.GET.get('category')
    subcategories = Subcategory.objects.filter(category_id=category_id).order_by('name')
    return render(request, 'configure/subcategory_dropdown_list_options.html', {'subcategories': subcategories})
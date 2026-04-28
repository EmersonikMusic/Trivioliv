from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse, reverse_lazy
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse

from .models import *
from .forms import *

import pandas as pd
import csv

@login_required
def listify_eras(request):
    questions = Question.objects.all()
    era_not_assigned, _ = Era.objects.get_or_create(name="Not Assigned")
    for question in questions:
        question.eras_list = ", ".join([e.name for e in question.eras.all()])
    
        if not question.eras_list:
            question.eras.add(era_not_assigned)
            question.save()
            question.eras_list = ", ".join([e.name for e in question.eras.all()])
        
        question.save()
    return redirect('configure:question-list')

@login_required
def export_to_csv(request):
    question_list = Question.objects.all()
    response = HttpResponse('text/csv')
    response['Content-Disposition'] = 'attachment; filename=questions_export.csv'
    writer = csv.writer(response)
    writer.writerow(['text','response','answer','score','difficulty','category','subcategory', 'eras'])
    question_fields = question_list.values_list('text','response','answer','score','difficulty__name','category__name','subcategory__name','eras_list')
    
    for q in question_fields:
        writer.writerow(q)
    return response

@login_required
def main(request):
    context = {
        'categories': Category.objects.all()[:25],
        'eras': Era.objects.all()[:25],
        'difficulties': Difficulty.objects.all()[:25],
        'questions': Question.objects.all()[:25],
    }
    return render(request, 'configure/main.html', context)

@login_required
def question_list(request):
    if request.method == "POST":
        start_num_raw = request.POST.get('start_num')
        try:
            start_num = int(start_num_raw) if start_num_raw else 0
        except ValueError:
            start_num = 0

        # Safely fetch the uploaded file or fallback to local
        csv_file = request.FILES.get('csv_file')
        if not csv_file:
            csv_file = 'trivia_questions2.csv'
            
        try:
            df = pd.read_csv(csv_file, sep=',')
        except Exception as e:
            return HttpResponse(f"Error loading CSV file: {e}", status=400)

        for q in range(start_num, len(df)):
            try:  # This overarching TRY block prevents a 500 error if any row is corrupted
                # Ensure the row has enough columns to prevent IndexError
                if df.shape[1] < 6:
                    continue

                text_val = df.iloc[q][4]
                if pd.isna(text_val):
                    continue
                
                # 1. Category (Truncate to 64 chars to prevent DataError)
                cat_name = df.iloc[q][1]
                category = None
                if not pd.isna(cat_name):
                    category, _ = Category.objects.get_or_create(name=str(cat_name)[:64])

                # 2. Subcategory
                subcat_name = df.iloc[q][0]
                subcategory = None
                if not pd.isna(subcat_name):
                    defaults = {'category': category} if category else {}
                    try:
                        subcategory, _ = Subcategory.objects.get_or_create(name=str(subcat_name)[:64], defaults=defaults)
                    except Exception:
                        subcategory = Subcategory.objects.filter(name=str(subcat_name)[:64]).first()

                # 3. Difficulty
                diff_val = df.iloc[q][2]
                difficulty = None
                if not pd.isna(diff_val):
                    try:
                        score = int(diff_val)
                        difficulty, _ = Difficulty.objects.get_or_create(
                            score=score, 
                            defaults={'name': f'Difficulty {score}'}
                        )
                    except Exception:
                        # Fallback if a Difficulty exists with that score under a different name
                        difficulty = Difficulty.objects.filter(score=score).first()
                        if not difficulty:
                            difficulty = Difficulty.objects.create(score=score, name=f'Difficulty {score} (Dup)')

                # Skip row if missing required foreign keys to prevent IntegrityError
                if not category or not difficulty:
                    print(f"Row {q} missing required category or difficulty. Skipping.")
                    continue

                answer_val = df.iloc[q][5]
                
                # 4. Create Question (Truncate limits to prevent DataError)
                question, _ = Question.objects.update_or_create(
                    text=str(text_val)[:511],
                    defaults={
                        'answer': str(answer_val)[:256] if not pd.isna(answer_val) else "N/A",
                        'subcategory': subcategory,
                        'category': category,
                        'difficulty': difficulty,
                        'author': request.user,
                    }
                )

                # 5. Automatically Map Eras (Index 3)
                eras_val = df.iloc[q][3]
                if not pd.isna(eras_val):
                    era_names = [e.strip() for e in str(eras_val).split(',')]
                    for en in era_names:
                        if en:
                            era_obj, _ = Era.objects.get_or_create(name=en[:64])
                            question.eras.add(era_obj)

            except Exception as e:
                # Catch absolutely everything for this row so the batch doesn't crash
                print(f"Row {q} crashed: {e}")
                continue

        return redirect('configure:question-list')
           
    context = {
        'questions': Question.objects.all()[:20],
    }
    return render(request, 'configure/question_list.html', context)
class QuestionCreateView(LoginRequiredMixin, CreateView):
    model = Question
    template_name = 'configure/question_create.html'
    fields = ['text', 'answer','category', 'subcategory', 'eras', 'difficulty']

    def get_success_url(self):
        return reverse('configure:question-list')
    
    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)
    
def batch(request, start_num=0):
    context = {}
    return render(request, 'configure/question_batch.html', context)

def delete_all(request):
    Question.objects.all().delete()
    return redirect('configure:main')

def search_questions(request):
    question_results = []
    if request.method == "POST":
        searched = request.POST.get('searched', '')
        question_results = Question.objects.filter(text__icontains=searched)

    context = {
        'results': question_results
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
        # Support file uploads with robust fallback
        csv_file = request.FILES.get('csv_file', 'subcategories.csv')
        try:
            df = pd.read_csv(csv_file, sep=',')
            for i in range(len(df)):
                cat_name = df.iloc[i][0]
                subcat_name = df.iloc[i][1]
                
                if pd.isna(cat_name) or pd.isna(subcat_name):
                    continue

                category, _ = Category.objects.get_or_create(name=cat_name)
                Subcategory.objects.update_or_create(
                    name=subcat_name,
                    defaults={'category': category}
                )
        except Exception as e:
            return HttpResponse(f"Error importing subcategories: {e}", status=400)
            
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
    fields = ['name', 'description']

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
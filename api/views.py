from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import Http404
from rest_framework import generics

import random

from .serializers import *
from configure.models import *
# Create your views here.

class QuestionList(generics.ListAPIView):
    serializer_class = QuestionSerializer

    def get_queryset(self):
            """
            Optionally restricts the returned purchases to a given user,
            by filtering against a `username` query parameter in the URL.
            """
            queryset = Question.objects.all()
            category = self.request.query_params.get('category')
            era= self.request.query_params.get('era')
            difficulty = self.request.query_params.get('difficulty')
            questions = self.request.query_params.get('questions')

            if category is not None:
                cat_list = category.split(',')
                queryset = queryset.exclude(category__id__in=cat_list)
            
            if era is not None:
                banned_era_list = era.split(',')
                valid_eras = Era.objects.exclude(id__in=banned_era_list)
                print(valid_eras)
                queryset = queryset.filter(eras__id__in=valid_eras)
            
            if difficulty is not None:
                diff_list = difficulty.split(',')
                queryset = queryset.exclude(difficulty__id__in=diff_list)

            num_questions=1
            if questions is not None:
                num_questions=int(questions)

            i=1
            question_list=[]
            q_list = queryset
            print(num_questions)
            while i <= num_questions:
                random_question = random.choice(q_list)
                question_list.append(random_question.id)
                q_list = q_list.exclude(id=random_question.id)
                i=i+1
            print(question_list)

            return queryset.filter(id__in=question_list).distinct()
    
class QuestionDetail(APIView):
    def get_object(self, pk):
        try:
            return Question.objects.get(pk=pk)
        except:
            raise Http404
    
    def get(self, request, pk):
        question = self.get_object(pk)
        serializer = QuestionSerializer(question)
        return Response(serializer.data)

class UserList(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
class CategoryList(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

class DifficultyList(APIView):
    def get(self, request):
        difficulties = Difficulty.objects.all()
        serializer = DifficultySerializer(difficulties, many=True)
        return Response(serializer.data)
    
class EraList(APIView):
    def get(self, request):
        eras = Era.objects.all()
        serializer = EraSerializer(eras, many=True)
        return Response(serializer.data)
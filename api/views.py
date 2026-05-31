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
        era = self.request.query_params.get('era')
        difficulty = self.request.query_params.get('difficulty')
        questions = self.request.query_params.get('questions')

        if category is not None:
            cat_list = category.split(',')
            queryset = queryset.filter(category__id__in=cat_list)
        
        if era is not None:
            era_list = era.split(',')
            queryset = queryset.filter(eras__id__in=era_list)
        
        if difficulty is not None:
            diff_list = difficulty.split(',')
            queryset = queryset.filter(difficulty__id__in=diff_list)

        num_questions = 1
        if questions is not None:
            num_questions = int(questions)

        valid_ids = list(queryset.values_list('id', flat=True))
        
        if num_questions > len(valid_ids):
            num_questions = len(valid_ids)
            
        random_ids = random.sample(valid_ids, num_questions)
        return queryset.filter(id__in=random_ids).distinct()
    
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
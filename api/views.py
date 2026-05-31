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
        # FIX 1: Only query questions that are marked active in the database
        queryset = Question.objects.filter(active=True)
        
        category = self.request.query_params.get('category')
        era = self.request.query_params.get('era')
        difficulty = self.request.query_params.get('difficulty')
        questions = self.request.query_params.get('questions')

        # Exclude categories passed in the URL
        if category is not None:
            cat_list = category.split(',')
            queryset = queryset.exclude(category__id__in=cat_list)
        
        # FIX 2: Correctly exclude ANY question that contains a banned era
        if era is not None:
            banned_era_list = era.split(',')
            queryset = queryset.exclude(eras__id__in=banned_era_list)
        
        # Exclude difficulties passed in the URL
        if difficulty is not None:
            diff_list = difficulty.split(',')
            queryset = queryset.exclude(difficulty__id__in=diff_list)

        # Determine number of questions requested
        num_questions = int(questions) if questions is not None else 1

        # FIX 3: Safely and efficiently select random questions without crashing
        # Get a flat list of all valid question IDs that survived the filters
        valid_ids = list(queryset.values_list('id', flat=True))
        
        # Prevent IndexError if they request more questions than are available
        if num_questions > len(valid_ids):
            num_questions = len(valid_ids)

        # Use random.sample to grab unique random IDs
        random_question_ids = random.sample(valid_ids, num_questions)

        # Return the final filtered queryset based on those random IDs
        return queryset.filter(id__in=random_question_ids)
    
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
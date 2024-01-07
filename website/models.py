from django.db import models

# Define your models here
class MyModel(models.Model):
  # Define your fields here
  field1 = models.CharField(max_length=100)
  field2 = models.IntegerField()
  
  # Add any additional methods or properties here
  def __str__(self):
    return self.field1
from flask import Flask, render_template

app = Flask(__name__)

# Sample recipe data
recipes = [
    {
        'title': 'Pasta Carbonara',
        'ingredients': ['Spaghetti', 'Eggs', 'Bacon', 'Parmesan Cheese'],
        'instructions': 'Cook spaghetti. Fry bacon. Mix eggs and cheese. Combine all.'
    },
    {
        'title': 'Chocolate Cake',
        'ingredients': ['Flour', 'Sugar', 'Cocoa Powder', 'Eggs', 'Milk'],
        'instructions': 'Mix dry ingredients. Add wet ingredients. Bake at 350°F.'
    }
]

@app.route('/')
def index():
    return render_template('index.html', recipes=recipes)

@app.route('/recipe/<int:recipe_id>')
def recipe(recipe_id):
    recipe = recipes[recipe_id]
    return render_template('recipe.html', recipe=recipe)

if __name__ == '__main__':
    app.run(debug=True)
